## Launching game
### Configuration
Clone this repo in the htdocs directory of an Apache server (e.g. MAMP).

### Executing
* Launch Apache (on default port - 80).
* Launch Node.js server (communication between dices and board) by executing `node node_server/diceServer.js`
* Open dice and board with Apache (respectively <a href="http://127.0.0.1/multigame/dice.html" target="_blank">127.0.0.1/multigame/dice.html</a> and <a href="http://127.0.0.1/multigame/" target="_blank">127.0.0.1/multigame/</a>)
* On the board, select your dice color

_Note: if you need to launch a dice on a smartphone, update `/multigame/js/ipAddress.js` to include your Websocket server's IP address, then open the `/multigame/dice.html` file_

## TODO

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