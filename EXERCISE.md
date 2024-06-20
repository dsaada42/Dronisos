# Contexte

On considère un ensemble de clients envoyant à intervalle régulier de la télémétrie à un serveur. Ces clients peuvent être simulés avec le script python `clients.py`. Ce client peut être exécuté avec Python après avoir installé les dépendances
avec `pip install -r requirements.txt`.

Pour que 3000 clients soient simulés et communiquent en UDP leur télémétrie à `localhost:5555`, il faut runner le script suivant:

```
python clients.py localhost 5555 3000
```

Chaque client simulé envoie sa télémétrie sous forme de JSON. Chaque télémétrie reçue contient toujours au moins le champ `name` qui identifie de manière unique le client et le champ `position` (un array de 3 floats). En complément, toutes les 10s
environ, chaque client envoie de la télémétrie complémentaire (des dictionnaires nommés `versions` et `config`).

_Le script python `server.py` est aussi fourni à titre d'exemple pour tester le bon fonctionnement `clients.py` vers `server.py`._

# Exercice

L'objectif est de proposer une implémentation Node.js de la partie serveur permettant d'agréger la télémétrie et d'exposer le résultat de cette agrégation sous forme d'un endpoint HTTP. Une requête GET sur cet endpoint renvoie la liste des clients
ayant envoyé de la télémétrie récemment (dernière télémétrie reçue il y a moins de 60s par exemple). Cet endpoint doit proposer un filtrage basique sur le champ `name` des clients.

Cette implémentation Node.js devra pouvoir être exécuté sous forme de container `docker`.