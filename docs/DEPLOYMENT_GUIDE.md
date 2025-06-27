# Mimi Waitress Production Deployment Guide

## 🚀 Quick Start

### 1. Local Development
```bash
npm install
npm run dev
# Application runs on http://localhost:5000
```

### 2. Docker Deployment
```bash
# Build container
docker build -t mimi-waitress .

# Run with environment variables
docker run -p 5000:5000 \
  -e OPENAI_API_KEY=your_key \
  -e ANTHROPIC_API_KEY=your_key \
  mimi-waitress
```

### 3. Production Stack
```bash
# Full production deployment with nginx
docker-compose up -d
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Blockchain (Optional)
PRIVATE_KEY=0x...
BASESCAN_API_KEY=...
POLYGONSCAN_API_KEY=...

# Security
NODE_ENV=production
VALID_API_KEYS=key1,key2,key3
```

## 🌐 Decentralized Deployment Options

### Option 1: Akash Network
```bash
# Deploy to decentralized compute
akash tx deployment create deploy.yaml --from wallet --chain-id akashnet-2

# Check deployment status
akash query deployment get --dseq $DSEQ --from wallet

# Access via provider endpoint
curl https://provider-endpoint.akash.network/api/health
```

### Option 2: Replit Deployments
```bash
# Automatic deployment from main branch
git push origin main

# Manual deployment trigger
# Use Replit's deployment dashboard
```

## 🔐 Security Features

### Rate Limiting
- API calls: 100 requests per 15 minutes per IP
- Authentication: 5 attempts per 15 minutes per IP
- Orders: 10 orders per minute per IP

### Security Headers
- Content Security Policy
- HSTS enabled
- XSS protection
- Frame options: DENY
- Content type sniffing prevention

### Input Sanitization
- Script tag removal
- SQL injection prevention
- XSS payload filtering

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Application health
curl http://localhost:5000/health

# Metrics (Prometheus format)
curl http://localhost:5000/metrics?format=prometheus

# JSON metrics
curl http://localhost:5000/metrics
```

### Monitoring Stack
- Prometheus metrics collection
- Request/response time tracking
- AI service performance monitoring
- Blockchain transaction tracking
- Web3 wallet connection metrics

## 🔗 Blockchain Integration

### Smart Contract Deployment
```bash
# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat deploy --network baseGoerli

# Deploy to mainnet
npx hardhat deploy --network base

# Verify contract
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

### Supported Networks
- **Base Mainnet** (Chain ID: 8453)
- **Base Goerli** (Chain ID: 84531)
- **Polygon** (Chain ID: 137)
- **Polygon Mumbai** (Chain ID: 80001)

## 💰 Web3 Wallet Support

### Supported Wallets
- MetaMask (Ethereum, Base, Polygon)
- Phantom (Ethereum, Solana, Base, Polygon)
- Coinbase Wallet (Multi-chain)
- WalletConnect (Universal)

### USDC Payment Flow
1. Customer connects wallet
2. Select network (Base/Polygon for low fees)
3. Approve USDC spending
4. Execute payment transaction
5. Automatic restaurant payout

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# Triggers on push to main/production
# Runs tests, builds Docker image
# Deploys to staging/production
# Supports Akash Network deployment
```

### Deployment Environments
- **Development**: Local development server
- **Staging**: Automated deployment from main branch
- **Production**: Manual deployment from production branch

## 📈 Performance Optimization

### Caching Strategy
- Static assets cached for 1 year
- API responses cached for 5 minutes
- Blockchain data cached for 30 seconds

### Load Balancing
- Nginx reverse proxy
- Health check endpoints
- Automatic failover
- Rate limiting per upstream

## 🛡️ Security Audit Checklist

### Pre-Deployment Security
- [ ] Smart contracts audited
- [ ] API endpoints tested for vulnerabilities
- [ ] Rate limiting configured
- [ ] Input sanitization enabled
- [ ] HTTPS/TLS certificates installed
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Backup systems operational

### Post-Deployment Monitoring
- [ ] Error tracking active (logs)
- [ ] Performance monitoring enabled
- [ ] Security alerts configured
- [ ] Backup verification tested
- [ ] Disaster recovery plan ready

## 🚨 Troubleshooting

### Common Issues

**Port 5000 in use:**
```bash
sudo lsof -ti:5000 | xargs kill -9
npm run dev
```

**Docker build fails:**
```bash
docker system prune -f
docker build --no-cache -t mimi-waitress .
```

**Wallet connection issues:**
```bash
# Check network configuration
curl http://localhost:5000/api/decentralized/wallet/phantom/capabilities
```

**API rate limits:**
```bash
# Check current limits
curl -I http://localhost:5000/api/health
```

### Support Contacts
- Technical Issues: Open GitHub issue
- Security Concerns: security@mimi.restaurant
- Business Inquiries: hello@mimi.restaurant

## 📱 Mobile App Deployment

### PWA Features
- Offline functionality
- Push notifications
- App-like experience
- Auto-updating service worker

### App Store Distribution
- iOS: App Store Connect
- Android: Google Play Console
- Web: Progressive Web App

## 🎯 Success Metrics

### Key Performance Indicators
- Order completion rate > 95%
- AI response time < 2 seconds
- Wallet connection success > 90%
- Transaction confirmation < 30 seconds
- Customer satisfaction > 4.5/5 stars

### Business Metrics
- Daily active users
- Average order value
- USDC transaction volume
- $MIMI token distribution
- Revenue per restaurant

---

**Ready for Production:** All core features implemented, security measures active, monitoring operational, and deployment pipelines configured for scalable decentralized operations.