var App = function (){

	this.w 				= window.innerWidth;
	this.h 				= window.innerHeight;
	this.canvas 		= document.getElementById('canvas');
	this.canvas.width 	= this.w;
	this.canvas.height 	= this.h;
	this.ctx 			= this.canvas.getContext('2d');

	//utils
	this.angle 			= 30*Math.PI/180;
	this.caseWidth 		= 70;
	this.nbrCase		= 5;
	this.allCases 		= [];
	this.centre 		= {"x":window.innerWidth/2,"y":window.innerHeight/2};

}


App.prototype = {



	setup:function(){

		//creation de toutes les Cases
		 this.id = 0;
		//pour avoir les 5 cases par ANGLE
		 this.radiusMax = this.nbrCase*this.caseWidth;
		while(this.radiusMax>0){
			for(var i=0;i<360;i+=30){
				//creation de case
				 this.maCase = new Case(this.centre.x,this.centre.y,this.radiusMax,this.angle,i,this.ctx,this.id,this.caseWidth);
				this.allCases.push(this.maCase);
				this.id++;
			}
			this.radiusMax-=this.caseWidth;
		}
		document.addEventListener("mousemove", this.onMouseMove.bind(this));
		document.addEventListener("click", this.onMouseClick.bind(this));
		this.draw();
	},

	diceManager:function(val){
		console.log("dice",val);
	},

	onMouseMove:function(e){
		//JUST FOR ROLLOVER
		for(var i=0;i<this.allCases.length;i++){
			this.allCases[i].check(e.pageX,e.pageY);
		}
	},

	onMouseClick:function(e){
		this.myCase;
		for(var i=0;i<this.allCases.length;i++){
			this.myCase = this.allCases[i].check(e.pageX,e.pageY);
			if(this.myCase!=undefined){
				break;
			}	
		}
		//TWEEN JUST THE SELECTED CIRCLE
		if(this.myCase!=undefined){
			for(var i=0;i<this.allCases.length;i++){
				if(this.allCases[i].radius == this.myCase.radius){
					this.allCases[i].tween(30);
				}
			}
		}
	},

	draw:function(){
		TWEEN.update();
		this.ctx.clearRect(0,0,this.w,this.h);
		//dessiner
		for(var i=0;i<this.allCases.length;i++){
			this.allCases[i].display();
		}
		requestAnimationFrame(this.draw.bind(this	));
	}



}

