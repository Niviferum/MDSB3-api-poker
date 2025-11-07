# Poker API – Setup Guide
## Prérequis

Docker Desktop (obligatoire)
https://www.docker.com/products/docker-desktop

Git

### 1. Cloner le projet
``git clone https://github.com/Niviferum/api-poker.git
cd api-poker`` 

### 2. Créer le fichier d’environnement
``cp .env.example .env``


Aucune modification n’est nécessaire en mode Docker.

###  3. Lancer le projet (Docker)

Assure-toi que Docker Desktop est lancé, puis :

``docker compose up --build``


Ou en arrière-plan :

``docker compose up -d``


L’API sera disponible sur :

http://localhost:3000

###  4. Vérifier la base de données

Entrer dans PostgreSQL :

``docker exec -it poker_db psql -U postgres -d poker_db``


Lister les tables :

``\dt``


Quitter :

``\q``

###  5. Arrêter le projet
``docker compose down``


Supprimer aussi la base (reset complet) :

``docker compose down -v``

###  6. Relancer plus tard
``docker compose up``
