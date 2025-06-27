#!/bin/bash

# OrderFi AI - Akash Network Deployment Script
set -e

echo "🚀 OrderFi AI - Akash Network Deployment"
echo "========================================"

# Check if Akash CLI is installed
if ! command -v akash &> /dev/null; then
    echo "❌ Akash CLI not found. Installing..."
    curl -sSfL https://raw.githubusercontent.com/akash-network/provider/main/install.sh | sh
    export PATH=$PATH:./bin
fi

# Set environment variables
export AKASH_NET="https://raw.githubusercontent.com/akash-network/net/main/mainnet"
export AKASH_VERSION="$(curl -s "$AKASH_NET/version.txt")"
export AKASH_CHAIN_ID="$(curl -s "$AKASH_NET/chain-id.txt")"
export AKASH_NODE="$(curl -s "$AKASH_NET/rpc-nodes.txt" | shuf -n 1)"

echo "📋 Network Configuration:"
echo "   Chain ID: $AKASH_CHAIN_ID"
echo "   Node: $AKASH_NODE"
echo "   Version: $AKASH_VERSION"

# Check wallet setup
if [ -z "$AKASH_KEY_NAME" ]; then
    echo "❌ AKASH_KEY_NAME environment variable not set"
    echo "   Please set your Akash wallet key name:"
    echo "   export AKASH_KEY_NAME=your-key-name"
    exit 1
fi

# Check account balance
echo "💰 Checking account balance..."
BALANCE=$(akash query bank balances --node $AKASH_NODE $(akash keys show $AKASH_KEY_NAME -a) -o json | jq -r '.balances[0].amount')
if [ "$BALANCE" -lt 5000000 ]; then
    echo "❌ Insufficient balance. Need at least 5 AKT for deployment"
    echo "   Current balance: $((BALANCE / 1000000)) AKT"
    exit 1
fi

echo "✅ Account balance: $((BALANCE / 1000000)) AKT"

# Create deployment
echo "📝 Creating deployment..."
akash tx deployment create deploy-akash.yaml \
    --from $AKASH_KEY_NAME \
    --node $AKASH_NODE \
    --chain-id $AKASH_CHAIN_ID \
    --gas-prices 0.025uakt \
    --gas auto \
    --gas-adjustment 1.15 \
    --broadcast-mode block \
    -y

# Get deployment sequence
DSEQ=$(akash query deployment list --owner $(akash keys show $AKASH_KEY_NAME -a) --node $AKASH_NODE -o json | jq -r '.deployments[0].deployment.deployment_id.dseq')
echo "📋 Deployment sequence: $DSEQ"

# Wait for bids
echo "⏳ Waiting for bids..."
sleep 30

# List providers
echo "🏢 Available providers:"
akash query market bid list --owner $(akash keys show $AKASH_KEY_NAME -a) --node $AKASH_NODE --dseq $DSEQ

# Create lease (accept first bid)
PROVIDER=$(akash query market bid list --owner $(akash keys show $AKASH_KEY_NAME -a) --node $AKASH_NODE --dseq $DSEQ -o json | jq -r '.bids[0].bid.bid_id.provider')
GSEQ=$(akash query market bid list --owner $(akash keys show $AKASH_KEY_NAME -a) --node $AKASH_NODE --dseq $DSEQ -o json | jq -r '.bids[0].bid.bid_id.gseq')
OSEQ=$(akash query market bid list --owner $(akash keys show $AKASH_KEY_NAME -a) --node $AKASH_NODE --dseq $DSEQ -o json | jq -r '.bids[0].bid.bid_id.oseq')

echo "🤝 Creating lease with provider: $PROVIDER"
akash tx market lease create \
    --dseq $DSEQ \
    --gseq $GSEQ \
    --oseq $OSEQ \
    --provider $PROVIDER \
    --from $AKASH_KEY_NAME \
    --node $AKASH_NODE \
    --chain-id $AKASH_CHAIN_ID \
    --gas-prices 0.025uakt \
    --gas auto \
    --gas-adjustment 1.15 \
    --broadcast-mode block \
    -y

# Wait for lease to be active
echo "⏳ Waiting for lease activation..."
sleep 60

# Send manifest
echo "📤 Sending manifest to provider..."
akash provider send-manifest deploy-akash.yaml \
    --dseq $DSEQ \
    --provider $PROVIDER \
    --from $AKASH_KEY_NAME \
    --node $AKASH_NODE

# Get service status
echo "📊 Checking deployment status..."
sleep 30

akash provider lease-status \
    --dseq $DSEQ \
    --from $AKASH_KEY_NAME \
    --provider $PROVIDER \
    --node $AKASH_NODE

# Get service URLs
echo "🌐 Getting service URLs..."
akash provider lease-status \
    --dseq $DSEQ \
    --from $AKASH_KEY_NAME \
    --provider $PROVIDER \
    --node $AKASH_NODE \
    -o json | jq -r '.services.orderfi-app.uris[]'

echo ""
echo "🎉 OrderFi AI deployed successfully on Akash Network!"
echo ""
echo "📋 Deployment Details:"
echo "   DSEQ: $DSEQ"
echo "   Provider: $PROVIDER"
echo "   Chain ID: $AKASH_CHAIN_ID"
echo ""
echo "🔗 Access your application at the URLs shown above"