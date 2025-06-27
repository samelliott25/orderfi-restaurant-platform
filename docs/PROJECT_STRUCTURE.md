# OrderFi AI - Organized Project Structure

## Current Project Organization

```
OrderFi-AI/
├── 📁 Frontend (Client-Side)
│   ├── client/                    # React frontend application
│   │   ├── src/                   # Source code
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── pages/            # Page components
│   │   │   ├── contexts/         # React context providers
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utility libraries
│   │   │   └── services/         # Frontend services
│   │   ├── index.html            # Main HTML template
│   │   └── package files
│   └── src/frontend/             # Organized frontend copy
│
├── 📁 Backend (Server-Side)
│   ├── server/                   # Express.js backend application
│   │   ├── routes/               # API route handlers
│   │   ├── services/             # Business logic services
│   │   ├── middleware/           # Express middleware
│   │   ├── monitoring/           # Performance monitoring
│   │   └── index.ts              # Server entry point
│   ├── shared/                   # Shared types and schemas
│   │   ├── schema.ts             # Database schemas
│   │   └── i18n.ts               # Internationalization
│   ├── contracts/                # Blockchain smart contracts
│   │   ├── MimiRewards.sol       # Token rewards contract
│   │   └── deploy/               # Deployment scripts
│   ├── data/                     # Sample data and seeds
│   ├── migrations/               # Database migrations
│   └── src/backend/              # Organized backend copy
│
├── 📁 Configuration & Infrastructure
│   ├── deployment/               # Deployment configurations
│   │   ├── docker-compose*.yml   # Docker configurations
│   │   ├── deploy-akash.*        # Akash Network deployment
│   │   ├── nginx.conf            # Web server configuration
│   │   └── Dockerfile*           # Container definitions
│   ├── .github/workflows/        # CI/CD pipelines
│   ├── components.json           # shadcn/ui configuration
│   ├── drizzle.config.ts         # Database ORM configuration
│   ├── hardhat.config.ts         # Blockchain development
│   ├── tailwind.config.ts        # CSS framework configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Build tool configuration
│   └── package.json              # Dependencies and scripts
│
├── 📁 Documentation & Assets
│   ├── docs/                     # Project documentation
│   │   ├── COMPREHENSIVE_SYSTEM_SUMMARY.md
│   │   ├── STRATEGIC_ROADMAP.md
│   │   ├── BETA_ONBOARDING_GUIDE.md
│   │   ├── FINAL_PRODUCTION_ASSESSMENT.md
│   │   └── [Other documentation files]
│   ├── assets/                   # Static assets and media
│   │   └── attached_assets/      # User-uploaded assets
│   └── replit.md                 # Project status and preferences
│
├── 📁 Testing & Quality Assurance
│   ├── tests/                    # Test files directory
│   └── src/backend/tests/        # Backend-specific tests
│       └── api.test.js           # Production readiness tests
│
└── 📁 Development Tools
    ├── node_modules/             # Dependencies (auto-generated)
    ├── dist/                     # Build output (auto-generated)
    └── .replit                   # Replit configuration
```

## Folder Purposes

### Frontend (`client/` and `src/frontend/`)
- **React application** with mobile-first design
- **UI components** using shadcn/ui and Tailwind CSS
- **AI chat interface** with voice recognition
- **Token rewards dashboard** and customer ordering
- **Progressive Web App** capabilities

### Backend (`server/` and `src/backend/`)
- **Express.js API server** with TypeScript
- **Database integration** with PostgreSQL and Drizzle ORM
- **AI services** using OpenAI and Akash Network
- **Blockchain integration** for token rewards
- **Security middleware** and performance optimization

### Configuration & Infrastructure
- **Deployment files** for Akash Network and traditional cloud
- **Docker containers** for production deployment
- **CI/CD pipelines** for automated testing and deployment
- **Development tools** configuration

### Documentation & Assets
- **Comprehensive documentation** for all system components
- **Strategic roadmaps** and implementation guides
- **Beta onboarding materials** for restaurant partners
- **Static assets** and user-uploaded content

### Testing & Quality Assurance
- **Production readiness tests** validating all endpoints
- **Performance benchmarks** and security validation
- **Automated testing** integration with CI/CD

## Key Benefits of This Organization

### 1. Clear Separation of Concerns
- Frontend and backend code clearly separated
- Shared code properly organized and accessible
- Documentation and assets in dedicated locations

### 2. Scalability
- Easy to add new features to appropriate sections
- Clear paths for microservices transition
- Organized structure supports team collaboration

### 3. Maintenance
- Configuration files grouped logically
- Documentation co-located with relevant code
- Asset management simplified

### 4. Development Workflow
- Clear entry points for different development tasks
- Organized testing structure
- Comprehensive documentation for onboarding

## Working with the Structure

### Frontend Development
```bash
# Navigate to frontend
cd client/src/

# Key directories:
# - components/ : Reusable UI components
# - pages/ : Route-based page components
# - contexts/ : Global state management
# - services/ : API calls and utilities
```

### Backend Development
```bash
# Navigate to backend
cd server/

# Key directories:
# - routes/ : API endpoint definitions
# - services/ : Business logic and integrations
# - middleware/ : Express middleware functions
# - monitoring/ : Performance and health monitoring
```

### Deployment & Operations
```bash
# Navigate to deployment
cd deployment/

# Key files:
# - docker-compose.yml : Local development
# - deploy-akash.yaml : Decentralized deployment
# - nginx.conf : Production web server
```

### Documentation & Learning
```bash
# Navigate to documentation
cd docs/

# Key files:
# - COMPREHENSIVE_SYSTEM_SUMMARY.md : Complete system overview
# - STRATEGIC_ROADMAP.md : Development and market strategy
# - BETA_ONBOARDING_GUIDE.md : Restaurant partner guide
```

## Future Enhancements

### Microservices Transition
The organized structure provides clear paths for extracting services:
- **Chat Service**: `server/services/akash-chat.ts` → Independent service
- **Payment Service**: Token rewards and payment processing
- **Kitchen Service**: Order management and printing
- **Analytics Service**: Performance monitoring and business intelligence

### Team Collaboration
Clear ownership boundaries:
- **Frontend Team**: `client/` and `src/frontend/`
- **Backend Team**: `server/` and `src/backend/`
- **DevOps Team**: `deployment/` and CI/CD
- **Documentation Team**: `docs/` and user guides

This organized structure maintains all existing functionality while providing clear paths for scaling, team collaboration, and future enhancements.