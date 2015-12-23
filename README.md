# Launching game
### Configuration
Clone this repo in the htdocs directory of an Apache server (e.g. MAMP).

### Executing
* Launch Apache (on default port - 80).
* Launch Node.js server (communication between dices and board) by executing `node node_server/diceServer.js`
* Open dice and board with Apache (respectively <a href="127.0.0.1/multigame/dice.html" target="_blank">127.0.0.1/multigame/dice.html</a> and <a href="127.0.0.1/multigame/" target="_blank">127.0.0.1/multigame/</a>)
* On board, select your dice color




 access Projects/multigame/js/ipAdress and change the adress IP.

 On Your computer, access localhost and open index.html
 On your phone, connect the dice by accessing the dice.html 








<b>PROCEDURE</b>
Pour faire fonctionner ces scripts, vous devez:
- Exécuter un serveur node pour les connexions wegsocket
- Exécuter un serveur web local pour le stockage et l'accessibilité des fichier (HTML, CSS, JS, images, etc..)
- Connaître l'addresse IP de l'ordinateur sur lequel tournent les serveurs.




<b>Lancement du serveur web</b>
Il faut lancer MAMP et vérifier que vous tombiez sur une page accessible à l'addresse http://localhost ou http://localhost:8888 si vous fonctionnez sur les port par défaut de MAMP
Il faut également lancer le serveur NODE en executant la commande "node Node_server/diceServer.js" depuis le terminal. Attention suivant où vous êtes positionnés dans l'arborescence, il faudra peut-etre vous déplacer dnas un autre dossier avec la commande "cd2".



terminal --> OUVERTURE DU PORT 
 cd /Users/salome/Projects/multigame/Node_server
  Node diceServer.js

  (ou depuis htdocs si ca ne fonctionne pas, dossier dans MAMP)

<b>Connexion du dé sur iphone et synchronisation avec le jeu correspondant</b>
Afin de faciliter le pairing entre le dé et l'interface, une palette de couleurs s'affiche lorsque l'utilisateur se connect au serveur, et il suffit de cliquer sur la couleur correspopndante pour faire correspondre le dé avec l'écran en question.


<b>Script detail</b>
Pour ce jeu il y a 3 scripts de base:
- dice.js  (script qui fait fonctionneer les dés)
- game.js  (script qui met en place tout le jeu)
- socket_connections.js (script du serveur)

<b>Les fonctions à éditer</b>
line 58 => <b>activeFunction:function(val){}</b>
line 63 => <b>passiveFunction:function(val){</b>
line 68 =><br>init</b>

<b>Exemple de la grille </b>
Le script Jeu.js, est un simple exemple de comment un jeu sur ce système peut fonctionner avec les 3 functions principale:
line 9  => <b>initJeu()</b>
line 28 => <b>move()</b>
line 49 => <b>moveBack()</b>

Cet exemple fait 3 choses:
- Il cré les cases et le pion au chargement
- Fait avancer le pion quand le joueur "actif" tire le dé
- Fait reculer le pion quand le joueur "passif" tire le dé

Pour ceci, l'idée est de récupérer la position de chaque case via son ID, et de récupérer son positionnement dans la page.

Tout le code du Jeu.js est proposé sous la forme d'un prototype JS qui est instancié dans le script Game.js.