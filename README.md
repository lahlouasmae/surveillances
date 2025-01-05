# Surveillance System

A modern surveillance management system built with Spring Boot backend and React.js frontend.

<div align="center">
    <img src="https://github.com/user-attachments/assets/80afe4e5-9e1a-40d7-8c6f-20acff8a689e" alt="WhatsApp Image 2025-01-05 at 15 08 26_ea148dc5">
</div>

## Overview

This application provides a comprehensive surveillance management solution with secure user authentication, real-time monitoring capabilities, and an intuitive user interface.

## Table des Matières
1. [Software Architecture](#software-architecture)
2. [Technology Stack](#technology-stack)
   - [Backend](#backend)
   - [Frontend](#frontend)
3. [Features](#features)
4. [Prerequisites](#prerequisites)
5. [Backend Project Structure](#backend-project-structure)
   - [Controllers Layer](#controllers-layer)
   - [Services Layer](#services-layer)
   - [Repositories Layer](#repositories-layer)
   - [Entities Layer](#entities-layer)
6. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Dependencies](#dependencies)
   - [Frontend Setup](#frontend-setup)
7. [Main API Endpoints](#main-api-endpoints)
8. [Security Configuration](#security-configuration)
9. [Project Structure](#project-structure)
10. [Configuration](#configuration)
    - [Backend Configuration Options](#backend-configuration-options)
    - [Frontend Configuration](#frontend-configuration)
11. [Demonstration Video](#demonstration-video)
12. [Contributing](#contributing)
13. [Contributors](#contributors)


[Rest of the document remains unchanged...]
## Software Architecture
<div align="center">
    <img width="682" alt="image" src="https://github.com/user-attachments/assets/e920fc6f-285b-4324-af20-97a61bcea484" />
</div>

## Technology Stack

### Backend
- Java 23
- Spring Boot 3.4.0
- Spring Security 
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React.js 18
- Axios
- React Router DOM
- JWT Authentication

## Features

- Secure user authentication and authorization
- Real-time video streaming
- Motion detection alerts
- User management system
- Camera management
- Event logging and history
- Customizable alert settings
- Export capabilities for logs and recordings

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 14 or higher
- Maven 3.8+
## Backend project structure 

### Controllers Layer

Handles HTTP requests and responses
Implements REST endpoints
Manages request validation
Routes requests to appropriate services


### Services Layer

Contains business logic
Implements transaction management
Handles data processing and transformations
Coordinates between different components


### Repositories Layer

Manages data persistence
Implements JPA repositories
Handles database operations
Provides data access methods


### Entities Layer

Defines JPA entities
Maps database tables
Implements relationships between entities

## Installation

### Backend Setup

1. Clone the repository
bash
git clone https://github.com/Younessamg/Surveillance-project.git
cd surveillance-system/backend


2. Configure database settings in application.properties
properties
spring.datasource.url=jdbc:mysql://localhost:3306/surveillances
spring.datasource.username=root
spring.datasource.password=


3. Build and run the application
bash
mvn clean install
mvn spring-boot:run


The backend server will start on http://localhost:8080
### Dependencies
1. Spring Data JPA:
   - Purpose: Simplifies data access using JPA in Spring Boot.
2. MySQL Connector/J:
Purpose: JDBC driver for connecting to a MySQL database.


xml
sh
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>



### Frontend Setup

1. Navigate to the frontend directory
bash
cd ../frontend


2. Install dependencies
bash
npm install


3. Start the development server
bash
npm start


The frontend application will be available at http://localhost:3000


### Main API Endpoints

- POST /api/auth/login - Authentication endpoint
- POST /api/departments - Create new department
- POST /api/locals - Create new local
- POST /api/options - Create new option
- POST /api/modules - Create new module
- GET /api/exams - Get exams


## Security Configuration

The system uses JWT (JSON Web Tokens) for authentication. Default security configurations can be modified in SecurityConfig.java.

java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Security configurations
}


## Project Structure


surveillance_project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   ├── package.json
│   └── README.md
└── README.md


## Configuration

### Backend Configuration Options

The following properties can be configured in application.properties:

properties
# Server Configuration
server.port=8080

# Database Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=your_jwt_secret
jwt.expiration=86400000


### Frontend Configuration

Environment-specific configurations can be set in the following files:
- .env.development
- .env.production
- .env.test
## Demonstration video
https://github.com/user-attachments/assets/c9580ba3-e865-44d1-85e4-793a82bedbcd

# Contributing

We welcome contributions from everyone, and we appreciate your help to make this project even better! If you would like to contribute, please follow these guidelines:

## Contributors
- Amerga Younes ([GitHub](https://github.com/Younessamg))
- Zineb Taghti ([GitHub](https://github.com/zinebtaghti))
- Lahlou Asmae ([GitHub](https://github.com/lahlouasmae))
- Boutkhoum Omar
