/*
	sounds[i] = {
		name: "something",
		element: audioElement,
		played: boolean
	} 
*/

var soundDir = "music/",
	wavMusic = "POL-cave-story-short"
	wavStar = "star",
	wavPlacing = "placing",
	wavJump = "jump",
	wavEnemy = "",
	wavFailure = "failure",
	wavWin = "win",
	wavGameOver = "gameover";

var sounds = [];
var mute = false;

function playSound(sound, volume) {
	var sIndex = 0,
		sFound = false;

	if (!mute){
	if (sounds.length > 0) {
		while (!sFound && sIndex < sounds.length) {
			var s = sounds[sIndex];
			if ((s.element.ended || !s.played) && s.name == sound){
				sFound = true;
				s.element.volume = volume || 1;
				s.played = true;
			} else {
				sIndex++;
			}
		}
	}

	if (sFound) {
		console.log("sound found");
		sounds[sIndex].element.play();
	} else {
		console.log("sound not found; adding to sound's pool sounds");
		var newSound = document.createElement("audio");
		newSound.setAttribute("src", soundDir + sound + ".wav");
        newSound.setAttribute("type", "audio/wave");
		newSound.volume = volume || 1;
		newSound.play();

		sounds.push({name: sound, element: newSound, played:true});

	}
	}
}