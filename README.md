# Project 1: Full-Stack Containerized Web App with CI/CD

A modern, production-ready web application demonstrating containerization, CI/CD, and cloud deployment best practices.

## 🎯 Project Goals

- Build a full-stack web application
- Implement Docker containerization
- Set up automated CI/CD pipeline
- Deploy to cloud platform
- Demonstrate DevOps best practices

## 🛠️ Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS/Azure
- **Reverse Proxy**: Nginx

## 📁 Project Structure

```
project-1/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express API
├── database/          # Database initialization scripts
├── nginx/             # Nginx configuration
├── docker-compose.yml # Multi-container orchestration
├── Dockerfile.*       # Individual service Dockerfiles
├── .github/           # GitHub Actions workflows
└── docs/              # Documentation and diagrams
```

## 🚀 Features

- **Modern UI**: Responsive React frontend with TypeScript
- **RESTful API**: Node.js backend with Express
- **Database Integration**: PostgreSQL with proper migrations
- **Containerization**: Multi-container Docker setup
- **CI/CD Pipeline**: Automated testing and deployment
- **Cloud Deployment**: Production-ready cloud deployment
- **Monitoring**: Basic health checks and logging

## 🏃‍♂️ Quick Start

1. **Clone and navigate to project**:
   ```bash
   cd devops-portfolio/project-1
   ```

2. **Start with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

## 📚 Learning Outcomes

After completing this project, you'll understand:
- Docker containerization best practices
- Multi-container application orchestration
- CI/CD pipeline design and implementation
- Cloud deployment strategies
- Database containerization
- Reverse proxy configuration
- Environment management
- Health checks and monitoring

## 🔧 Development Setup

See individual service READMEs for detailed setup instructions:
- [Frontend Setup](frontend/README.md)
- [Backend Setup](backend/README.md)
- [Database Setup](database/README.md)
