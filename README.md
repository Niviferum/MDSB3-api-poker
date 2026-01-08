# Poker API – Setup Guide
## Prérequis

Docker Desktop
https://www.docker.com/products/docker-desktop

Git

### 1. Cloner le projet
``git clone https://github.com/Niviferum/api-poker.git`` puis
``cd api-poker`` 

### 2. Créer le fichier d’environnement
``cp .env.example .env``


Aucune modification n’est nécessaire en mode Docker.

###  ~~3. Lancer le projet (Docker)~~

~~Assure-toi que Docker Desktop est lancé, puis :~~

~~``docker compose up --build``~~

~~``docker compose up -d`` |  Ou en arrière-plan~~

### 4. Lancer le projet (npm)

Navigue dans api-poker | ``cd api-poker``

``npm install``

``npm run start:dev``



## Routes Principales

L'API a été documentée avec *Swagger* : **http://localhost:3030/api**

### AUTHENTIFICATION

- `POST /auth/register` | Créer un compte
- `POST /auth/login`| Se connecter
- `GET /auth/me`| Récupérer les informations du joueurs connecté

### TABLES  

- `GET /tables` | Lister toutes les tables disponibles
- `POST /tables` | Créer une nouvelle table
- `GET /tables/{id}`| Consulter les détails d'une table
- `POST /tables/{id}/join`| Rejoindre une table précise (une IA s'y joindra automatiquement si vous êtes seul à la table)
- `POST /tables/{id}/leave` | Quitter une table précise
- `DELETE /tables/{id}` | Supprimer une table précise

### CARDS

- `POST /cards/deck/{deckId}`| Créer un packet de 52 cartes mélangé
- `GET /cards/deck/{deckId}`| Récupérer un packet précis
- `POST /cards/deck/{deckId}/draw`| Piocher des cartes d'un packet précis
- `POST /cards/deck/{deckId}/deal`| Distribuer des cartes à tous les joueurs d'un packet précis
- `POST /cards/deck/{deckId}/community/{stage}`| Distribuer les cartes communautaires (**flop/turn/river**)
- `POST /cards/deck/{deckId}/shuffle`| Mélanger un packet précis
- `POST /cards/deck/{dickId}/reset`- Réinitialiser un packet précis
- `DELETE /cards/deck/{deckId}`| Supprimer un packet précis
- `GET /cards/decks`| Lister les packets actifs

### GAME

- `POST /game/tables/{id}/start`| démarrer une partie (distribution cartes + blindes)
- `POST /game/tables/{id}/action`| Jouer une action (fold/call/raise/check)
- `GET /game/tables/{id}/stats`| Obtenir l'état actuel de la partie

---

## AUTHENTIFICATION

Toutes les routes à part `auth/register` et `auth/login` nécessitent un token JWT.

**Comment l'utiliser:**

1. Récupérer le token via `auth/login`
2. Dans Swagger : Cliquer sur "Authorize"
3. Coller le token (sans Bearer)
4. Toutes les prochaines requêtes seront authentifiées tant qu'il n'y a pas de rafraîchissment de la page.


# Déroulement d'une partie

Lien de l'interface de jeu : http://localhost:3030/poker.html



#### 1. Distribution des cartes

    Chaque joueur reçoit 2 cartes privées (hole cards)

Les cartes ne sont visibles que par le joueur concerné

#### 2. Les blindes

    Small Blind : Le premier joueur mise obligatoirement la petite blinde

Big Blind : Le deuxième joueur mise obligatoirement la grosse blinde (2x la SB)Ces mises obligatoires créent le pot initial

#### 3. Tour de mise (Betting Round)
Le joueur après la grosse blinde commence, et chaque joueur peut :

Actions disponibles :

    FOLD : Se coucher (abandonner la main)
    CALL : Suivre la mise actuelleRAISE : Relancer (augmenter la mise, minimum 2x la mise actuelle)
    CHECK : Passer (uniquement si aucune mise n'a été faite)
    
#### 4. Fin du round

Le tour de mise se termine quand :

    Un seul joueur reste en jeu (tous les autres ont fold)

    Tous les joueurs actifs ont misé le même montant

#### 5. Détermination du gagnant
Version actuelle (simplifiée) :

    Le dernier joueur actif (qui n'a pas fold) remporte le pot


Version future (avec comparaison de mains) :

    Les cartes communautaires seront révélées (Flop, Turn, River)

La meilleure combinaison de 5 cartes gagne suivant les règles du poker classique (ex: Quinte Flush bat Brelan, Full bat Paire, etc.)
