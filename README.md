
# Pong Game Web Application

## Overview

This project is a full-stack web application showcasing a classic Ping Pong game, designed and developed by a team of five. The application is fully containerized using Docker, simplifying setup and deployment processes across different environments.

## Features

- **Responsive User Interface:** Utilizes pure vanilla JavaScript and Bootstrap.
- **Secure Backend:** Django with PostgreSQL for robust data handling and application logic.
- **Enhanced Security:** Secured via JWT and Gmail OAuth, with HTTPS implemented over Nginx.
- **Multi-Language Support:** Broad accessibility with multi-language capabilities.
- **Advanced 3D Gameplay:** Engaging user experience with sophisticated 3D graphics.
- **Interactive Dashboards:** Dashboard for monitoring game and user statistics.
- **Remote Authentication:** Features remote authentication using the Ecole 42 API.

## Architecture

The application is structured into four Docker containers:
1. **Django Backend Container:** Manages backend logic and APIs.
2. **PostgreSQL Database Container:** Handles all data storage needs.
3. **Frontend Container (App Container):** Serves the frontend, built with Webpack.
4. **Nginx Container:** Manages SSL layer and acts as a reverse proxy.

## Getting Started

To run this project using Docker:

1. **Clone the Repository:**
   ```
   git clone [repository-url]
   ```
2. **Build and Run Containers:**
   ```
   docker-compose up --build
   ```
3. **Access the Application:**
   Navigate to `https://localhost` in your web browser to access the application.

## Docker Details

The `docker-compose.yml` file in the repository root defines the services, networks, and volumes for the containers.

## Contributing

Contributions are welcome. Please fork the repository and submit pull requests to contribute.

## Acknowledgements
- Heartfelt thanks to all team members and contributors.
- Special acknowledgment to Ecole 42 for their remote authentication API and for the extraordinary and very good training it has provided us so far...
