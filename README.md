# CloudTask

CloudTask is a simple **Task Management REST API** built using **Java and Spring Boot**. It provides APIs for creating, viewing, updating, completing, and deleting tasks.

The project was initially developed as a practical Spring Boot application and is also designed to demonstrate how a Java backend application can be deployed on a **Linux-based AWS EC2 virtual server**.

## Purpose

The purpose of CloudTask is to build a clean and simple backend system while learning and demonstrating:

* Java and Object-Oriented Programming
* Spring Boot
* REST API development
* HTTP methods and status codes
* Request validation
* Exception handling
* Layered backend architecture
* Linux server deployment
* AWS EC2
* Nginx reverse proxy
* Git and GitHub

The project intentionally starts with a simple architecture so that the core backend concepts and deployment workflow can be understood clearly.

## Features

* Create a task
* Retrieve all tasks
* Retrieve a task by ID
* Update an existing task
* Mark a task as completed
* Delete a task
* Request validation
* Global exception handling
* Automatic task creation timestamp
* RESTful API structure

## Technology Stack

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| Java 21           | Programming language            |
| Spring Boot       | Backend framework               |
| Spring Web        | REST API development            |
| Spring Validation | Request validation              |
| Lombok            | Reducing boilerplate code       |
| Maven             | Build and dependency management |
| Apache Tomcat     | Embedded web server             |
| AWS EC2           | Cloud deployment                |
| Ubuntu Linux      | Server operating system         |
| Nginx             | Reverse proxy                   |
| Git               | Version control                 |
| GitHub            | Source code hosting             |

## Project Architecture

```text
Client / Postman
       |
       v
    Nginx
    Port 80
       |
       v
 Spring Boot
    Port 8080
       |
       v
  Controller
       |
       v
   Service
       |
       v
  Repository
       |
       v
 In-Memory Storage
```

The application follows a simple layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
```

### Controller

Handles HTTP requests and exposes the REST API endpoints.

### Service

Contains the application's business logic.

### Repository

Manages task storage and retrieval.

### Model

Represents the task data.

### Exception Handling

A global exception handler provides structured error responses for situations such as requesting a task that does not exist or submitting invalid data.

## API Endpoints

### Create a Task

```http
POST /api/tasks
```

Example request:

```json
{
    "title": "Deploy CloudTask",
    "description": "Deploy the application on AWS EC2"
}
```

### Get All Tasks

```http
GET /api/tasks
```

### Get Task by ID

```http
GET /api/tasks/{id}
```

Example:

```http
GET /api/tasks/1
```

### Update a Task

```http
PUT /api/tasks/{id}
```

Example:

```json
{
    "title": "Deploy CloudTask on AWS",
    "description": "Configure EC2 and Nginx",
    "completed": false
}
```

### Complete a Task

```http
PATCH /api/tasks/{id}/complete
```

### Delete a Task

```http
DELETE /api/tasks/{id}
```

## Validation

CloudTask validates incoming requests before they reach the business logic.

For example:

* Task title cannot be blank.
* Task title cannot exceed 100 characters.
* Task description cannot exceed 500 characters.

Invalid requests return an appropriate `400 Bad Request` response.

## Error Handling

CloudTask uses centralized exception handling to provide structured error responses.

Example:

```json
{
    "message": "Task not found with id: 10",
    "error": "Not Found",
    "path": "/api/tasks/10",
    "status": 404,
    "timestamp": "2026-09-24T12:00:00"
}
```

## Running the Project Locally

### Prerequisites

Make sure the following are installed:

* Java 21
* Maven
* Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd CloudTask
```

### Build the Project

```bash
mvn clean package
```

### Run the Application

```bash
java -jar target/cloudtask-0.0.1-SNAPSHOT.jar
```

The application will start on:

```text
http://localhost:8080
```

The API can then be accessed through:

```text
http://localhost:8080/api/tasks
```

You can test the API using Postman, curl, or another REST API client.

## AWS EC2 Deployment

CloudTask is designed to be deployed on an AWS EC2 Linux server.

The deployment architecture is:

```text
Internet
    |
    v
AWS EC2
    |
    v
Nginx :80
    |
    v
Spring Boot :8080
    |
    v
CloudTask
```

Nginx acts as a reverse proxy and forwards incoming HTTP requests to the Spring Boot application.

The Spring Boot application does not need to expose port `8080` directly to the public Internet.

## Current Storage

The current version uses **in-memory storage** through a concurrent map.

This keeps the project simple and allows the backend and AWS deployment concepts to be demonstrated without introducing unnecessary database configuration.

Because the current storage is in memory, tasks are not permanently stored when the application is restarted.

## Future Scope

CloudTask is designed to grow from a simple task manager into a more complete task management platform.

### 1. User Accounts and Authentication

The system can be extended to support multiple users.

Future versions can include:

* User registration
* Login
* Password hashing
* JWT-based authentication
* Role-based authorization
* User-specific task management

Instead of all users sharing the same task collection, each authenticated user would have their own tasks.

```text
User
 |
 ├── Task 1
 ├── Task 2
 └── Task 3
```

### 2. Database Integration

The current in-memory repository can be replaced with persistent database storage.

Possible technologies include:

* PostgreSQL
* Spring Data JPA
* Hibernate

This would allow tasks and user information to remain available after application restarts.

### 3. Frontend Application

A dedicated frontend can be developed using technologies such as:

* React
* TypeScript
* HTML/CSS

The frontend could provide:

* Login and registration
* Task dashboard
* Task creation and editing
* Task filtering
* Task search
* Task completion tracking

### 4. AI-Powered Task Management

An AI layer can eventually be integrated into CloudTask.

Possible features include:

* Natural-language task creation
* Automatic task categorization
* Priority prediction
* Task summarization
* Intelligent deadline suggestions
* Breaking large tasks into smaller subtasks
* AI-generated task recommendations

For example:

```text
User:
"Remind me to finish my AWS project before Friday."

             ↓

        AI Processing

             ↓

Task:
Title: Finish AWS Project
Priority: High
Deadline: Friday
Category: Academic
```

### 5. Notifications

Future versions could provide:

* Email notifications
* Deadline reminders
* Task completion notifications
* Scheduled reminders

### 6. Advanced Task Management

The application can eventually support:

* Task priorities
* Categories
* Tags
* Deadlines
* Recurring tasks
* Subtasks
* Task search
* Filtering and sorting
* Task history

### 7. Docker and Cloud Deployment

The application can be containerized using Docker and deployed using modern cloud infrastructure.

Possible future architecture:

```text
React Frontend
       |
       v
   API Gateway
       |
       v
Spring Boot Backend
       |
       +------ PostgreSQL
       |
       +------ Redis
       |
       +------ AI Service
```

### 8. Scalable Architecture

As the number of users grows, CloudTask can evolve from a simple monolithic application into a more scalable architecture using:

* Docker
* Kubernetes
* AWS services
* Redis
* Message queues
* Microservices

The architecture would be introduced only when the application's scale requires it rather than adding unnecessary complexity at the beginning.

## Project Roadmap

```text
Current
  │
  ├── REST API
  ├── Validation
  ├── Exception Handling
  └── AWS EC2 Deployment
        │
        ▼
Phase 2
  │
  ├── PostgreSQL
  ├── JPA/Hibernate
  └── User Authentication
        │
        ▼
Phase 3
  │
  ├── React Frontend
  ├── User-specific Tasks
  └── Notifications
        │
        ▼
Phase 4
  │
  ├── AI Task Management
  ├── Intelligent Prioritization
  └── Natural-language Task Creation
        │
        ▼
Future
  │
  └── Scalable Cloud Architecture
```

## Learning Outcomes

Through CloudTask, the project demonstrates practical experience with:

* Backend development using Java
* Spring Boot application development
* RESTful API design
* HTTP request/response handling
* Input validation
* Exception handling
* Maven-based project management
* Linux server administration
* AWS EC2
* Nginx
* Cloud deployment
* Git and GitHub

## Status

**Current Status:** Backend development completed; AWS EC2 deployment in progress.

The project will continue to evolve with persistent storage, authentication, frontend capabilities, and AI-powered features.

## License

This project is intended for educational and portfolio purposes.
