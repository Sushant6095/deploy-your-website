Setup Guide
This Project contains following services and folders:

api-server: HTTP API Server for REST API's
build-server: Docker Image code which clones, builds and pushes the build to S3
s3-reverse-proxy: Reverse Proxy the subdomains and domains to s3 bucket static assets
Local Setup
Run npm install in all the 3 services i.e. api-server, build-server and s3-reverse-proxy
Docker build the build-server and push the image to AWS ECR.
Setup the api-server by providing all the required config such as TASK ARN and CLUSTER arn.
Run node index.js in api-server and s3-reverse-proxy
At this point following services would be up and running:

S.No	Service	PORT
1	api-server	:9000
2	socket.io-server	:9002
3	s3-reverse-proxy	:8000

A scalable, modern deployment platform inspired by Vercel, designed to simplify the deployment and management of applications. This project leverages a powerful stack of technologies including Node.js, Docker, AWS ECS/ECR, Kafka, and ClickHouse to provide seamless, efficient, and reliable application hosting.



## 🛠 Tech Stack

- **Frontend**: Next.js
- **Backend**: Next.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Video Handling**: Cloudinary
- **Type Safety**: ZOD, react-hook-form
- **Language**: TypeScript
- **Authentication**: JWT

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


Architecture
![Screenshot 2024-10-21 013511](https://github.com/user-attachments/assets/60307727-b8b3-4b6a-843e-5589f093f9aa)
