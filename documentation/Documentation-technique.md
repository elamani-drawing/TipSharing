## Pourquoi avoir choisi Angular-Cli, Express et Passport?

Nous avons décidé de travailler sur ces 3 technologies pour 2 grandes raisons : 

La première est que ce sont des technologies complet, populaires, connu et reconnu, les maitriser et avoir des projets à présenter valorisera nos CV et augmentera nos chances d’avoir un stage au second semestre. \
La seconde est que ces technologies sont celles que nous avons étudié en cours. Nous souhaitions finir la matière en ayant poussé l’étude de ces technologies au maximum possible plutôt que de nous lancer sur une nouvelle technologie en risquant de rester sur notre faim et en ayant des zones d’ombres.

## L'architecture de l'API

Au départ, nous souhaitions partir sur une architecture semblable à celle que nous avons utiliser au premier projet, mais le second projet étant plus conséquent nous avons conclu que cela aller devenir trop lourd à maintenir ce qui pourrait augmenter les risques d’erreur. Après des recherches, des concertations et beaucoup de brain-storting nous avons adopter cette structure : 

* annexe : vous avez les annexes du projet : exemple de fichier .env, un fichier d’importation pour les collections Postman etc.
* config : contient la configuration Sequelize (réalise un appel du fichier .env)
* controllers : les contrôleurs de l’API, elles correspondent aux implémentations des fonctions appeler dans les déclarations de routes. Elles reçoivent les requêtes, les traitent et répondent en fonctions.
* fakers : c’est un ensemble de fonction que nous avons écrites pour remplir automatiquement la base de donnée avec des « fausses » données pour nos tests.
* media : correspond au dossier des différents media de l’API, à l’intérieur nous pouvons y retrouver un dossier ou sont stocker les photos de profil des différents utilisateurs et un autre pour les images des astuces.
* middlewares : contient les différents middleware de l’API, comme c’elle vérifiant si un utilisateur est connecter ou non, ou encore c’elle vérifiant si un utilisateur est un admin ou non.
* models : contient notre instance Sequelize et la définition de tous les Model Sequelize que nous avons écrit ainsi que leur différentes relation entre eux.
* modules : contient toutes les fonctions que nous avons écrites. Par exemple file.module.js contient tous ce qui est relatif au fichier comme les fonctions nécessaire à la vérification et le traitement d’une image qu’on téléchargerait sur l’API.
* routes : contient les différentes routes de l’API.
* .env : contient toutes les variables d’environnement dont a besoin l’API
* index.js : est le fichier principal permettant de lancer l’api. A l’intérieur nous y créons notre instance Express et nous y chargeons tous ce dont nous avons besoin, comme les routes etc.

## L'architecture du client

Appart les TP que nous avons réalisé, aucun de nous n’avait d’expérience sur Angular. Nous avons donc fait beaucoup de recherche pour voir ce qui était réaliser en therme de projet Angular. Cela nous a permis d’isolé plusieurs structures intéressantes qui revenaient souvent. Nous détaillerons ici la structure que nous avons choisie d'utiliser. \
Nous avons préféré celle-ci aux autres car nous estimions qu’elle était meilleur au niveau de la maintenabilité et de la réutilisabilité du code. Tout les sous modules sont en même temps reliés mais aussi isolé entre eux. Demain si je réalise un nouveau projet Angular, je peux très bien copier-coller le module Auth et utiliser ses services et ses validators dans le nouveau projet sans souci.

* core : est un sous module regroupant les composants de base dont a besoin l’application, les guards, intercepteurs de requête et ainsi que tous les services qui doivent être chargé une seul fois sur toute l’application (pour pouvoir avoir une seul instance d’un service qui sera partagé pour tous les modules).
* shared : est un sous module regroupant les directives, modules, services etc. partagé entre tout les sous modules de l’application. Cela permet d’importer en une ligne SharedModule dans tous les autres sous modules plutôt que d’avoir encore et encore les mêmes lignes de déclarations, d’imports dans tous les sous modules.
* accueil : est un composant représentant la page d’accueil.
* admin : est un sous module regroupant les composants, services, modèles etc. qui sont dédiés administrateurs
* auth : est un sous module regroupant les composants, services, modèles etc. dédier à la gestion de l’authentification. Comme les composants login, register, logout etc.
* membre : est un sous module regroupant les composants, services, modèles etc. dédier aux membres.
* tips : est un sous module regroupant les composants, services, modèles etc. dédier aux tips.

En général un sous module est organisé de cette manière :

* components : tous les composants du sous module.
* services : tous les services dédier qu’a ce sous modules et qui n’ont pas besoin de posséder une seul instance partager sur toute l’application.
* validators : les validateurs dédier a ce sous module.
* models : les models dédié à ce sous module. (Si le modèle est requis par d’autres sous modules, il est déplacé dans SharedModule)