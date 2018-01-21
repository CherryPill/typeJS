var testStates = {
	RUNNING: 1,
	INACTIVE: 0
};

var highlightModes = {
	HIGHLIGHT_NORMAL: 0,
	HIGHLIGHT_WRONG: 1,
};

var keys = {
	LOWER_A: 65,
	LOWER_Z: 90,
	ESC: 32
};

var words = ["I", "snuck", "down", "there", "evenings", "he", "worked", "at", "the", "sawmill",
"to", "the", "lath", "and", "concrete", "room", "where", "he", "gutted", "perch",
"tossing", "tails", "to", "the", "cat", "a", "galaxy", "of", "scales", "glistened",
 "on", "the", "tabletop", "and", "specks", "of", "blood", "But", "the",
 "floor", "was", "smooth", "well-suited", "for", "skating", "I", "was",
 "the", "girl", "in", "the", "song", "and", "the", "room", "rows", "of",
 "rods", "and", "reels", "waders", "nets", "and", "transformed", "as",
 "I", "dreamt", "of", "getting", "out,", "no", "longer", "destined", "to", "pass",
 "every", "weekend", "on", "some", "Idaho", "lake", "dropping", "fish", "into", "a",
 "bucket", "for", "my", "father", "to", "clean", "going", "nowhere"];

var test = {
	currWord: 0,
	currChar: 0,
	userText: document.getElementById("fullText"),
	userInput: document.getElementById("userInput"),
	timerElement: document.getElementById("timer"),
	state: testStates.INACTIVE,
	t: 0,
	maxTime: 10,
	wordsGottenRight: 0,
	wordsGottenWrong: 0,
	wordsTotal: 0,
	updateTime: function(){
		if(this.maxTime <= 5){
			this.timerElement.style.color = "red";
		}
		this.timerElement.innerHTML = "0:"+ --this.maxTime;
		if(this.maxTime <= 0){
			restartTest();
		}
	},
	stopTime: function(){
		clearTimeout(this.t);
	},
	restart: function(){
		this.timerElement.innerHTML = "1:00";
		this.wordsGottenRight = 0;
		this.wordsGottenWrong = 0;
		this.wordsTotal = 0;
		this.state = testStates.INACTIVE;
	}
};

function restartTest(){
	if(test.state != testStates.INACTIVE){
		test.stopTime();
		test.restart();
		test.timerElement.style.color = "black";
	}
}

function keyPress(event){
	if(test.state != testStates.RUNNING){
		initTest();
	}
		let pressedKey = event.keyCode;
		//get last input char from input tag
		if(pressedKey > keys.LOWER_A && pressedKey < keys.LOWER_Z){
			if(String.fromCharCode(event.which) !== words[test.currWord].charAt(test.currChar)){
				changeWordHighLight(test.currWord,highlightModes.HIGHLIGHT_WRONG);
			}
		}
		else if(pressedKey == 32){
			test.userInput.value = "";
			test.currWord++;
			changeWordHighLight(test.currWord,highlightModes.HIGHLIGHT_NORMAL);
		}

}

function changeWordHighLight(i, mode){
	let reqWordElement = document.getElementById(i);
	if(mode == highlightModes.HIGHLIGHT_WRONG){
		reqWordElement.class = "highlightWrong";
	}
	else{
		reqWordElement.class = "highlight";
	}
}

function initTest(){
	test.state = testStates.RUNNING;
	test.updateTime();
	test.t = setTimeout(function(){initTest()},1000);
}
function prepText(){
	let textLen = words.length;
	for(x=0;x<textLen;x++){
		let word = document.createElement("span");
		word.innerHTML = words[x];
		word.id = x;
		if(!x){
			word.className = "highlight";
		}
		test.userText.appendChild(word);
	}

}
