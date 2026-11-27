# TaskForge - Task Management Website

### Automated Deployment and Infrastructure Monitoring of a Web Application Using DevOps Tools

TaskForge is a lightweight sticky-note-based task management web application

The project focuses on demonstrating practical DevOps workflows, including version control, CI/CD automation, containerization, infrastructure provisioning, configuration management, cloud deployment, and infrastructure monitoring.

## 🎯 Project Objectives

- Develop a simple and functional task management web application.
- Implement version control using Git and GitHub.
- Automate application build and deployment using Jenkins.
- Containerize the application using Docker.
- Provision cloud infrastructure using Terraform.
- Automate server configuration using Puppet.
- Deploy the application on AWS EC2.
- Monitor infrastructure and application availability using Nagios.

## ✨ Application Features

- Create, edit, and delete tasks.
- Mark tasks as completed.
- Calendar-based task organization.
- Daily, weekly, and custom recurring tasks.
- Task filtering and categorization.
- Dark and light themes.
- Browser-based data persistence using localStorage.

## 🛠️ Technology Stack

### Application Development

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and layout |
| JavaScript | Application functionality |
| localStorage | Browser-based data persistence |

### DevOps and Infrastructure

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Source code management |
| Jenkins | CI/CD automation |
| Docker | Application containerization |
| Nginx | Web server |
| AWS EC2 | Cloud hosting |
| Terraform | Infrastructure provisioning |
| Puppet | Configuration management |
| Nagios | Infrastructure monitoring |

*The DevOps tools listed above represent the planned project workflow. Their implementation and results will be documented as the project progresses.*

## 🏗️ Proposed DevOps Workflow

```text
        Developer
            |
            v
       Git / GitHub
            |
            v
         Jenkins
      (CI/CD Pipeline)
            |
            v
          Docker
      (Containerization)
            |
            v
        AWS EC2
            |
            v
          Nginx
            |
            v
        TaskForge
            |
            v
          Nagios
        (Monitoring)

Infrastructure provisioning: Terraform
Configuration management: Puppet
```

## 📁 Project Structure

```text
TaskForge/
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
├── docs/
│
├── .gitignore
├── README.md
└── Dockerfile             # To be added
```

## 🚀 Getting Started

### Prerequisites

- Git
- Visual Studio Code or another code editor
- A modern web browser

### Run Locally

1. Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

2. Navigate to the project directory:

```bash
cd TaskForge
```

3. Open `frontend/index.html` in your browser, or use the VS Code Live Server extension.

##  DevOps Implementation Plan

The following stages will be implemented and documented:

1. **Version Control:** Manage application source code using Git and GitHub.
2. **Cloud Infrastructure:** Provision AWS infrastructure using Terraform.
3. **Configuration Management:** Automate Linux server configuration using Puppet.
4. **Containerization:** Build and run the application using Docker and Nginx.
5. **CI/CD Automation:** Configure Jenkins to automate testing and deployment.
6. **Cloud Deployment:** Host TaskForge on an AWS EC2 instance.
7. **Monitoring:** Configure Nagios to monitor server and application availability.

##  Project Demonstration

Screenshots of the application, deployment process, CI/CD pipeline, configuration management, and monitoring dashboard will be added as implementation progresses.

##  Future Scope

- Improve application usability and task organization.
- Automate deployment through Jenkins.
- Improve infrastructure monitoring and alerting.
- Enhance deployment reliability and configuration automation.



