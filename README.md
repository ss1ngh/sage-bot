# Sage University Chatbot

A comprehensive microservices-based university chatbot system with RAG (Retrieval Augmented Generation) using Gemini AI and local embeddings, featuring separate student and admin panels.

## 🌟 Features

### Student Panel
- **Intelligent Chat Interface**: Ask questions and get AI-powered responses
- **RAG-based Answers**: Responses based on uploaded university documents
- **Escalation System**: Complex queries automatically escalated to admins
- **Chat History**: View previous conversations
- **Beautiful UI**: Light blue and white theme with smooth animations

### Admin Panel
- **Escalation Management**: View and resolve student escalations
- **Document Upload**: Upload PDFs or paste text to build knowledge base
- **Statistics Dashboard**: View system metrics and analytics
- **Document Library**: See all uploaded documents with metadata

## 🏗️ Architecture

### Microservices
1. **Auth Service** (Port 3001): JWT-based authentication for students and admins
2. **Chat Service** (Port 3002): RAG-powered chat using **Gemini 1.5 Flash** for generation and **Local Embeddings** (`all-MiniLM-L6-v2`) for retrieval.
3. **Admin Service** (Port 3003): Admin operations and escalation management
4. **Ingestion Service** (Port 3004): PDF parsing and local vector embedding generation (`all-MiniLM-L6-v2`).
5. **Notification Service**: Email notifications via RabbitMQ

### Infrastructure
- **PostgreSQL**: User data and chat history
- **Redis**: Response caching for performance
- **RabbitMQ**: Asynchronous messaging
- **ChromaDB**: Vector database for document embeddings
- **React**: Frontend SPA with Tailwind CSS

## 📋 Prerequisites

- Docker and Docker Compose installed
- Gemini API key ([Get one here](https://makersuite.google.com/app/apikey)) - *Required for text generation only.*
- SMTP credentials for email notifications (optional)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd sage
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and add your credentials:

```env
# Required
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET=your-secret-key-here

# Optional (for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@university.edu
```

### 3. Build and Run

```bash
docker-compose up --build
```

This will:
- Build all services (using `node:22-slim` for compatibility)
- Set up the database
- Run migrations
- Start all containers

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Auth API**: http://localhost:3001
- **Chat API**: http://localhost:3002
- **Admin API**: http://localhost:3003
- **Ingestion API**: http://localhost:3004
- **RabbitMQ UI**: http://localhost:15672 (guest/guest)

## 📖 Usage Guide

### First-Time Setup

1. **Create Admin Account**
   - Navigate to http://localhost:3000
   - Click "Admin Login"
   - Sign up with admin credentials

2. **Upload Knowledge Base**
   - Login as admin
   - Go to "Upload Knowledge Base" tab
   - Upload PDF documents or paste text
   - Documents are automatically processed and embedded locally

3. **Create Student Account**
   - Go back to home and click "Student Login"
   - Sign up with student credentials
   - Start chatting!

### Student Workflow

1. Login to student panel
2. Type questions in the chat interface
3. Receive AI-powered responses based on knowledge base
4. If needed, queries are automatically escalated to admins

### Admin Workflow

1. Login to admin dashboard
2. **Escalated Issues Tab**: Review and resolve student queries
3. **Upload Tab**: Add new documents to knowledge base
4. Monitor statistics and system usage

## 🔧 Development

### Project Structure

```
sage/
├── client/                 # React frontend
├── services/
│   ├── auth-service/      # Authentication
│   ├── chat-service/      # RAG chat engine (Local Embeddings + Gemini)
│   ├── admin-service/     # Admin operations
│   ├── ingestion-service/ # Document processing (Local Embeddings)
│   └── notification-service/ # Email notifications
├── prisma/                # Database schema
├── shared/                # Shared utilities
└── docker-compose.yml     # Orchestration
```

### Running Services Individually

```bash
# Auth service
cd services/auth-service
npm install
npm start

# Chat service
cd services/chat-service
npm install
npm start

# ... repeat for other services
```

### Database Migrations

```bash
cd prisma
npm install
npx prisma migrate dev --name init
npx prisma generate
```

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**
   - Test student signup/login
   - Test admin signup/login
   - Verify JWT tokens in localStorage

2. **Chat Functionality**
   - Upload a test document
   - Ask related questions
   - Verify responses use document context
   - Test escalation with unrelated questions

3. **Admin Panel**
   - View escalations
   - Resolve queries
   - Upload PDFs and text
   - Verify document processing

### Health Checks

```bash
# Check all service health
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Chat
curl http://localhost:3003/health  # Admin
curl http://localhost:3004/health  # Ingestion
```

## 🐛 Troubleshooting

### Common Issues

**Dimension Mismatch Error (768 vs 384)**
If you see `InvalidArgumentError: Collection expecting embedding with dimension of 768, got 384`, it means the database has old embeddings from the previous model.
**Fix:**
```bash
# Delete volumes to reset the database
docker-compose down -v
docker-compose up -d
# Then RE-UPLOAD your documents
```

**Build or Runtime Errors (ld-linux-x86-64.so.2)**
If you see errors related to `sharp` or `onnxruntime` missing shared libraries, ensure you are using the updated Dockerfiles which use `node:22-slim` (Debian) instead of Alpine, as these libraries require `glibc`.

**ChromaDB Connection Error**
```bash
# Restart ChromaDB container
docker-compose restart chromadb
```

**Email Not Sending**
- Verify SMTP credentials in `.env`
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)

**Frontend Not Loading**
```bash
# Rebuild client
docker-compose build client
docker-compose up client
```

## 🔐 Security Notes

- **Change JWT_SECRET** in production
- Use strong passwords for admin accounts
- Set proper CORS policies for production
- Keep Gemini API key secure
- Use environment-specific `.env` files

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f chat-service
docker-compose logs -f ingestion-service
```

### RabbitMQ Management

Access http://localhost:15672 to:
- View message queues
- Monitor message flow
- Check consumers

### Redis Monitoring

```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# Check cached queries
KEYS query:*

# View cache size
DBSIZE
```

## 🚢 Deployment

### Production Recommendations

1. **Environment Variables**
   - Use secure secret management
   - Rotate JWT secrets regularly
   - Use production database credentials

2. **Scaling**
   - Use docker-compose scale for services
   - Consider Kubernetes for larger deployments
   - Add load balancers for high traffic

3. **Database**
   - Use managed PostgreSQL (AWS RDS, etc.)
   - Enable backups
   - Set up read replicas if needed

4. **Monitoring**
   - Add application monitoring (Datadog, New Relic)
   - Set up error tracking (Sentry)
   - Configure log aggregation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Tech Stack

**Backend:**
- Node.js (v22) + Express.js
- Prisma ORM + PostgreSQL
- **Gemini 1.5 Flash** (Generation)
- **Local Embeddings** (`@xenova/transformers`, `all-MiniLM-L6-v2`)
- ChromaDB (Vector Database)
- Redis (Caching)
- RabbitMQ (Message Queue)
- Nodemailer (Email)

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios

**DevOps:**
- Docker + Docker Compose
- Nginx (Frontend serving)

## 📄 License

MIT License - feel free to use this project for educational purposes.

## 🙏 Acknowledgments

- Google Gemini AI for powering the chat responses
- Hugging Face & Xenova for local transformers
- ChromaDB for vector storage
- The open-source community

---

**Need Help?** Open an issue or contact the development team.
