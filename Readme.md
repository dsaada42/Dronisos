# Test technique Dronisos:

Mon raisonnement pour répondre à la problématique posée a été le suivant:

1) Mettre en place un serveur Http et Udp permettant d'ecouter sur le port 5555 afin de récupérer les informations envoyées par les drones / les requetes Http sur l'api.

2) Etre capable de gérer un flux tendu d'information sans faire exploser l'usage de la RAM et tout en conservant la trace de l'entiereté des messages reçus

3) Prendre en compte la complexité des opérations entreprise pour rester performant face au flux ininterrompu de données. 

4) Rendre l'experience de developpement plus agréable pour plus facilement maintenir le code et avoir une approche "production ready" pour le déploiement

Pour cela j'ai mis en place:

- Pour gerer le flux tendu: Une queue O(1) qui conserve les messages reçus au cours des X dernières secondes (paramétrable via variable d'environnement)
- Cette queue déborde dans un array qui stocke le superflux. Afin de ne pas perdre la donnée, le programme génère des logs à intervalle X et reinitialise ce tableau.
- Une approche permettant de s'assurer de la régularité de cette sauvegarde et diminuant d'avantage le nombre d'opérations pourrait etre de multithreader et d'avoir un thread de supervision déclenchant ces opérations. Pour faire simple j'ai fait le choix de faire les verifications nécessaires a la sauvegarde sur réception des messages.

Concernant les aspects dev / prod:

- Un dockerfile.dev ainsi que docker-compose + makefile pour facilement maintenir le code et le faire evoluer (hot reload dev )
- Un dockerfile.prod multistage pour avoir une image minimale deployable facilement. (make push_prod pour push sur repo distant l'image versionnée)

En passant plus de temps sur ce code je ferais en priorité:
- Implementation d'une gestion d'erreur globale
- Passage au typescript et definitions d'interface et de moyens de validation
- Envoi des logs sur stockage distant

Pour tester: 

```
git clone
make up 
```
(ou make up_prod pour utiliser l'image de production)

Les endpoints pour recuperer les donnees des 60 dernieres secondes pour tous les drones:
```
localhost:5555/
```
pour récupérer les données d'un seul drone:
```
localhost:5555/id
```

