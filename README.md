# VERCEL(DEPLOY-YOUR-WEBSITE) 

A scalable, modern deployment platform inspired by Vercel, designed to simplify the deployment and management of applications. This project leverages a powerful stack of technologies including Node.js, Docker, AWS ECS/ECR, Kafka, and ClickHouse to provide seamless, efficient, and reliable application hosting.

## 🛠 Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js: Core backend for handling APIs and business logic.
               Express.js: Framework for building REST APIs.
- **ORM**: Prisma.
- **Containerization**: Docker: Used to containerize applications for consistent deployment.
                         Docker Compose: Manages multi-container setups for local development.
- **Cloud Infrastructure**: AWS ECS/ECR: Elastic Container Service for orchestrating Docker containers, and Elastic Container Registry for storing Docker images.
                          
-**Data Pipeline** :
  Kafka: Message broker for processing and managing real-time deployment logs.
  ClickHouse: Fast and efficient analytics database for querying deployment metrics.

-**Database**
PostgreSQL: Database for storing deployment metadata.
Redis: Caching layer for improved performance.
AWS S3: Storage for static assets and deployment logs.

- **Type Safety**: ZOD, react-hook-form
- **Language**: TypeScript
- **Authentication**: JWT

### Setup Guide

This Project contains following services and folders:

- `api-server`: HTTP API Server for REST API's
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `s3-reverse-proxy`: Reverse Proxy the subdomains and domains to s3 bucket static assets

### Local Setup

1. Run `npm install` in all the 3 services i.e. `api-server`, `build-server` and `s3-reverse-proxy`
2. Docker build the `build-server` and push the image to AWS ECR.
3. Setup the `api-server` by providing all the required config such as TASK ARN and CLUSTER arn.
4. Run `node index.js` in `api-server` and `s3-reverse-proxy`

At this point following services would be up and running:

| S.No | Service            | PORT    |
| ---- | ------------------ | ------- |
| 1    | `api-server`       | `:9000` |
| 2    | `socket.io-server` | `:9002` |
| 3    | `s3-reverse-proxy` | `:8000` |



## 🚀 Features

1. **Video/Announcement Upload**: Users can upload videos and announcements.
2. **Engagement**: Like, dislike, and comment on videos and announcements.
3. **Bookmark/Watch Later**: Bookmark announcements and add videos to the watch later list.
4. **Video Recommendations**: Personalized video recommendations based on tags.
5. **Video Preview**: Hover over a video to get a quick preview.


Features
Fast Deployments: Quickly deploy applications using containerized services.
Scalable Architecture: Built to scale seamlessly with Docker and AWS ECS.
Real-Time Logs: Track and analyze deployment events using Kafka and ClickHouse.
Multi-Region Support: Deploy applications across multiple AWS regions.
Version Management: Manage versions of deployments efficiently.
Developer-Friendly APIs: Expose simple REST APIs for deployment and application management.
Tech Stack
Backend
Node.js: Core backend for handling APIs and business logic.
Express.js: Framework for building REST APIs.
Containerization
Docker: Used to containerize applications for consistent deployment.
Docker Compose: Manages multi-container setups for local development.
Cloud Infrastructure
AWS ECS/ECR: Elastic Container Service for orchestrating Docker containers, and Elastic Container Registry for storing Docker images.
AWS S3: Storage for static assets and deployment logs.
Data Pipeline
Kafka: Message broker for processing and managing real-time deployment logs.
ClickHouse: Fast and efficient analytics database for querying deployment metrics.
Other Tools
PostgreSQL: Database for storing deployment metadata.
Redis: Caching layer for improved performance.
Jest: Unit testing framework.


## **Environment Variables**

This project uses a `.env` file to securely store API keys. Create a `.env` file in the proxy server directory with the following keys:
# env for api-server
```env
 AWS_ACCESS_KEY_ID =  
 AWS_SECRET_ACCESS_KEY =

AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
KAFKA_BROKER=your-kafka-broker
KAFKA_USERNAME=your-kafka-username
KAFKA_PASSWORD=your-kafka-password
PROJECT_ID=your-project-id
DEPLOYEMENT_ID=your-deployment-id
S3_BUCKET_NAME=your-s3-bucket-name

DATABASE_URL
PORT=9000
SOCKET_PORT=9002

AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

ECS_CLUSTER_ARN=arn:aws:ecs:region:account-id:cluster/your-cluster-name
ECS_TASK_DEFINITION_ARN=arn:aws:ecs:region:account-id:task-definition/your-task-name

SUBNETS=subnet-xxxxxx,subnet-yyyyyy,subnet-zzzzzz
SECURITY_GROUPS=sg-xxxxxx

KAFKA_BROKER=kafka-broker-url:port
KAFKA_USERNAME=your-kafka-username
KAFKA_PASSWORD=your-kafka-password
KAFKA_SSL_CERT=kafka.pem

CLICKHOUSE_HOST=https://your-clickhouse-host
CLICKHOUSE_DATABASE=default
CLICKHOUSE_USERNAME=your-clickhouse-username
CLICKHOUSE_PASSWORD=your-clickhouse-password

CONTAINER_NAME=builder-image-latest




```
# env for build-server
```env
 AWS_ACCESS_KEY_ID = 'AKIAXWMA6LCU*******' ,
 AWS_SECRET_ACCESS_KEY ='QQcJy+pyMSpPDkavXyY************************'

AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
KAFKA_BROKER=your-kafka-broker
KAFKA_USERNAME=your-kafka-username
KAFKA_PASSWORD=your-kafka-password
PROJECT_ID=your-project-id
DEPLOYEMENT_ID=your-deployment-id
S3_BUCKET_NAME=your-s3-bucket-name



---

## **Deployment**

### Docker
1. Build the Docker image:
   ```bash
   docker build -t proxy-server .
   docker build -t build-server .
   ```
2. Run the container:
   ```bash
   docker run -p 3001:3001 proxy-server
   docker run -p 3001:3001 build-server


Architecture
![Screenshot 2024-10-21 013511](https://github.com/user-attachments/assets/60307727-b8b3-4b6a-843e-5589f093f9aa)
