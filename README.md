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


Architecture
![Screenshot 2024-10-21 013511](https://github.com/user-attachments/assets/60307727-b8b3-4b6a-843e-5589f093f9aa)
