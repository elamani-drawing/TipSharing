Cette page explique comment démarrer l'application.

Vous avez dans le dossier [\\express-js-tips-sharing\\annexe](./../express-js-tips-sharing/annexe):

1. [progwebserveur.postman_collection.json](./../express-js-tips-sharing/annexe/progwebserveur.postman_collection.json) : qui vous permet d'importer toutes les routes postman.
2. [progwebserveur.sql](./../express-js-tips-sharing/annexe/progwebserveur.sql) : qui vous permet d'importer la base de donnée.

# Le client web: Angular-cli

* cd .\\angular-tips-sharing\\
* ng serve
* Configurer le fichier environement.ts pour le client angular: 
```env
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  clientUrl: 'http://localhost:4200',
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: ''
};
```

# L'API: Express

Se rendre sur le projet express en faisant : cd .\\express-js-tips-sharing\\

## Configurer le fichier .env

```env
HOST_BDD=localhost
USER_BDD=
PASSWORD_BDD=
DATABASE_BDD=progwebserveur
SQUELIZE_DIALECT=mysql
BCRYPT_SALT_ROUND=10
JWT_DURING_TIME=30
JWT_MAX_EXPIRATION_TIME=10
SECRET_JWT_KEY=SbvskBbvtR3yhgUtYnwtzB2AClfQwO6tBXux4xYDRw6Aur9sE8Ckban
PORT_API=3000
```

USER_BDD : est l'utilisateur de la base de donnée

PASSWORD_BDD : est le mot de passe pour se connecter a la base de donnée

### Créer la base de donnée:

### Méthode 1:

Générer la base de données : tables, données (avec des faux tips et vrai tips écrit par nous) en important le fichier [.\\annexe\\progwebserveur.sql](./../express-js-tips-sharing/annexe/progwebserveur.sql)

### Méthode 2:

Générer les tables automatiquement en faisant

```shell
npm run bdd
```

ou

```shell
node .\models\index.js
```

Remplir la base de donnée avec des données de test (faux tips)

```shell
npm run faker
```

ou

```shell
node .\fakers\index.js
```

Lancer le serveur Express avec

```shell
npm run serve
```

ou

```shell
node .\index.js
```