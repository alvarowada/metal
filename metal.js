
var startGame = function(){	var Q = Quintus()
		
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio")
	.setup({ width: 700, height: 300 /*,scaleToFit: true*/ })
	.controls().touch()
	.enableSound();

	Q.debug = true;


	var SPRITE_PLAYER = 1;
	var SPRITE_ENEMY = 2;
	var SPRITE_ENEMY_BULLET = 4;
	var SPRITE_PLAYER_BULLET = 8;
	var SPRITE_TILED=16


    //-------------- ANIMACIONES --------------//

    //---Walter----//
	Q.animations("walter_anim",{
		walk_right:{ frames:[8,9,10,11,12,13,14], rate:1/4, flip:false, loop:false},
		walk_left:{ frames:[8,9,10,11,12,13,14], rate:1/4, flip:"x", loop:false },
		stand_right:{frames:[0], rate:1, flip:false, loop:true},
		stand_left:{frames:[0], rate:1, flip:"x", loop:true},
		jump_right:{frames:[5], rate:1, flip:false, loop:true },
		jump_left:{frames:[5], rate:1, flip:"x", loop:true },
		fire_right:{frames:[3], rate:1/5, flip:false, loop:false},
		fire_left:{frames:[3], rate:1/5, flip:"x", loop:false},
		bend_right:{frames:[20], rate:1/4, flip:false, loop:false},
		bend_left:{frames:[20], rate:1/4, flip:"x", loop:false},
		fire_upR:{frames:[25], rate:1/5, flip:false, loop:false},
		fire_upL:{frames:[25], rate:1/5, flip:"x", loop:false}
	});

	Q.animations("walter_dead",{
		dead:{ frames:[0,1,2,3,4,5], rate:1/2, flip:false, loop:false, trigger:"dead"}
	});


	//---Soldier---//
	Q.animations("soldier_anim",{
		walk_right:{ frames:[0,1,2,3,4,5], rate:1/3, flip:"x", loop:false },
		walk_left:{ frames:[0,1,2,3,4,5], rate:1/3, flip:false, loop:false }
	});

	Q.animations("soldierD",{
		dead:{ frames:[0,1,2,3], rate:1/2, flip:false, loop:false, trigger:"dead"}
	});

	Q.animations("rBullet_anim",{
		r:{ frames:[0], rate:1/3, flip:"x", loop:false, trigger:"dead"}
	});

	Q.animations("explosion",{
		explote:{ frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], rate:1/5, flip:false, loop:false, trigger:"dead"}
	});

	Q.animations("knife",{
		knife:{ frames:[0,1,2,3], rate:1/5, flip:false, loop:false}
	});

	Q.animations("helicopter",{
		helicopter:{ frames:[0,1,2,3,4,5,6,7,8,9,10,11,12], rate:1/5, flip:false, loop:false}
	});



	//--------- WALTER ----------//
	Q.Sprite.extend("Player",{
		
		init:function(p){		
			this._super(p,{
				sheet:"Walter",
				sprite:"walter_anim",
				type: SPRITE_PLAYER
				,collisionMask: SPRITE_ENEMY_BULLET|SPRITE_TILED
			});

			Q.input.on("fire",this,"fire");
			Q.input.on("fireUp",this,"fireUp");
			
			Q.input.on("bomb",this,"bomb");
			Q.input.on("bombUp",this,"bombUp");
			
			this.add("2d, platformerControls, animation");
		},

		step:function(dt){

			if(!this.p.muriendo){
				//console.log(this.p.h);
				this.p.sprite = "walter_anim";
				this.p.sheet = "Walter";
				this.size(true);

				var p = this.p;
				if(p.y>600){
					p.x=150;
					p.y=380
				}
				
				
				if(Q.inputs['down']){
					if(this.p.direction==="right")
						this.play("bend_right",1);
					else
						this.play("bend_left",1);
					this.p.sheet = "WalterA";
				}
				
				if(this.p.vx>0){
					this.play("walk_right");
					this.p.sheet = "Walter";
				}
				else if(this.p.vx<0){
					this.play("walk_left");
					this.p.sheet = "Walter";
				}
				else{//esta parado
					if(this.p.direction==="right")
						this.play("stand_right");
						if(this.p.direction==="down")
							this.play("bend_right");
					else if(this.p.direction==="left")
						this.play("stand_left");
						if(this.p.direction==="down")
							this.play("bend_left");

				}
				
				if(this.p.vy<0){
					if(this.p.direction==="right")
						this.play("jump_right");
					else if(this.p.direction==="left")
						this.play("jump_left");
					this.p.sheet = "Walter";
				}
			}
		},

		//Función para disparar
		fire: function() {
            var p = this.p;
			if(!this.p.dispara){

				var enemigos = Q("Enemy");
					
				x=this.p.x;
				y=this.p.y;
				//para cada enemigo del nivel
				masCercanoDistancia=999999;
				for(var i in enemigos.items){
					
					enemigo=enemigos.items[i];
					c1=enemigo.p.x-x;
					c2=enemigo.p.y-y;
					distancia= Math.sqrt((c1*c1)-(c2-c2));
					if(distancia<masCercanoDistancia){
						masCercanoDistancia=distancia;
						masCercano=enemigo;
					}
				}
				console.log(masCercanoDistancia);
				if(masCercanoDistancia<=50){
					console.log("acuchilla");
					masCercano.hit(5);
					Q.state.inc("score", 40);
					Q.audio.play('cuchillo.mp3');

				}
				else{
					console.log("dispara");
					bala=new Q.Bullet({
						x: p.x +4,
						y: p.y,
						vx: +500

					})
					
					if(Q.inputs['arriba']){
						if(p.direction==="right"){
							this.play("fire_upR",1);
							this.size(true);
							bala=new Q.Bullet({
									x: p.x +4,
									y: p.y-4,
									vx: 1,
									vy:-500
								})
						}
						else if(p.direction==="left"){
							this.play("fire_upL",1);
							bala=new Q.Bullet({
									x: p.x -4,
									y: p.y-4,
									vx: -1,
									vy: -500
								})
						}
					}
					else if(p.direction==="right"){
						this.play("fire_right",1);
						bala=new Q.Bullet({
								x: p.x +4,
								y: p.y,
								vx: +500

							})
					}
					else if(p.direction==="left"){
						this.play("fire_left",1);
						bala=new Q.Bullet({
								x: p.x -4,
								y: p.y,
								vx: -500

							})
					}
					
					if(Q.state.get("ammo")===0){
						bala.add("playerBullet");
						Q.audio.play('pistola2.mp3');
					}
						
					else{
						Q.state.dec("ammo", 1);
						if(Q.state.get("arma")==="r"){
							bala.add("rBullet");
							Q.audio.play('escopeta.mp3');

						}
						if(Q.state.get("arma")==="h"){
							bala.add("hBullet");

							Q.audio.play('metralleta.mp3');
						}	

					}
					bala.size(true);
					this.stage.insert(bala);
				
				}
				this.p.dispara=true;
			}
        },
		fireUp:function(){
			this.p.dispara=false;
		},

        //Funcion para tirar bomba
		bomb:function(){

			if(!this.p.bomba && Q.state.get("bombs")>0){				
				var p = this.p;
				if(p.direction==="right"){
					this.stage.insert(new Q.Bomb({
						x: p.x+4,
						y: p.y - p.w/2,
						vx: 200+p.vx,
						vy:-300
					}))
				}
				else if(p.direction==="left"){
					 this.stage.insert(new Q.Bomb({
						x: p.x-4,
						y: p.y - p.w/2,
						vx: -200+p.vx,
						vy:-300
					}))
				}
				Q.state.dec("bombs", 1);
				this.p.bomba=true;
			}
		},
		bombUp:function(){
			this.p.bomba=false;
		}
	});
	

	//---------- BALAS ----------//
	Q.Sprite.extend("Bullet",{
		
		init:function(p){
			this._super(p,{
				sheet:"bullet",
				sprite: "bullet",
                type: SPRITE_PLAYER_BULLET,
				collisionMask: SPRITE_ENEMY|SPRITE_TILED ,
                sensor: true,
				gravity:0
			});
			this.add("2d");
		},
		step: function(dt) {
		
			var player = Q("Player");
			
			x=this.p.x;
			y=this.p.y;
			
			player=player.first();
			c1=player.p.x-x;
			c2=player.p.y-y;
			distancia= Math.sqrt((c1*c1)-(c2-c2));
			if(distancia>600 ){
				this.destroy();
			}
            if (this.p.y < 0 ||this.p.vx===0) {
                this.destroy();
            }
        }
	});

	Q.component('playerBullet',{
		added: function() {
			this.entity.on("hit", "hit" );
		},
		extend: {
			hit: function(col){
				if (col.obj.isA("Enemy")) {
						this.destroy();
						col.obj.hit(1);
					}
			}
		}
	});
	
	Q.component('hBullet',{
		added: function() {
			this.entity.p.sheet="bulletH";
			this.entity.p.sprite= "hBullet_anim";
			this.entity.on("hit", "hit" );

		},
		extend: {
			hit: function(col){
				if (col.obj.isA("Enemy")) {
						this.destroy();
						col.obj.hit(2);
					}
			}
		}
	});

	Q.component('rBullet',{
		added: function() {
			this.entity.p.sheet="bulletR";
			this.entity.p.sprite= "rBullet_anim";
			this.entity.p.t=0;			
			this.entity.p.skipCollide=true;
			//delete(this.entity.p.type);
			//delete(this.entity.p.collisionMask);
			console.log(this.entity);
		},
		extend: {

			hit: function(col){
				if (col.obj.isA("Enemy")) {
					this.rango();
				}
			},
			step:function(dt){
				this.p.t+=dt;
				if(this.p.t>0.1){
					this.rango();
				}
			},
			rango:function(){
				var enemigos = Q("Enemy");
				
				x=this.p.x;
				y=this.p.y;
				//para cada enemigo del nivel
				for(var i in enemigos.items){
					
					enemigo=enemigos.items[i];
					c1=enemigo.p.x-x;
					c2=enemigo.p.y-y;
					
					distancia= Math.sqrt((c1*c1)-(c2-c2));
					if(distancia<15){
						console.log(distancia);
						enemigo.hit(5);
						Q.state.inc("score", 20);
					}
				}
				this.destroy();
       		}
		}
	});

	
	Q.component('enemyBullet',{
		added: function() {
			this.entity.p.sheet="enemyBullet";
			this.entity.p.sprite= "enemyBullet";
			this.entity.on("hit", "hit" );
			this.entity.p.type= SPRITE_ENEMY_BULLET;
			this.entity.p.collisionMask= SPRITE_PLAYER|SPRITE_TILED;
		},
		extend: {
			hit: function(col){
				if (col.obj.isA("Player")) {
					this.destroy();
					Q.state.dec("lives", 1);
				}
			}
		}
	});

	Q.component('finalEnemyBullet',{
		added: function() {
			this.entity.p.sheet="bulletC";
			this.entity.p.sprite= "bulletC";
			this.entity.on("hit", "hit" );
			this.entity.p.type= SPRITE_ENEMY_BULLET;
			this.entity.p.collisionMask= SPRITE_PLAYER|SPRITE_TILED;
			this.entity.p.t=0;
			this.entity.size(true);
		},
		extend: {
			hit: function(col){
				if (col.obj.isA("Player")) {
					this.destroy();
					Q.state.dec("lives", 1);
				}
			},
			step: function(dt) {
				this.p.t+=dt;
				if(this.p.t>4)
					this.destroy();
				var player = Q("Player");
				
				x=this.p.x;
				y=this.p.y;
				
				player=player.first();
				c1=player.p.x-x;
				c2=player.p.y-y;
				
				if(c1<0)//delante
					this.p.vx=-50;
				else if(c1>0)//detras
					this.p.vx=50;	
				else
					this.p.vx=0;
					
				if(c2>0)//arriva
					this.p.vy=50;
				else if(c2<0)//abajo
					this.p.vy=-50;
				else 
					this.p.vy=0;
			}
		}
	});
	

	//---------- BOMBAS ----------//
	Q.Sprite.extend("Bomb",{
		
		init:function(p){
			this._super(p,{
				sprite:"bomb",
				sheet:"bomb",
                type: SPRITE_PLAYER_BULLET,
				collisionMask: SPRITE_ENEMY|SPRITE_TILED ,
                sensor: true,
                botes:0
			});

			this.add("2d,animation");
			this.on("hit");
			this.on("dead");
		},
        dead: function(){
        	//console.log("destrulle bomba");
			this.destroy();
        },
		step: function(dt) {
			if(!this.p.explotando){
				if(this.p.botes>2)
					this.explota();
				if(this.p.vy===0){
					this.p.vy=-200;
					this.p.botes++;
				}
				if (this.p.y < 0) {
					this.destroy();
				}
			}
        },
		hit: function(col) {
			if (col.obj.isA("Enemy")) {
				Q.audio.play('explosion.mp3');
				this.explota();
			}		
        },
        explota:function(){
			this.p.explotando=true;
        	var enemigos = Q("Enemy");
			this.p.vx=0;
			this.p.gravity=0;
			this.p.vy=-50;
			x=this.p.x;
			y=this.p.y;
			//para cada enemigo del nivel
			for(var i in enemigos.items){
				
				enemigo=enemigos.items[i];
				c1=enemigo.p.x-x;
				c2=enemigo.p.y-y;
				distancia= Math.sqrt((c1*c1)-(c2-c2));
				if(distancia<150){
					enemigo.hit(5);
					Q.state.inc("score", 20);
				}
			}
			this.p.sheet="Explosion";
			this.p.sprite= "explosion";
			Q.audio.play('explosion.mp3');
			this.size(true);			
			this.play("explote");
		}
	});

	
	//---------- ENEMIGOS ------------//
	Q.Sprite.extend("Enemy",{	
		init:function(p){
			
			this._super(p,{
				sheet:"Soldier",
				sprite:"soldier_anim",
				type: SPRITE_ENEMY,
				collisionMask: SPRITE_PLAYER_BULLET|SPRITE_TILED ,
				//skipCollide: true 
			});
			this.add("2d, animation,aiBounce");
		}
	});

	Q.component('defaultEnemy',{
		added: function() {
			this.entity.p.t=0;
			this.entity.on("dead");
		},
		extend: {
			dead:function() {
				this.destroy();

			},
			hit:function(damage) {
				Q.state.inc("score", 10);
				if(this.p.hp){
					this.p.hp-=damage;
					if(this.p.hp<=0){
						this.p.sprite = "soldierD";
						this.p.sheet = "SoldierD";
						this.p.vx=0;
						this.play("dead");
						Q.audio.play('muerte2.mp3');
						this.p.muriendo = true;
					}
				}
				else{
					this.p.sprite = "soldierD";
					this.p.sheet = "SoldierD";
					this.p.vx=0;
					this.play("dead");
					Q.audio.play('muerte2.mp3');
					this.p.muriendo = true;
				}
				console.log("vida enemigo: ",this.p.hp);
			},
			step:function(dt){
				if(!this.p.muriendo){
					if(this.p.vx>0)
						this.play("walk_right");
					else if(this.p.vx<0)
						this.play("walk_left");
					else{//esta parado
						if(this.p.direction==="right")
							this.play("stand_right");
						else if(this.p.direction==="left")
							this.play("stand_left");
					}
					
					this.p.t+=dt;
					if(this.p.t>2){
						var player = Q("Player");
					
						x=this.p.x;
						y=this.p.y;
						
						player=player.first();
						c1=player.p.x-x;
						c2=player.p.y-y;
						distancia= Math.sqrt((c1*c1)-(c2-c2));
						if(distancia<300 ){
							this.p.vx=0;
							this.p.t=0;
							

							if(c1<0){//delante
								Q.audio.play('pistola.mp3');
								b=new Q.Bullet({x: this.p.x ,y: this.p.y,vx: -150})
								this.p.vx=100;
							}
							else if(c1>0){//detras
								Q.audio.play('pistola.mp3');
								b=new Q.Bullet({x: this.p.x +20,y: this.p.y,vx: 150})
								this.p.vx=-100;
							}						
							b.add("enemyBullet");							
							this.stage.insert(b);						
						}
					
						this.p.t=0;
					}
					
				}
			}
		}
	});
	
	Q.component('finalEnemy',{
		
		added: function() {
			this.entity.p.sheet="tank";
			this.entity.p.sprite= "tank";
			this.entity.p.t=0;
			this.entity.p.rafaga=0;
			this.entity.size(true);
		},
		extend: {
			hit:function(damage) {
				Q.state.inc("score", 10);
				console.log(this.p.hp);
				this.p.hp-=damage;
				//console.log(this.p.hp);
				if(this.p.hp<=0){
					this.destroy();
					Q.stageScene("inicio");
				}
			},
			step:function(dt){
				this.p.t+=dt;

				if(this.p.t>1.5){
					if(this.p.disparando){
						
						if(this.p.rafaga===4){
							this.p.t=-3;
							this.p.rafaga=0;
							this.p.disparando=false;
						}
						else{
							//console.log("dispara");
							Q.audio.play('misil.mp3');
							b1=new Q.Bullet({x: this.p.x -4,y: this.p.y,vx: -100})
							b1.add("finalEnemyBullet");							
							this.stage.insert(b1);

							this.p.rafaga++;
							this.p.t=0;
						}
					}
					else{
						//console.log("comprueba");
						var player = Q("Player");
					
						x=this.p.x;
						y=this.p.y;
						
						player=player.first();
						c1=player.p.x-x;
						c2=player.p.y-y;
						distancia= Math.sqrt((c1*c1)-(c2-c2));
						if(distancia<300 ){
							this.p.disparando=true;
						}
						this.p.t=0;
					}
					
				}
			}
		}
	});
	
	
	/*Q.component('helicopterEnemy',{
		added: function() {
			this.entity.p.sheet="Helicopter";
			this.entity.p.sprite= "helicopter";
			this.entity.p.t=0;
			this.entity.p.rafaga=0;
			this.entity.p.gravity=0;
			this.entity.size(true);
		},
		extend: {
			hit:function(damage) {
				Q.state.inc("score", 10);
				console.log(this.p.hp);
				this.p.hp-=damage;
				//console.log(this.p.hp);
				if(this.p.hp<=0){
					this.destroy();
					Q.stageScene("inicio");
				}
			},
			step:function(dt){
			
				this.p.t+=dt;
				
				if(this.p.disparando){
				
					if(c1<0)//delante
						this.p.vx=-50;
					else if(c1>0)//detras
						this.p.vx=50;	
					else
						this.p.vx=0;
						
					if(this.p.rafaga===4){
						this.p.rafaga=0;
						this.p.t=-3;
						this.p.disparando=false;
					}
					
					
				}
				else{
					if(this.p.t>0.5){
					console.log("comprueba");

					var player = Q("Player");
				
					x=this.p.x;
					
					player=player.first();
					c1=player.p.x-x;
					
					if(Math.abs(c1)<300 ){
						this.p.disparando=true;
					}
					this.p.t=0;
				}
				
				}
				
				if(this.p.rafaga===4){
							
							
						}
						else{
						
								
						
							console.log("dispara");
							b1=new Q.Bullet({x: this.p.x ,y: this.p.y+10,vx:0,vy:20})
							b1.add("enemyBullet");							
							this.stage.insert(b1);

							this.p.rafaga++;
							this.p.t=0;
						}
					else{

						if(Math.abs(c1)<300 ){
							this.p.disparando=true;
						}
						this.p.t=0;
					}
					
				}
			}
		}
	});*/
	

	//---------- POWER UP -----------//
	Q.Sprite.extend("PowerUp", {
		init: function(p) {
		    this._super(p,{	
		    	sheet:"h",	      	
		      	sensor: true,
				score:5,
				ammo:20,
		      	gravity: 0
		    });	   
		    this.on("sensor");
		},

		// When a Collectable is hit.
		sensor: function(touch) {
	    // Increment the score.

			if(touch.isA("Player")){
				this.p.sensor=false;
					
				if (this.p.score) {
					Q.state.inc("score", this.p.score);
					if(this.powerUp)
						this.powerUp();	
					this.destroy();

				}
				
			}
		},
	});

	Q.component('hPowerUp',{
		added: function() {
			this.entity.p.sheet="h";

		},
		extend: {
			powerUp: function(col){
				Q.state.inc("ammo", this.p.ammo);
				Q.state.set("arma","h");
				Q.audio.play('BulletH.mp3');

			}
		}
	});
	
	Q.component('bPowerUp',{
		added: function() {
			this.entity.p.sheet="b";
		},
		extend: {
			powerUp: function(col){
				Q.state.inc("bombs", this.p.ammo);
				Q.audio.play('Ammunition.mp3');
			}
		}
	});
	
	Q.component('vPowerUp',{
		added: function() {
			this.entity.p.sheet="v";
		},
		extend: {
			powerUp: function(col){
				Q.state.inc("lives", this.p.ammo);
				Q.audio.play('Ammunition.mp3');
			}
		}
	});
	
	Q.component('rPowerUp',{
		added: function() {
			this.entity.p.sheet="s";
		},
		extend: {
			powerUp: function(col){
				Q.state.inc("ammo", this.p.ammo);
				Q.state.set("arma","r");
				Q.audio.play('BulletR.mp3');


			}
		}
	});


	
	//------------- CARGA TMX ------------//
	Q.loadTMX("level1.tmx", function() {
		Q.load("bullet.png, bomb.png, enemyBullet.png, bulletH.png, bulletC.png, bulletR.png, walterMove.png, walter.json, walterD.png, walterD.json, soldier1.png, soldier.json, tank.png, soldierD.json, soldierD.png, start.png, powerup.json, ventajas.png, Mision1.mp3 , Mision2.mp3, Ammunition.mp3, BulletH.mp3, BulletR.mp3,start.mp3, finish.mp3, gameover.mp3, m1.mp3, m2.mp3, misil.mp3, explosion.mp3, cuchillo.mp3, pistola.mp3, pistola2.mp3, escopeta.mp3, metralleta.mp3, muerte1.mp3, muerte2.mp3, endgame.png,explosion.png,explosion.json,knife.json, knife.png, helicopter.json, helicopter.png", function(){
			
			Q.compileSheets("walterMove.png","walter.json");
			Q.compileSheets("walterFire.png","walterF.json");

			Q.sheet("bullet","bullet.png",{tilew:8,tileh:8});
			Q.sheet("bulletH","bulletH.png",{tilew:30,tileh:5});
			Q.sheet("bulletC","bulletC.png",{tilew:40,tileh:8});
			Q.sheet("bulletR","bulletR.png",{tilew:75,tileh:54});
			Q.sheet("enemyBullet","enemyBullet.png",{tilew:8,tileh:8});
			Q.sheet("bomb","bomb.png",{tilew:17,tileh:13});
			Q.compileSheets("explosion.png","explosion.json");
			Q.compileSheets("knife.png","knife.json");



			Q.compileSheets("soldier1.png","soldier.json");
			Q.compileSheets("soldierD.png","soldierD.json");
			Q.sheet("tank","tank.png",{tilew:72,tileh:96});
			Q.compileSheets("helicopter.png","helicopter.json");

			Q.compileSheets("ventajas.png","powerup.json");
			
			Q.stageScene("inicio");
		});
	});


	//------------- LEVEL 1 -------------//
	Q.scene("level1", function(stage){

		Q.stageTMX("level1.tmx", stage);

		//Inserto a Walter
		stage.insert( new Q.Player({x:100,y:0}) );

		//Centro la vista en Walter
		stage.add( "viewport").follow( Q("Player").first(),{ x: true, y: false } );
		
		stage.viewport.offsetY=55;	
		stage.viewport.offsetX=-200;	
		Q.stageScene('hud', 3);
		
		//Musica principal
		Q.audio.stop();
		//Q.audio.play('Mision1.mp3',{ loop: true} );
		//Q.audio.play('m1.mp3');

		//Inserto los enemigos
       /* var num_enemies = Math.floor(Math.random() * 10 + 30);
        var enemies = new Array(num_enemies);
            for (var i=0; i <= num_enemies; i++) {
                enemies.push(stage.insert(new Q.Enemy({
                    x: (Math.random() * (Q.width-120)) + 120,
                    y: -(Math.random() * 300) - (300*i),
                    vY: Math.random() * 75 + 100,
                    vx:100
                })));
            }*/
			
		e=new Q.Enemy({x:500,y:100,vx:100})
		e.add("defaultEnemy");
    	stage.insert( e );    

		e=new Q.Enemy({x:400,y:100,hp:1,vx:100})
		e.add("defaultEnemy");
    	stage.insert( e );  

		e=new Q.Enemy({x:1000,y:20,hp:100,hp:5})//2900
		e.add("helicopterEnemy");
		e.add("finalEnemy");
    	stage.insert( e );    		 		
	
		p1=new Q.PowerUp({x:800,y:136,ammo:5})
		p1.add("bPowerUp");
		stage.insert( p1 );
		
		p2=new Q.PowerUp({x:900,y:250})
		p2.add("hPowerUp");
		stage.insert( p2 );
		
		p3=new Q.PowerUp({x:1000,y:250,ammo:2})
		p3.add("vPowerUp");
		stage.insert( p3 );

		p4=new Q.PowerUp({x:50,y:250,ammo:222})
		p4.add("rPowerUp");
		stage.insert( p4 );
	});

	//------------- LEVEL 2 -------------//
	Q.scene("level2", function(stage){

		Q.stageTMX("level2.tmx", stage);

		//Inserto a Walter
		stage.insert( new Q.Player({x:100,y:0}) );

		//Centro la vista en Walter
		stage.add( "viewport").follow( Q("Player").first(),{ x: true, y: false } );
		
		stage.viewport.offsetY=55;	
		stage.viewport.offsetX=-200;	
		Q.stageScene('hud', 3);
		
		//Musica principal
		Q.audio.stop();
		//Q.audio.play('Mision1.mp3',{ loop: true} );
		//Q.audio.play('m1.mp3');

		//Inserto los enemigos
       /* var num_enemies = Math.floor(Math.random() * 10 + 30);
        var enemies = new Array(num_enemies);
            for (var i=0; i <= num_enemies; i++) {
                enemies.push(stage.insert(new Q.Enemy({
                    x: (Math.random() * (Q.width-120)) + 120,
                    y: -(Math.random() * 300) - (300*i),
                    vY: Math.random() * 75 + 100,
                    vx:100
                })));
            }*/
			
		e=new Q.Enemy({x:500,y:100,vx:100})
		e.add("defaultEnemy");
    	stage.insert( e );    

		e=new Q.Enemy({x:400,y:100,hp:1,vx:100})
		e.add("defaultEnemy");
    	stage.insert( e );  

		e=new Q.Enemy({x:1000,y:20,hp:100,hp:5})//2900
		e.add("helicopterEnemy");
		e.add("finalEnemy");
    	stage.insert( e );    		 		
	
		p1=new Q.PowerUp({x:800,y:136,ammo:5})
		p1.add("bPowerUp");
		stage.insert( p1 );
		
		p2=new Q.PowerUp({x:900,y:250})
		p2.add("hPowerUp");
		stage.insert( p2 );
		
		p3=new Q.PowerUp({x:1000,y:250,ammo:2})
		p3.add("vPowerUp");
		stage.insert( p3 );

		p4=new Q.PowerUp({x:50,y:250,ammo:222})
		p4.add("rPowerUp");
		stage.insert( p4 );
	});



	//------------ FIN JUEGO ----------------//
	Q.scene('endGame',function(stage) {
		var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"}));
		var button = container.insert(
			new Q.UI.Button({ x: 0, y: 0, asset:"endgame.png",scale:0.7})
		);
		button.on("click",function() {
			Q.clearStages();
			Q.stageScene('level1');
		});
		container.fit(20);
		Q.audio.stop();
		Q.audio.play('gameover.mp3');
	});


	//----------- PANTALLA INICIO ----------//
	Q.scene('inicio',function(stage) {
		var container = stage.insert(
			new Q.UI.Container({x: 0, y: 0, fill: "rgba(0,0,0,0.5)"})
		);
		var button = container.insert(
			new Q.UI.Button({ x: Q.width/2, y: 190, asset:"start.png" })
		);
	
		var button1 = container.insert(
			new Q.UI.Button({ x: Q.width/2-35, y: 270, fill: "#CCCCCC", scale:0.5, label: "Start Game" }))

		button.on("click",function() {
			Q.clearStages();
			Q.stageScene('level1');
		});

		var label = stage.insert(new Q.UI.Text({ 
	    	label: "Alvaro Isabel\n Ruben Garcia",
	    	color: "white",
	    	align: 'center',
	    	x: Q.width/2-35,
	    	y: 10,
	    	scale: 0.6
	    }));

		container.fit(20);
		Q.audio.stop();
		Q.audio.play('start.mp3',{ loop: true} );
	});


	//--------- HUD ---------//
	Q.scene('hud',function(stage) {
		
		Q.state.reset({ "score": 100, "lives":555, "bombs":10, "ammo":0});
	  	
	  	var container1 = stage.insert(
			new Q.UI.Container({fill: "gray",border: 2,shadow: 5,shadowColor: "rgba(0,0,0,0.2)", scale:0.6})
		);

		var container2= stage.insert(
			new Q.UI.Container({x:Q.width/2,fill: "gray",border: 2,shadow: 5,shadowColor: "rgba(0,0,0,0.2)", scale:0.5})
		);

		this.score = container1.insert(
			new Q.UI.Text(
				{x:150, y: 30, label: "Score: " + Q.state.get("score"), color: "White",align: 'center'}
			)
		);
		this.bombs = container2.insert(
			new Q.UI.Text(
				{x:-120, y: 30, label: "BOMB\n" + Q.state.get("bombs")}
			)
		);
		this.lives = container2.insert(
			new Q.UI.Text(
				{x:0, y: 40, label: "1 UP = "+ Q.state.get("lives"), color: "Yellow",scale:1.2}
			)
		);
		this.ammo = container2.insert(
			new Q.UI.Text(
				{x:120, y: 30, label: "ARMS\n" + Q.state.get("ammo")}
			)
		);
	
		
	  	container1.fit(10,10);
	  	container2.fit(10,10);



		
		Q.state.on("change.score",this,function(score) {
			this.score.p.label="Score: " + Q.state.get("score");
		});
		Q.state.on("change.lives",this,function(lives) {
			if(Q.state.get("lives")===0){
				Q.clearStages();
				Q.stageScene('endGame');
			}	
			this.lives.p.label="1 UP = "+ Q.state.get("lives");	
		});
		Q.state.on("change.bombs",this,function(bombs) {
			this.bombs.p.label="BOMB\n" + Q.state.get("bombs");	
		});
		Q.state.on("change.ammo",this,function(ammo) {
			this.ammo.p.label="AMMO\n" + Q.state.get("ammo");	
		});
	});

}

window.addEventListener('load', startGame);