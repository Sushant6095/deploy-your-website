require('dotenv').config(); // Import dotenv for environment variables
const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const { Server } = require('socket.io');
const cors = require('cors');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@clickhouse/client');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9000;

const prisma = new PrismaClient({});

const io = new Server({ cors: '*' });

const kafka = new Kafka({
  clientId: 'api-server',
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, process.env.KAFKA_SSL_CERT), 'utf-8')],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: 'plain',
  },
});

const client = createClient({
  host: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

const consumer = kafka.consumer({ groupId: 'api-server-logs-consumer' });

io.on('connection', (socket) => {
  socket.on('subscribe', (channel) => {
    socket.join(channel);
    socket.emit('message', JSON.stringify({ log: `Subscribed to ${channel}` }));
  });
});

io.listen(process.env.SOCKET_PORT || 9002, () => console.log('Socket Server running'));

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const config = {
  CLUSTER: process.env.ECS_CLUSTER_ARN,
  TASK: process.env.ECS_TASK_DEFINITION_ARN,
};

app.use(express.json());
app.use(cors());

app.post('/project', async (req, res) => {
  const schema = z.object({
    name: z.string(),
    gitURL: z.string(),
  });
  const safeParseResult = schema.safeParse(req.body);

  if (safeParseResult.error) return res.status(400).json({ error: safeParseResult.error });

  const { name, gitURL } = safeParseResult.data;

  const project = await prisma.project.create({
    data: {
      name,
      gitURL,
      subDomain: generateSlug(),
    },
  });

  return res.json({ status: 'success', data: { project } });
});

app.post('/deploy', async (req, res) => {
  const { projectId } = req.body;

  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) return res.status(404).json({ error: 'Project not found' });

  const deployment = await prisma.deployement.create({
    data: {
      project: { connect: { id: projectId } },
      status: 'QUEUED',
    },
  });

  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: 'FARGATE',
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: process.env.SUBNETS.split(','), // Comma-separated subnet IDs
        securityGroups: process.env.SECURITY_GROUPS.split(','), // Comma-separated security group IDs
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.CONTAINER_NAME,
          environment: [
            { name: 'GIT_REPOSITORY__URL', value: project.gitURL },
            { name: 'PROJECT_ID', value: projectId },
            { name: 'DEPLOYEMENT_ID', value: deployment.id },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);

  return res.json({ status: 'queued', data: { deploymentId: deployment.id } });
});

app.get('/logs/:id', async (req, res) => {
  const id = req.params.id;
  const logs = await client.query({
    query: `SELECT event_id, deployment_id, log, timestamp FROM log_events WHERE deployment_id = {deployment_id:String}`,
    query_params: {
      deployment_id: id,
    },
    format: 'JSONEachRow',
  });

  const rawLogs = await logs.json();

  return res.json({ logs: rawLogs });
});

async function initKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ['container-logs'], fromBeginning: true });

  await consumer.run({
    eachBatch: async function ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) {
      const messages = batch.messages;
      console.log(`Received ${messages.length} messages`);
      for (const message of messages) {
        if (!message.value) continue;
        const stringMessage = message.value.toString();
        const { PROJECT_ID, DEPLOYEMENT_ID, log } = JSON.parse(stringMessage);
        console.log({ log, DEPLOYEMENT_ID });
        try {
          const { query_id } = await client.insert({
            table: 'log_events',
            values: [{ event_id: uuidv4(), deployment_id: DEPLOYEMENT_ID, log }],
            format: 'JSONEachRow',
          });
          console.log(query_id);
          resolveOffset(message.offset);
          await commitOffsetsIfNecessary(message.offset);
          await heartbeat();
        } catch (err) {
          console.log(err);
        }
      }
    },
  });
}

initKafkaConsumer();

app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
