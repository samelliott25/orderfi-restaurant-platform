# OrderFi AI - Decentralized Server Deployment Guide

## Overview
OrderFi AI now supports fully decentralized deployment using Akash Network for compute resources, enabling cost-effective, censorship-resistant hosting aligned with our blockchain-first architecture.

## Architecture Components

### 1. Akash Network Deployment
- **Compute**: Distributed across global Akash providers
- **Cost**: 70-90% cheaper than traditional cloud providers
- **Payment**: Native AKT token payments
- **Redundancy**: Multi-provider failover capabilities

### 2. Decentralized Storage
- **IPFS**: Static assets and content distribution
- **PostgreSQL**: Primary database (containerized on Akash)
- **Redis**: Session and caching layer

### 3. Blockchain Integration
- **Base Network**: Primary smart contract deployment
- **Polygon**: Secondary network for redundancy
- **Token Rewards**: Automated distribution via smart contracts

## Deployment Process

### Prerequisites
1. **Akash Wallet**: Fund with minimum 5 AKT tokens
2. **Environment Variables**: Configure production secrets
3. **Docker**: Application containerization
4. **Akash CLI**: Command-line deployment tools

### Step-by-Step Deployment

#### 1. Prepare Environment
```bash
# Set Akash wallet
export AKASH_KEY_NAME=your-wallet-name

# Configure production environment
cp .env.production .env
# Edit .env with your specific values
```

#### 2. Deploy to Akash Network
```bash
# Make deployment script executable
chmod +x deploy-akash.sh

# Run deployment
./deploy-akash.sh
```

#### 3. Verify Deployment
```bash
# Check health endpoint
curl https://your-deployment-url.akash.network/health

# Test AI chat functionality
curl -X POST https://your-deployment-url.akash.network/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "restaurantId": 1, "sessionId": "test"}'
```

## Configuration Files

### Akash Deployment Manifest (`deploy-akash.yaml`)
- **Services**: OrderFi app, PostgreSQL, Redis
- **Resources**: CPU, memory, storage allocation
- **Networking**: Global exposure and internal service communication
- **Pricing**: AKT token pricing for compute resources

### Docker Configuration (`docker-compose.akash.yml`)
- **Multi-container**: Application, database, cache
- **Health Checks**: Automated service monitoring
- **Volume Persistence**: Data persistence across restarts

### Production Environment (`.env.production`)
- **Database**: PostgreSQL connection strings
- **APIs**: Akash Chat and blockchain endpoints
- **Security**: JWT and encryption configurations
- **Features**: Production feature flags

## Cost Analysis

### Traditional Cloud vs Akash Network
- **AWS/GCP**: $200-500/month for comparable resources
- **Akash Network**: $30-80/month (70-85% savings)
- **Payment Method**: Crypto-native (AKT tokens)
- **Scaling**: Pay-per-use with automatic scaling

### Resource Allocation
- **OrderFi App**: 1 CPU, 1GB RAM, 5GB storage
- **PostgreSQL**: 0.5 CPU, 512MB RAM, 10GB storage
- **Redis**: 0.25 CPU, 256MB RAM, 1GB storage
- **Total Cost**: ~$50-70/month in AKT tokens

## Monitoring and Maintenance

### Health Monitoring
- **Endpoint**: `/health` - Comprehensive service status
- **Services**: Database, Akash Chat, blockchain connectivity
- **Alerts**: Automated failure detection and reporting

### Backup Strategy
- **Database**: Automated PostgreSQL backups to IPFS
- **Blockchain**: Transaction logs and smart contract state
- **Configuration**: Deployment manifests and environment files

### Updates and Scaling
- **Rolling Updates**: Zero-downtime deployment updates
- **Horizontal Scaling**: Multiple provider deployment
- **Geographic Distribution**: Global provider selection

## Security Considerations

### Network Security
- **HTTPS**: TLS termination at provider level
- **Internal Communication**: Service-to-service encryption
- **API Keys**: Secure environment variable management

### Data Protection
- **Database Encryption**: At-rest and in-transit encryption
- **Session Management**: Secure Redis-based sessions
- **Backup Encryption**: IPFS content addressing with encryption

## Troubleshooting

### Common Issues
1. **Deployment Fails**: Check AKT balance and wallet configuration
2. **Service Unreachable**: Verify manifest networking configuration
3. **Database Connection**: Ensure PostgreSQL service health
4. **AI Chat Errors**: Validate Akash Chat API credentials

### Debug Commands
```bash
# Check deployment status
akash provider lease-status --dseq $DSEQ --provider $PROVIDER

# View service logs
akash provider service-logs --dseq $DSEQ --provider $PROVIDER

# Test connectivity
curl -f https://your-deployment.akash.network/health
```

## Future Enhancements

### Planned Features
- **IPFS Storage**: Complete static asset migration
- **Multi-Network**: Ethereum and Arbitrum support
- **CDN Integration**: Decentralized content delivery
- **Auto-Scaling**: Dynamic resource allocation

### Community Benefits
- **Open Source**: Full deployment transparency
- **Cost Efficiency**: Democratized cloud computing
- **Censorship Resistance**: Distributed infrastructure
- **Crypto Integration**: Native blockchain alignment

---

This decentralized deployment strategy positions OrderFi AI as a truly blockchain-native application, reducing operational costs while maintaining enterprise-grade reliability and performance.