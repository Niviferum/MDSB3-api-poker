#!/bin/bash
echo "🔧 Setup des données de test..."

# User 1
curl -X POST http://localhost:3030/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"adrien","email":"adrien@test.com","password":"password123"}'

# User 2
curl -X POST http://localhost:3030/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"nael","email":"nael@test.com","password":"password123"}'

echo ""
echo "✅ Setup terminé !"
echo "Login avec: adrien / password123"