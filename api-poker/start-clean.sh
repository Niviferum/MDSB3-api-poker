#!/bin/bash
echo " Nettoyage de dist/..."
docker run --rm -v "$(pwd)":/workspace -w /workspace alpine rm -rf dist 2>/dev/null || rm -rf dist 2>/dev/null
echo " Démarrage de l'app..."
npm run start:dev
