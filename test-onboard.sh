#!/bin/bash

echo "Testing restaurant onboarding API..."

# Test restaurant onboarding
curl -s -X POST http://localhost:5000/api/restaurants/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bella Italia",
    "description": "Authentic Italian cuisine in the heart of the city",
    "cuisine": "italian",
    "contactEmail": "info@bellaitalia.com",
    "ownerId": "owner_bella_123",
    "address": "123 Main St, City Center",
    "phone": "(555) 123-4567",
    "tone": "warm",
    "welcomeMessage": "Benvenuti! Welcome to Bella Italia where every meal is a celebration of authentic Italian flavors."
  }' | jq '.'

echo -e "\n\nTesting admin dashboard API..."

# Test admin restaurants endpoint
curl -s http://localhost:5000/api/admin/restaurants | jq '.'

echo -e "\n\nTesting restaurant by slug..."

# Test getting restaurant by slug
curl -s http://localhost:5000/api/restaurants/bella-italia | jq '.'