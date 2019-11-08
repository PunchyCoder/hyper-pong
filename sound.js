
// SOUND FX
//-------------------------------------
const SoundFX = (function(){

let audioFormat;

function setFormat() {
	let audio = new Audio();
	if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
	} else {
		audioFormat = ".ogg";
	}
}

class SoundOverlapsClass {
	constructor(filenameWithPath) {
		this.path = filenameWithPath;
	}

	load() {
		setFormat();

		this.altSoundTurn = false;
		this.mainSound = new Audio(this.path + audioFormat);
		this.altSound = new Audio(this.path + audioFormat);
	}

	play() {
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

// Sound
	let sfx_title = new SoundOverlapsClass("./sounds/title");
	let sfx_return_hi = new SoundOverlapsClass("./sounds/return-hi");
	let sfx_return_low = new SoundOverlapsClass("./sounds/return-low");
	let sfx_boundary = new SoundOverlapsClass("./sounds/boundary");
	let sfx_score = new SoundOverlapsClass("./sounds/score");

	sfx_title.load();
	sfx_return_hi.load();
	sfx_return_low.load();
	sfx_boundary.load();
	sfx_score.load();

	return {
		createSound: function(path){ 
			return new SoundOverlapsClass(path) 
		},

		title: sfx_title,
		returnHi: sfx_return_hi,
		returnLow: sfx_return_low,
		boundary: sfx_boundary,
		score: sfx_score,
	}

})();













// 	// SOUND FX
// //-------------------------------------

// let audioFormat;

// function setFormat() {
// 	let audio = new Audio();
// 	if (audio.canPlayType("audio/mp3")) {
// 		audioFormat = ".mp3";
// 	} else {
// 		audioFormat = ".ogg";
// 	}
// }

// class SoundOverlapsClass {
// 	constructor(filenameWithPath) {
// 		this.path = filenameWithPath;
// 	}

// 	load() {
// 		setFormat();

// 		this.altSoundTurn = false;
// 		this.mainSound = new Audio(this.path + audioFormat);
// 		this.altSound = new Audio(this.path + audioFormat);
// 	}

// 	play() {
// 		if(this.altSoundTurn) {
// 			this.altSound.currentTime = 0;
// 			this.altSound.play();
// 		} else {
// 			this.mainSound.currentTime = 0;
// 			this.mainSound.play();
// 		}
// 		this.altSoundTurn = !this.altSoundTurn;
// 	}
// }

// // Sound
// 	let sfx_title = new SoundOverlapsClass("./sounds/title");
// 	let sfx_return_hi = new SoundOverlapsClass("./sounds/return-hi");
// 	let sfx_return_low = new SoundOverlapsClass("./sounds/return-low");
// 	let sfx_boundary = new SoundOverlapsClass("./sounds/boundary");
// 	let sfx_score = new SoundOverlapsClass("./sounds/score");

// 	sfx_title.load();
// 	sfx_return_hi.load();
// 	sfx_return_low.load();
// 	sfx_boundary.load();
// 	sfx_score.load();