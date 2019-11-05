


function HyperPong() {
	
	"use strict";

	const canvas = document.getElementById("game-scene");
	const context = canvas.getContext("2d");
	const { width: w, height: h } = canvas;
	const tableBoundary_x = 5;
	const tableBoundary_y = 5;

	// Element selectors
	const el_score_p1 = document.getElementById("p1-score");
	const el_score_p2 = document.getElementById("p2-score");

	// Scores
	const winningScore = 10;
	let p1Score = 0;
	let p2Score = 0;

	// Player's Paddle X positions
	const p1_startingXPos = 20; 
	const p2_startingXPos = w-32;

	// Images
	const el_titleImg = document.getElementById("title");
	const el_paddleImg = document.getElementById("paddle");
	let title_x = -500;
	let title_speed = 20;


	// SOUND FX
	//////////////////////////////////
	let audioFormat;

	function setFormat() {
		let audio = new Audio();
		if (audio.canPlayType("audio/mp3")) {
			audioFormat = ".mp3";
		} else {
			audioFormat = ".ogg";
		}
	}

	function SoundOverlapsClass() {
		this.load = function(filenameWithPath) {
			setFormat();

			this.altSoundTurn = false;
			this.mainSound = new Audio(filenameWithPath + audioFormat);
			this.altSound = new Audio(filenameWithPath + audioFormat);
		}

		this.play = function() {
			if(this.altSoundTurn) {
				this.altSound.currentTime = 0;
				this.altSound.play();
			} else {
				this.mainSound.currentTime = 0;
				this.mainSound.play();
			}
			this.altSoundTurn = !this.altSoundTurn;
		}
	}

	let sfx_title = new SoundOverlapsClass();
	let sfx_return_hi = new SoundOverlapsClass();
	let sfx_return_low = new SoundOverlapsClass();
	let sfx_boundary = new SoundOverlapsClass();
	let sfx_score = new SoundOverlapsClass();

	sfx_title.load("./sounds/title");
	sfx_return_hi.load("./sounds/return-hi");
	sfx_return_low.load("./sounds/return-low");
	sfx_boundary.load("./sounds/boundary");
	sfx_score.load("./sounds/score");



	// GAME STATE
	let game_state = "MENU";
	let playerMode = "1P"



	// Ball to Paddle collisions
	let ballReturnCounter = 0;

	// function preloader() {
	// 	// complete ( image.complete = true/false )
	// 	// src (image.src = 'url')
	// }

	//////////////////////////////////////
	// Player Paddle constructor
	//////////////////////////////////////
	let PlayerPaddle = function(name, x, color) {
		this.buffer = 9;
		this.name = name;
		this.xPosition = x;
		this.yPosition = canvas.height/2;
		this.width = 12;
		this.length = 70;
		this.color = color;
		this.speed = 9;
		this.score = 0;
		
	};

	//////////////////////////////////////
	// Player Instances
	//////////////////////////////////////
	let player_1 = new PlayerPaddle( "Player 1", p1_startingXPos, "white");
	let player_2 = new PlayerPaddle( "Player 2", p2_startingXPos, "white");

	//////////////////////////////////////
	// Ball object 
	//////////////////////////////////////
	let ball = {
		xPosition: 100,
		yPosition: 50,
		radius: 10,
		speedBase: 7,
		xSpeed: 7,
		ySpeed: 3,
		color: "white",			
	}

	//////////////////////////////////////
	// Key Controls and Events 
	//////////////////////////////////////
	let keyControls = {
		keys: {
			37: false,
			38: false,
			39: false,
			40: false,
			68: false, // A left
			87: false, // W up
			68: false, // D right
			83: false //  S down
		}				
	};

	// Key Events
	////////////////////////
	function handleEvents() {
		document.addEventListener("keydown", (e) => {
			e.preventDefault;
			keyControls.keys[e.which] = true;
		})
		document.addEventListener("keyup", (e) => {
			e.preventDefault;
			keyControls.keys[e.which] = false;
		})
		// Controlling State with Enter key!
		document.addEventListener("keypress", (e) => {

			if (e.which === 13 || e.which === 32) {
				if 		(game_state === "PLAY") 	{ game_state = "PAUSE";}
				else if (game_state === "PAUSE") 	{ game_state = "PLAY"; }
				else if (game_state === "MENU") 	{ game_state = "PLAY"; }
				else if (game_state === "SCORE") 	{ game_state = "PLAY"; }
				else if (game_state === "WIN" || game_state === "LOSE") 	{ game_state = "MENU"; }
			}
		})
	};

	// Execute Events
	//////////////////////
	handleEvents();

	//////////////////////////////////////
	// Ball functions
	//////////////////////////////////////
	function moveBall() {
		ball.xPosition += ball.xSpeed;
		ball.yPosition += ball.ySpeed;
	}

	function adjustBallSpeed(adjustment) {
		if (adjustment === "RESET") {
			ball.xSpeed = ball.speedBase;
		}
		 else if (ballReturnCounter % 4 === 0) {
			if (ball.xSpeed > 0) { ball.xSpeed++ }
			else { ball.xSpeed-- } 
			// console.log("ball speed increase");
		}
	}



	//////////////////////////////////////
	// Paddle functions
	//////////////////////////////////////
	function move_P1_Paddle() {
		if (keyControls.keys['38'] === true) {
			player_1.yPosition -= player_1.speed;
		}
		if (keyControls.keys['40'] === true) {
			player_1.yPosition += player_1.speed;
		}
	}

	function move_P2_Paddle() {
		if (keyControls.keys['87'] === true) {
			player_2.yPosition -= player_2.speed;
		}
		if (keyControls.keys['83'] === true) {
			player_2.yPosition += player_2.speed;
		}
	}

	function computer_moves() {
		let generated_position = random_position();

		if (generated_position < ball.yPosition) {
			player_2.yPosition += (player_2.speed-3);
		} else if (generated_position > ball.yPosition) {
			player_2.yPosition -= (player_2.speed-3);
		} else {};
	}

	function random_position() {
		return (player_2.yPosition-35)+(Math.floor(Math.random()*140)+1);
	}



	//////////////////////////////////////
	// Score functions
	//////////////////////////////////////
	function updateScoreBoard(){
		el_score_p1.textContent = p1Score;
		el_score_p2.textContent = p2Score;
	}

	function resetScores() {
		p1Score = 0;
		p2Score = 0;
	}

	function keepScore(whichPlayerScores) {
			// stop 
			ball.xSpeed = ball.speedBase;
			ball.ySpeed = ball.speedBase; 
			// increase Score
			//whichPlayerScores.score++;
			if (whichPlayerScores === player_1) {
				p1Score++
			}
			else { p2Score++ }
			console.log(whichPlayerScores, "player_1:", p1Score, "player_2:", p2Score)
			// Change state => SCORE
			game_state = "SCORE";
			// Setup ball
			// Player serves
			ball.xPosition = canvas.width/2;
			ball.yPosition = h/2;

			if (whichPlayerScores === player_1) {
				ball.xSpeed = -ball.speedBase;
				ball.ySpeed = 0;
			} else {
				ball.xSpeed = ball.speedBase;
				ball.ySpeed = 0;
			}
		updateScoreBoard();
	}



	//////////////////////////////////////
	// Collision functions
	//////////////////////////////////////
	function findAngleDeflection(paddleYPos, paddleLength){
		var deltaY = ball.yPosition - (paddleYPos + paddleLength/2);
		ball.ySpeed = deltaY * 0.25;
	}

	function handleCollision_Boundaries() {
		// Checks for Y-axis boundary collision
		// canvas.width = tableBoundary_y

		//ball.ySpeed = ball.yPosition >= h-tableBoundary_y || ball.yPosition  <= tableBoundary_y  ?  ball.ySpeed *=-1  :  ball.ySpeed;

		if (ball.yPosition <= 5 || ball.yPosition >= h-5) {
			ball.ySpeed *= -1;
			sfx_boundary.play();
		} 

		if(ball.xPosition <= 0) {
			//ball.xSpeed = -ball.xSpeed;
			sfx_score.play(); 
			keepScore(player_2);
		}
		if(ball.xPosition >= w) {
			//ball.xSpeed = -ball.xSpeed;
			sfx_score.play();
			keepScore(player_1);
		}
	}

	function handleCollision_Paddle_to_Ball() {
		// Checks for Paddle collision

		if (ball.xPosition <= (player_1.xPosition + player_1.width + player_1.buffer) &&
			ball.yPosition >= player_1.yPosition &&
			ball.yPosition <= (player_1.yPosition + player_1.length)) 
		{	
			sfx_return_low.play();
			ballReturnCounter++;
			adjustBallSpeed();
			ball.xSpeed = -ball.xSpeed;
			findAngleDeflection(player_1.yPosition, player_1.length);
			console.log("HITS:", ballReturnCounter, "| SPEED:", ball.xSpeed)
		}
		
		if (ball.xPosition >= player_2.xPosition &&
			ball.yPosition >= player_2.yPosition &&
			ball.yPosition <= (player_2.yPosition + player_2.length)) 
		{	
			sfx_return_hi.play();
			ballReturnCounter++;
			adjustBallSpeed();
			ball.xSpeed = -ball.xSpeed;
			findAngleDeflection(player_2.yPosition, player_2.length);
			console.log("HITS:", ballReturnCounter, "| SPEED:", ball.xSpeed)		
		}
	} // End function


	//////////////////////////////////////
	// draw functions
	//////////////////////////////////////
	function drawScreen(color) {
		context.fillStyle = color;
		context.fillRect(0, 0, w, h);
	}

	function drawBall() {
		context.beginPath();
		context.arc(ball.xPosition, ball.yPosition, ball.radius, 0, Math.PI *2);
		context.fillStyle = ball.color;
		context.fill();
	}

	function drawPaddle(whichPlayer) {
		context.fillStyle = whichPlayer.color;
		context.drawImage(el_paddleImg, whichPlayer.xPosition, whichPlayer.yPosition)
	}

	function writeText(text, size, xPos, yPos, intLineNum) {
		if (!intLineNum) { intLineNum = 1 } 
		const lineSpace = (intLineNum+1) * size + yPos;
		context.fillStyle = "limegreen";
		context.font = size+"px Arial";
		context.textAlign = "center";
		context.fillText(text, xPos, lineSpace); // canvas.w/2, 50
	}

	//////////////////////////////////////
	// onSTATE functions
	//////////////////////////////////////	
	// on PAUSE STATE
	//*******************************
	function onPause() {

		this.draw = function() {
			drawScreen("rgba(0, 0, 0, 0.5)");
			drawPaddle(player_1);
			drawPaddle(player_2);
			drawBall();
			drawScreen("rgba(100, 0, 100, 0.6)");
			writeText("P A U S E", 40, 450, 100, 1);
			writeText("P A U S E", 40, 450, 100, 2);
			writeText("P A U S E", 40, 450, 100, 3);
		}
	}

	const event_Pause = new onPause();

	// on PLAY STATE
	//*******************************
	function onPlay() {

		this.update = function() {
			if ( playerMode === "1P") {
				moveBall();
				move_P1_Paddle();
				//move_P2_Paddle();
				computer_moves();
			} else {
				moveBall();
				move_P1_Paddle();
				move_P2_Paddle();
				//computer_moves();
			}
			
			
		};

		this.draw = function() {
			drawScreen("rgba(0, 0, 0, 0.5)");
			drawPaddle(player_1);
			drawPaddle(player_2);
			drawBall();
		};
	}

	const event_Play = new onPlay();

	// on MENU STATE
	//*******************************
	 function onMenu() {

	 	this.update = function() {
	 		if (title_x <= 150) {
	 			title_x += title_speed;
	 		}
	 		if (title_x === 0) {
	 			sfx_title.play();
	 		}
	 	}

		this.draw = function() {
			drawScreen("black");
			context.drawImage(el_titleImg, title_x, 0)
			//writeText("H y p e r  P o n g", 40, 450, 100);
			writeText("press  [space]  to play, Cowboy", 20, 450, 300);
		}		
	}

	const event_Menu = new onMenu();

	// on SCORE STATE
	//*******************************
	function onScore () {

		this.update = function() {
			if ( p1Score === winningScore) {
				ball.xPosition = canvas.width/2;
				ball.yPosition = canvas.height/2;
				game_state = "WIN";
			} else if ( p2Score === winningScore) {
				ball.xPosition = canvas.width/2;
				ball.yPosition = canvas.height/2;
				game_state = "LOSE";
			} else {
				let scoreText = p1Score+" : "+p2Score;
				adjustBallSpeed("RESET");
				ballReturnCounter = 0;
			}
		};
			
		this.draw = function() {
			let scoreText = p1Score+" : "+p2Score;
			drawScreen("black");
			writeText("Scoooore!!", 40, 450, 100);
			writeText("     "+player_1.name+"     "+player_2.name, 20, 450, 100, 4.5)
			writeText( scoreText, 40, 450, 100, 3);
			writeText("press  [space]  to continue", 20, 450, 300);
		};
	}

	const event_Score = new onScore();

	// on WIN STATE
	//*******************************
	function onWin() {

		this.draw = function() {
			drawScreen("black");
			writeText("Yeeeet!", 40, 450, 100);
			writeText("press  [Enter]  to play again", 20, 450, 300);
			resetScores();
			adjustBallSpeed("RESET");
			updateScoreBoard();
		};
	}

	const event_Win = new onWin();

	// on LOSE STATE
	//*******************************
	function onLose() {

		this.draw = function() {
			drawScreen("black");
			writeText("G a m e  O v e r", 40, 450, 100);
			writeText("press  [Enter]  to play again", 20, 450, 300);
			resetScores();
			updateScoreBoard();
		};
	}

	const event_Lose = new onLose();

	//////////////////////////////////////
	// core loop functions
	//////////////////////////////////////
	function UPDATE() {
		if (game_state === "MENU") 	{ event_Menu.update();  }
		if (game_state === "PLAY") 	{ event_Play.update();  }
	//	if (game_state === "PAUSE") { event_Pause(); }
		if (game_state === "SCORE")	{ event_Score.update(); }
	//	if (game_state === "WIN")	{ event_Win();   }
	//	if (game_state === "LOSE")	{ event_Lose();  }
	}
	
	
	function handle_Collision(){
		handleCollision_Boundaries();
		handleCollision_Paddle_to_Ball();
	}
	

	function DRAW(){
		if (game_state === "MENU") 	{ event_Menu.draw();  }
		if (game_state === "PLAY") 	{ event_Play.draw();  }
		if (game_state === "PAUSE") { event_Pause.draw(); }
		if (game_state === "SCORE")	{ event_Score.draw(); }
		if (game_state === "WIN")	{ event_Win.draw();   }
		if (game_state === "LOSE")	{ event_Lose.draw();  }
	}


	// Game Loop
	//*********************************
	function GAMELOOP(t) {
		// Game logic code..
		handle_Collision();
		UPDATE();
		DRAW();
		

		// Loop Again...
		requestAnimationFrame(GAMELOOP);
	}
	requestAnimationFrame(GAMELOOP);


// End of the Game
}

const execute = function(){ 

	const btn = document.getElementById("btn");
	btn.classList.add("hide");

	HyperPong(); 
}

