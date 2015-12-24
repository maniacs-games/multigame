var clientName;//, assignedColor;
var userName;
var connectedDice;
var colors = ['ff0000','ffffff','ff00ff','0000ff','ffff00','00ffff'];
var game;

/*
function reset(){
	connection.send(JSON.stringify({message:'',creatorName:'',assignedColor:'',type:'deconnexion'}));
}

*/
//check pour firefox (Mozilla). L'appel aux websockets s'écrit différemment
window.WebSocket = window.WebSocket || window.MozWebSocket;

//si le navigateur n'accepte pas les websocket
if (!window.WebSocket) {
      	console.log("Il faut utiliser un autre navigateur. Chrome par exemple.");
		
}else{

	//si le navigateur est ok
	//on initialise une connection sur le bon port, et la bonne IP (celle de l'ordinateur qui a le serveur)
	connection = new WebSocket('ws://'+IPAddress+':1337');
	//on ouvre la connection
	connection.onopen = function(){
		//connection.send(JSON.stringify({message:'',creatorName:'',type:'connection'}));	
	}
	
	connection.onerror = function(error){
		//on logge une erreur
		console.log("Il y a un problème avec la connection au serveur. Vérifiez l'IP ou le PORT...");
	}
	
	connection.onmessage = function(message){
		//on vérifie l'état du JSON afin d'éviter des erreurs
		 try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log("Le fichier JSON semble être mal formé");
			return;
        }
		
		switch(json.type){
			case 'activation':
				if(json.diceName == connectedDice){
					console.log("it's my turn to play ! with "+json.message);
					//activeFunction(parseInt(json.message));
					game.activeFunction(parseInt(json.message));
				}else{
					console.log("it's not my turn with "+json.message);
					//passiveFunction(parseInt(json.message));
					game.passiveFunction(parseInt(json.message));
				}
			break;
		
			case 'deconnexion':
				//console.log("déconnection de l'utilisateur "+json.user);
				if(json.featuring!='dice'){
					console.log("déconnexion de l'utilisateur "+json.user);

				}else if(json.featuring =='dice' && json.user == connectedDice){
					//console.log("the connected dice is disconnected");
					//-> reload the page
					window.location.reload();
				}
			break;
			case 'ready':
				connectedDice 	= json.diceName;
				clientName 		= json.userName;
				document.body.style.backgroundColor = '#' + game.getAssignedColor().substr(2,game.getAssignedColor().length-2);
				console.log("READY");
			break;
			case 'reload':
				console.log("you need to reload the game and the dice");
			break;
		}
	}
	game = new Game(colors,connection);
	game.connectionPanel();
}
