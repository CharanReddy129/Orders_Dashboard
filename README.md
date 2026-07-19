# 🚀 Orders Dashboard - End-to-End DevOps CI/CD & GitOps Project

![Kubernetes](https://img.shields.io/badge/Kubernetes-v1.33-blue?logo=kubernetes)
![Docker](https://img.shields.io/badge/Docker-Containers-blue?logo=docker)
![Helm](https://img.shields.io/badge/Helm-v3-blue?logo=helm)
![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-orange?logo=argo)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-black?logo=githubactions)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-orange?logo=prometheus)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-orange?logo=grafana)
![Trivy](https://img.shields.io/badge/Trivy-Security-blue)
![Gitleaks](https://img.shields.io/badge/Gitleaks-Secrets-red)

---

## 📖 Project Overview

Orders Dashboard is a production-style **DevOps project** demonstrating a complete CI/CD and GitOps workflow for deploying a containerized web application to Kubernetes.

The project automates the complete software delivery lifecycle:

- Source code management with GitHub
- Continuous Integration using GitHub Actions
- Secret scanning using Gitleaks
- Vulnerability scanning using Trivy
- Docker image creation and publishing
- Helm-based Kubernetes deployments
- GitOps using ArgoCD
- Continuous deployment to Kubernetes
- Monitoring using Prometheus & Grafana

The objective of this project is to showcase industry-standard DevOps practices used in modern cloud-native environments.

---

# ✨ Features

- React Frontend
- Flask Backend
- PostgreSQL Database
- Dockerized Services
- Kubernetes Deployment
- Helm Charts
- GitHub Actions CI Pipeline
- Docker Build Cache
- Parallel Image Builds
- DockerHub Image Publishing
- Secret Scanning (Gitleaks)
- Filesystem Vulnerability Scanning (Trivy)
- Docker Image Vulnerability Scanning
- GitOps Deployment using ArgoCD
- Automatic Synchronization
- Self-Healing Infrastructure
- Prometheus Monitoring
- Grafana Dashboards

---

# 🏗️ Architecture

```text
                        Developer
                            │
                        Git Push
                            │
                            ▼
                   GitHub Repository
                            │
                            ▼
                  GitHub Actions CI/CD
     ┌───────────────────────────────────────────────┐
     │                                               │
     │  Gitleaks Secret Scan                         │
     │  Trivy Filesystem Scan                        │
     │  Build Frontend Image                         │
     │  Build Backend Image                          │
     │  Trivy Image Scan                             │
     │  Push Images to DockerHub                     │
     │  Update Helm values.yaml                      │
     └───────────────────────────────────────────────┘
                            │
                            ▼
                Orders Dashboard GitOps Repository
                            │
                            ▼
                        ArgoCD Watches Git
                            │
                            ▼
                     Kubernetes Cluster
                            │
        ┌───────────────────┼─────────────────────┐
        │                   │                     │
        ▼                   ▼                     ▼
   Frontend            Backend API          PostgreSQL
                            │
                            ▼
               Prometheus + Grafana Monitoring
```

---

# 🔄 CI/CD Workflow

```text
Developer Push
      │
      ▼
GitHub Actions
      │
      ├───────────────┐
      │               │
      ▼               ▼
 Secret Scan     Filesystem Scan
      │
      ▼
──────────────────────────────────────
│                                    │
▼                                    ▼
Frontend Job                    Backend Job
│                                │
Build Image                      Build Image
│                                │
Trivy Scan                       Trivy Scan
│                                │
Push Image                       Push Image
│                                │
──────────────┬───────────────────
              ▼
        Update GitOps Repo
              │
              ▼
          ArgoCD Sync
              │
              ▼
      Kubernetes Deployment
```

---

# 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React |
| Backend | Flask (Python) |
| Database | PostgreSQL |
| Containerization | Docker |
| Orchestration | Kubernetes |
| Package Manager | Helm |
| GitOps | ArgoCD |
| CI/CD | GitHub Actions |
| Security | Gitleaks, Trivy |
| Monitoring | Prometheus, Grafana |
| Registry | DockerHub |
| Version Control | Git & GitHub |

---

# 📂 Repository Structure

## Application Repository

```

Orders-Dashboard/
│
├── backend/
├── frontend/
├── .github/
│ └── workflows/
│ └── ci.yml
├── Dockerfile
├── docker-compose.yml
├── helm/
└── README.md

```

## GitOps Repository

```

orders-dashboard-gitops/
│
├── helm/
│ ├── templates/
│ ├── Chart.yaml
│ └── values.yaml
│
└── argocd/
└── argocd.yaml

```

---

# 📦 Prerequisites

Install the following tools before deploying the project.

- Git
- Docker
- Kubernetes (Kind / Minikube / kubeadm)
- kubectl
- Helm v3+
- ArgoCD
- Prometheus
- Grafana
- GitHub Account
- DockerHub Account

Verify installations:

```bash
git --version
docker --version
kubectl version --client
helm version
argocd version
```

---

# 🚀 Project Goals

This project demonstrates:

- Production-style CI/CD pipeline
- Automated GitOps deployment
- Infrastructure as Code
- Container Security
- Continuous Monitoring
- Cloud Native Application Deployment
- Kubernetes Best Practices


# ⚙️ Installation & Deployment

This section explains how to deploy the application from scratch.

---

# 1️⃣ Clone the Repository

Clone the application repository.

```bash
git clone https://github.com/CharanReddy129/Orders_Dashboard.git

cd Orders_Dashboard
```

Clone the GitOps repository.

```bash
git clone https://github.com/CharanReddy129/orders-dashboard-gitops.git
```

---

# 2️⃣ Build Docker Images Locally

## Frontend

```bash
docker build -t orders-dashboard-frontend .
```

## Backend

```bash
cd backend

docker build -t orders-dashboard-backend .
```

Verify the images.

```bash
docker images
```

Expected output:

```text
orders-dashboard-frontend
orders-dashboard-backend
```

---

# 3️⃣ Run with Docker Compose

Start all services.

```bash
docker compose up -d
```

Verify containers.

```bash
docker ps
```

Expected containers:

- Frontend
- Backend
- PostgreSQL

Stop the application.

```bash
docker compose down
```

---

# ☸️ Kubernetes Deployment

The application is deployed on Kubernetes using Helm.

Before deployment, verify the cluster.

```bash
kubectl cluster-info
```

Verify nodes.

```bash
kubectl get nodes
```

---

# Create Namespace

```bash
kubectl create namespace orders-dashboard
```

Verify.

```bash
kubectl get ns
```

---

# 📦 Helm Deployment

The project uses Helm to package and deploy Kubernetes resources.

Project structure:

```text
helm/
│
├── Chart.yaml
├── values.yaml
│
└── templates/
    ├── frontend-deployment.yaml
    ├── backend-deployment.yaml
    ├── postgres-statefulset.yaml
    ├── services.yaml
    ├── ingress.yaml
    ├── pvc.yaml
    └── secrets.yaml
```

---

## Install Helm Chart

```bash
helm install orders-dashboard ./helm \
    -n orders-dashboard
```

Verify release.

```bash
helm list -n orders-dashboard
```

Expected output:

```text
NAME
orders-dashboard
```

---

## Verify Resources

Pods

```bash
kubectl get pods -n orders-dashboard
```

Deployments

```bash
kubectl get deployments -n orders-dashboard
```

Services

```bash
kubectl get svc -n orders-dashboard
```

StatefulSets

```bash
kubectl get statefulsets -n orders-dashboard
```

Persistent Volume Claims

```bash
kubectl get pvc -n orders-dashboard
```

---

## Upgrade Release

Whenever the Helm chart changes:

```bash
helm upgrade orders-dashboard ./helm \
    -n orders-dashboard
```

---

## Rollback Release

View release history.

```bash
helm history orders-dashboard \
    -n orders-dashboard
```

Rollback.

```bash
helm rollback orders-dashboard 1 \
    -n orders-dashboard
```

---

## Uninstall Release

```bash
helm uninstall orders-dashboard \
    -n orders-dashboard
```

---

# 🐳 DockerHub Images

GitHub Actions automatically publishes images to DockerHub.

Images:

```text
orders-dashboard-frontend
orders-dashboard-backend
```

Images are tagged using the Git commit SHA.

Example:

```text
charanreddy12/orders-dashboard-frontend:a8b1c3d

charanreddy12/orders-dashboard-backend:a8b1c3d
```

Using commit SHA tags ensures every deployment is immutable and traceable.

---

# 🌐 Access the Application

Depending on the Kubernetes environment:

## NodePort

```bash
kubectl get svc -n orders-dashboard
```

Access using:

```text
http://<NodeIP>:<NodePort>
```

---

## Port Forward

Frontend

```bash
kubectl port-forward svc/frontend 3000:3000 \
    -n orders-dashboard
```

Backend

```bash
kubectl port-forward svc/backend 5000:5000 \
    -n orders-dashboard
```

Application:

```text
Frontend:
http://localhost:3000

Backend:
http://localhost:5000
```

---

# 🗄️ Database

The application uses PostgreSQL running as a Kubernetes StatefulSet.

Verify:

```bash
kubectl get statefulset \
    -n orders-dashboard
```

Connect to the database.

```bash
kubectl exec -it postgres-0 \
    -n orders-dashboard -- psql -U postgres
```

---

# 🔄 Application Upgrade Workflow

Any code change follows this deployment lifecycle.

```text
Developer
     │
     ▼
Git Push
     │
     ▼
GitHub Actions
     │
     ▼
Docker Image Build
     │
     ▼
Push Image to DockerHub
     │
     ▼
Update Helm values.yaml
     │
     ▼
Push GitOps Repository
     │
     ▼
ArgoCD detects change
     │
     ▼
Helm renders templates
     │
     ▼
Kubernetes Deployment Updated
```

This fully automated workflow eliminates manual deployments and follows GitOps principles, where Git serves as the single source of truth for the desired cluster state.

---

# ✅ Deployment Verification

Run the following commands to verify a successful deployment.

```bash
kubectl get pods -n orders-dashboard

kubectl get svc -n orders-dashboard

kubectl get ingress -n orders-dashboard

kubectl get pvc -n orders-dashboard

kubectl get deployments -n orders-dashboard
```

All pods should be in the **Running** state and deployments should report all replicas as available before accessing the application.

# 🔄 GitHub Actions CI/CD Pipeline

This project uses **GitHub Actions** to automate the Continuous Integration (CI) workflow. Every push to the `main` branch triggers a production-style pipeline that performs security scanning, builds Docker images, scans them for vulnerabilities, publishes them to Docker Hub, and updates the GitOps repository.

The pipeline is designed to follow modern DevOps best practices by separating responsibilities into independent jobs, enabling parallel execution and faster feedback.

---

# 🏗️ Pipeline Architecture

```text
                    Git Push
                        │
                        ▼
              GitHub Actions Trigger
                        │
                        ▼
                Security Scan Job
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
   Frontend Build Job           Backend Build Job
         │                             │
         │                             │
    Docker Build                  Docker Build
         │                             │
    Trivy Scan                   Trivy Scan
         │                             │
    Docker Push                  Docker Push
         └──────────────┬──────────────┘
                        ▼
                 GitOps Update Job
                        │
                        ▼
          Update Helm values.yaml
                        │
                        ▼
            Push GitOps Repository
                        │
                        ▼
                  ArgoCD Sync
                        │
                        ▼
              Kubernetes Deployment
```

---

# 📋 Workflow Trigger

The workflow automatically executes whenever changes are pushed to the `main` branch.

```yaml
on:
  push:
    branches:
      - main
```

This ensures that every code change is validated, scanned, built, and deployed without manual intervention.

---

# 📌 Pipeline Stages

The pipeline consists of four independent jobs.

| Stage | Purpose |
|--------|----------|
| Security | Secret detection and filesystem vulnerability scanning |
| Frontend | Build, scan and publish frontend Docker image |
| Backend | Build, scan and publish backend Docker image |
| GitOps | Update Helm image tags and trigger deployment |

---

# 🔐 Stage 1 – Security Scan

The first stage validates the repository before any images are built.

This job performs:

- Repository checkout
- Secret scanning using Gitleaks
- Filesystem vulnerability scanning using Trivy
- Upload security reports as workflow artifacts

## Secret Scanning

Gitleaks searches the repository for accidentally committed secrets such as:

- API Keys
- AWS Credentials
- Database Passwords
- Access Tokens
- SSH Keys
- Private Certificates

Example command:

```bash
gitleaks detect \
--source . \
--report-format json \
--report-path gitleaks-report.json \
--exit-code 0
```

---

## Filesystem Vulnerability Scan

Before building Docker images, Trivy scans the repository for vulnerable dependencies.

Example:

```bash
trivy fs \
--format sarif \
--output trivy-fs-report.sarif .
```

Scanning before image creation helps identify vulnerable libraries early in the CI pipeline.

---

# 🐳 Stage 2 – Frontend Image

This job executes independently after the security stage completes.

Steps:

1. Checkout repository
2. Generate short Git SHA
3. Configure Docker Buildx
4. Login to Docker Hub
5. Build Docker image
6. Scan image using Trivy
7. Upload scan report
8. Push image to Docker Hub

---

## Docker Build

The frontend image is built using BuildKit.

Example:

```bash
docker buildx build \
-t charanreddy12/orders-dashboard-frontend:${SHORT_SHA} \
--load \
./frontend
```

---

## Docker Build Cache

GitHub Actions cache is used to speed up future builds.

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

Benefits:

- Faster builds
- Reduced network usage
- Efficient layer reuse

---

## Image Scan

After image creation, Trivy scans the Docker image.

Example:

```bash
trivy image \
--format sarif \
--output trivy-frontend-report.sarif \
charanreddy12/orders-dashboard-frontend:${SHORT_SHA}
```

This detects:

- Operating system vulnerabilities
- Language package vulnerabilities
- Known CVEs
- High and Critical security issues

---

## Docker Push

After a successful scan, the image is pushed to Docker Hub.

Example:

```bash
docker push charanreddy12/orders-dashboard-frontend:${SHORT_SHA}
```

---

# ⚙️ Stage 3 – Backend Image

The backend job follows the same workflow as the frontend but builds the Flask application image.

Pipeline:

```text
Checkout
      │
Docker Build
      │
Trivy Scan
      │
Upload Report
      │
Docker Push
```

Example:

```bash
docker buildx build \
-t charanreddy12/orders-dashboard-backend:${SHORT_SHA} \
--load \
./backend
```

Trivy scans the backend image before publishing.

Finally:

```bash
docker push charanreddy12/orders-dashboard-backend:${SHORT_SHA}
```

---

# 🚀 Parallel Image Builds

The frontend and backend jobs execute simultaneously.

```text
             Security
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
Frontend Job          Backend Job
      │                     │
      └──────────┬──────────┘
                 ▼
            GitOps Job
```

Running jobs in parallel significantly reduces total pipeline execution time.

Average pipeline duration:

```text
≈ 2 Minutes
```

---

# 📝 Stage 4 – GitOps Update

After both Docker images are successfully published, the final stage updates the GitOps repository.

Responsibilities:

- Checkout GitOps repository
- Update Helm values.yaml
- Commit changes
- Push to GitHub

The image tags are updated automatically using `yq`.

Example:

```bash
yq -i '.frontend.image.tag = strenv(SHORT_SHA)' values.yaml

yq -i '.backend.image.tag = strenv(SHORT_SHA)' values.yaml
```

Once committed, ArgoCD detects the change and synchronizes the Kubernetes cluster automatically.

---

# 📦 Docker Image Versioning

Images are tagged using the Git commit SHA.

Example:

```text
charanreddy12/orders-dashboard-frontend:a6c5f41

charanreddy12/orders-dashboard-backend:a6c5f41
```

Advantages:

- Immutable deployments
- Easy rollback
- Traceability
- Reproducible builds

---

# 📁 Workflow Artifacts

Each pipeline execution uploads security reports for later inspection.

Artifacts include:

- Gitleaks Report
- Trivy Filesystem Report
- Frontend Image Scan Report
- Backend Image Scan Report

These reports can be downloaded directly from the GitHub Actions workflow page.

---

# ⚡ Pipeline Optimizations

Several optimizations were implemented to improve efficiency.

### ✅ Parallel Jobs

Frontend and backend images are built simultaneously.

---

### ✅ Docker Build Cache

Uses GitHub Actions cache to reuse Docker layers.

---

### ✅ Short Commit SHA Tags

Smaller, readable image tags while maintaining uniqueness.

---

### ✅ Independent Jobs

Each stage has a single responsibility, making the workflow easier to maintain and debug.

---

### ✅ Security First

Secret scanning and vulnerability scanning are performed before deployment.

---

### ✅ GitOps Deployment

The CI pipeline never interacts directly with the Kubernetes cluster.

Instead, it updates the GitOps repository, allowing ArgoCD to reconcile the desired state. This approach follows GitOps principles by keeping Git as the single source of truth for deployments.

---

# 🎯 CI Pipeline Summary

The GitHub Actions workflow automates the following tasks:

- Repository validation
- Secret detection
- Dependency vulnerability scanning
- Docker image creation
- Docker image vulnerability scanning
- Docker image publishing
- Helm values update
- GitOps repository synchronization
- Automated deployment through ArgoCD

This CI pipeline demonstrates production-oriented DevOps practices, emphasizing automation, security, scalability, and GitOps-driven deployments.

# 🚀 GitOps with ArgoCD

The project follows the **GitOps** methodology, where Git serves as the single source of truth for the Kubernetes cluster.

Instead of deploying applications directly from the CI pipeline, GitHub Actions updates the Helm chart in a dedicated GitOps repository. ArgoCD continuously monitors this repository and synchronizes any changes to the Kubernetes cluster.

This approach provides:

- Automated deployments
- Version-controlled infrastructure
- Easy rollbacks
- Self-healing applications
- Auditable deployment history

---

# 🔄 GitOps Workflow

```text
Developer
    │
    ▼
Push Code
    │
    ▼
GitHub Actions
    │
    ├── Security Scan
    ├── Build Images
    ├── Push Images
    └── Update Helm values.yaml
                │
                ▼
      GitOps Repository
                │
                ▼
      ArgoCD Detects Change
                │
                ▼
         Helm Chart Rendering
                │
                ▼
      Kubernetes Deployment
                │
                ▼
      Application Updated
```

---

# 📁 GitOps Repository

The GitOps repository is dedicated to storing Kubernetes deployment manifests and Helm configuration.

```text
orders-dashboard-gitops/
│
├── argocd/
│   └── argocd.yaml
│
└── helm/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── backend-deployment.yaml
        ├── frontend-deployment.yaml
        ├── postgres-statefulset.yaml
        ├── service.yaml
        ├── ingress.yaml
        ├── pvc.yaml
        └── secrets.yaml
```

Separating the application repository from the deployment repository follows GitOps best practices and enables independent management of application code and deployment configuration.

---

# ⚙️ ArgoCD Application

ArgoCD continuously monitors the GitOps repository.

Example Application configuration:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application

metadata:
  name: orders-dashboard
  namespace: gitops

spec:
  project: default

  source:
    repoURL: https://github.com/CharanReddy129/orders-dashboard-gitops.git
    targetRevision: main
    path: helm

  destination:
    server: https://kubernetes.default.svc
    namespace: orders-dashboard

  syncPolicy:
    automated:
      prune: true
      selfHeal: true

    syncOptions:
      - CreateNamespace=true
```

---

# 🔄 Automatic Synchronization

ArgoCD automatically synchronizes whenever:

- Helm values change
- Deployment manifests change
- ConfigMaps are updated
- Secrets are modified
- Image tags are updated

No manual deployment commands are required.

---

# ❤️ Self-Healing

ArgoCD continuously compares:

Desired State (Git)

vs

Live Cluster State

If someone manually modifies a Kubernetes resource, ArgoCD automatically restores it to match the configuration stored in Git.

Example:

```text
Git Repository
        │
Desired Replica Count = 3
        │
        ▼
Kubernetes Deployment

Someone changes replicas to 1

↓

ArgoCD detects drift

↓

Automatically restores replicas back to 3
```

---

# ♻️ Automatic Image Deployment

The deployment process is fully automated.

```text
Developer Push
        │
        ▼
GitHub Actions
        │
        ▼
Build Docker Images
        │
        ▼
Push Images
        │
        ▼
Update values.yaml
        │
        ▼
Git Push
        │
        ▼
ArgoCD Sync
        │
        ▼
Rolling Update
```

---

# 📦 Helm Chart

Helm simplifies Kubernetes deployments by templating resources.

The chart includes:

- Frontend Deployment
- Backend Deployment
- PostgreSQL StatefulSet
- Services
- Persistent Volume Claim
- Secrets
- Ingress
- Configurable Image Tags

---

# Helm Values

The GitHub Actions workflow updates the following values automatically:

```yaml
frontend:
  image:
    repository: charanreddy12/orders-dashboard-frontend
    tag: a1b2c3d

backend:
  image:
    repository: charanreddy12/orders-dashboard-backend
    tag: a1b2c3d
```

The commit SHA ensures every deployment is uniquely versioned and fully traceable.

---

# 📊 Monitoring

The project includes a complete monitoring stack using:

- Prometheus
- Grafana
- Node Exporter
- Application Metrics

Monitoring provides visibility into the health and performance of both the Kubernetes cluster and the application.

---

# Monitoring Architecture

```text
Frontend
      │
Backend
      │
      ▼
Application Metrics
      │
      ▼
Prometheus
      │
      ▼
Grafana
      │
      ▼
Dashboards
```

---

# Prometheus

Prometheus collects metrics from:

- Backend Application
- Kubernetes Cluster
- Node Exporter

Metrics include:

- CPU Usage
- Memory Usage
- Network Traffic
- Request Count
- HTTP Response Codes
- Container Metrics
- Pod Status
- Node Status

Verify Prometheus targets:

```bash
kubectl port-forward svc/prometheus 9090:9090

http://localhost:9090
```

---

# Grafana

Grafana visualizes metrics collected by Prometheus.

Access Grafana:

```text
http://localhost:3000
```

The dashboard provides real-time insights into application and infrastructure performance.

---

# Dashboard Metrics

The Grafana dashboard includes:

- CPU Utilization
- Memory Utilization
- Running Pods
- Container Restarts
- HTTP Request Rate
- Response Time
- Pod Health
- Node Health
- Kubernetes Resource Usage

---

# Observability

This project demonstrates end-to-end observability by combining metrics collection, visualization, and Kubernetes monitoring.

Benefits include:

- Real-time monitoring
- Faster incident detection
- Easier troubleshooting
- Infrastructure visibility
- Application performance tracking

---

# 📈 Deployment Lifecycle

```text
Developer
      │
      ▼
GitHub
      │
      ▼
GitHub Actions
      │
      ▼
DockerHub
      │
      ▼
GitOps Repository
      │
      ▼
ArgoCD
      │
      ▼
Kubernetes
      │
      ▼
Prometheus
      │
      ▼
Grafana Dashboard
```

---

# 📌 Key GitOps Benefits

This project demonstrates several GitOps best practices:

- Git as the single source of truth
- Automated deployments
- Declarative infrastructure
- Continuous reconciliation
- Self-healing Kubernetes workloads
- Version-controlled deployment configuration
- Simplified rollback strategy
- Fully automated Continuous Delivery

By combining GitHub Actions, Helm, ArgoCD, Prometheus, and Grafana, this project implements a production-inspired GitOps workflow that emphasizes automation, reliability, security, and observability.

# 📸 Screenshots

> **Note:** Add screenshots after deploying the application to showcase the project.

## GitHub Actions Pipeline

![GitHub Actions](screenshots/github-actions.png)

Demonstrates:

- Successful workflow execution
- Security scanning
- Parallel image builds
- Docker image publishing
- GitOps repository update

---

## ArgoCD Dashboard

![ArgoCD](screenshots/argocd-dashboard.png)

Shows:

- Application Status: **Healthy**
- Sync Status: **Synced**
- Resource Tree
- Deployment History

---

## Kubernetes Resources

```bash
kubectl get pods -n orders-dashboard
```

Expected:

```text
NAME                        READY   STATUS
frontend-xxxxx              1/1     Running
backend-xxxxx               1/1     Running
postgres-0                  1/1     Running
```

---

## Prometheus Targets

![Prometheus](screenshots/prometheus-targets.png)

Shows:

- Active scrape targets
- Target health
- Metrics collection status

---

## Grafana Dashboard

![Grafana](screenshots/grafana-dashboard.png)

Suggested panels:

- CPU Usage
- Memory Usage
- HTTP Requests
- Request Rate
- Pod Status
- Node Status
- Container Restarts

---

## Application UI

![Application](screenshots/application.png)

Displays:

- Orders Dashboard frontend
- Backend API integration
- PostgreSQL connectivity

---

# 🎥 Demo

A short demo video or GIF is recommended to showcase the complete workflow.

Suggested flow:

1. Push code to GitHub
2. GitHub Actions pipeline starts
3. Docker images are built
4. Images pushed to Docker Hub
5. GitOps repository updated
6. ArgoCD detects changes
7. Kubernetes performs rolling update
8. Application is automatically updated

---

# 🔐 Security

Security is integrated throughout the CI/CD pipeline.

## Secret Scanning

Tool:

- Gitleaks

Detects:

- API Keys
- Passwords
- Tokens
- AWS Credentials
- Private Keys

---

## Vulnerability Scanning

Tool:

- Trivy

Scans:

- Filesystem
- Docker Images

Detects:

- Critical Vulnerabilities
- High Vulnerabilities
- OS Package Issues
- Dependency Vulnerabilities

Security reports are uploaded as GitHub Actions artifacts for every workflow execution.

---

# 📊 Performance Optimizations

Several optimizations were implemented to improve pipeline efficiency.

### Parallel Image Builds

Frontend and backend Docker images are built simultaneously.

---

### Docker Layer Caching

Uses GitHub Actions cache to reduce build time.

---

### Immutable Image Tags

Docker images are tagged using the Git commit SHA.

Example:

```text
frontend:a6c5f41

backend:a6c5f41
```

---

### Independent Jobs

Each workflow job has a single responsibility, improving maintainability and debugging.

---

### Automated GitOps

CI updates only the GitOps repository. ArgoCD manages all Kubernetes deployments.

---

# 🛠️ Troubleshooting

## Pods Not Starting

Check pod status:

```bash
kubectl get pods -n orders-dashboard
```

Describe pod:

```bash
kubectl describe pod <pod-name> -n orders-dashboard
```

View logs:

```bash
kubectl logs <pod-name> -n orders-dashboard
```

---

## ArgoCD Not Syncing

Verify application status:

```bash
kubectl get applications -n gitops
```

Describe the application:

```bash
kubectl describe application orders-dashboard -n gitops
```

Force synchronization:

```bash
argocd app sync orders-dashboard
```

---

## Docker Image Pull Error

Verify image exists:

```bash
docker pull charanreddy12/orders-dashboard-frontend:<tag>
```

Check image tag in `values.yaml`.

---

## Helm Upgrade Issues

View release history:

```bash
helm history orders-dashboard -n orders-dashboard
```

Rollback if necessary:

```bash
helm rollback orders-dashboard 1 -n orders-dashboard
```

---

## Prometheus Target Down

Verify Prometheus targets:

```text
http://localhost:9090/targets
```

Check Service and Pod endpoints:

```bash
kubectl get svc

kubectl get endpoints
```

---

# 🚀 Future Enhancements

Possible improvements for future versions:

- Deploy on Amazon EKS
- Provision infrastructure using Terraform
- Implement Horizontal Pod Autoscaler (HPA)
- Add Kubernetes Network Policies
- Integrate HashiCorp Vault for secret management
- Configure Alertmanager notifications
- Add Loki for centralized logging
- Implement Blue-Green deployments
- Implement Canary deployments using Argo Rollouts
- Integrate SonarQube for code quality analysis
- Configure OpenTelemetry for distributed tracing
- Add Slack or Microsoft Teams deployment notifications
- Add automated backup and disaster recovery workflows

---

# 📚 Key Learnings

This project provided practical experience with:

- Docker image creation and optimization
- Kubernetes application deployment
- Helm chart development
- GitHub Actions CI/CD
- GitOps principles
- ArgoCD continuous deployment
- Container security scanning
- Vulnerability management
- Infrastructure monitoring
- Production deployment workflows
- Kubernetes troubleshooting
- Observability using Prometheus and Grafana

---

# 💼 Resume Highlights

This project demonstrates hands-on experience with:

- End-to-End CI/CD Pipeline
- GitHub Actions Automation
- Docker
- Kubernetes
- Helm
- GitOps using ArgoCD
- Prometheus Monitoring
- Grafana Dashboards
- Gitleaks Secret Scanning
- Trivy Vulnerability Scanning
- DockerHub Image Management
- Kubernetes Stateful Applications
- Infrastructure Automation
- Production Deployment Workflow

---

# 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project for educational and personal purposes.

---

# 👨‍💻 Author

**Charan Kumar Reddy Gajulapalli**

📧 Email: *gajulapallicharan@gmail.com*

🔗 LinkedIn: *https://www.linkedin.com/in/charanreddy12/*

💻 GitHub: *https://github.com/CharanReddy129*

---


# 📬 Contact

If you have any questions, suggestions, or feedback, feel free to connect via GitHub or LinkedIn.

I'm always open to discussing DevOps, Cloud, Kubernetes, CI/CD, and modern infrastructure automation.

---

## ⭐ If you like this project, don't forget to give it a Star!