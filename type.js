var testStates = {
	RUNNING: 1,
	INACTIVE: 0
};

var highlightModes = {
	HIGHLIGHT_NORMAL: 0,
	HIGHLIGHT_WRONG: 1,
	CORRECT: 2,
	WRONG: 3
};

var keys = {
	A_KEY: 65,
	Z_KEY: 90,
	ESC: 27,
	BACK_SPACE: 8,
	SPACE_BAR: 32
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
	currChar: -1,
	userText: document.getElementById("fullText"),
	userInput: document.getElementById("userInput"),
	timerElement: document.getElementById("timer"),
	state: testStates.INACTIVE,
	t: 0,
	maxTime: 60,
	wordsGottenRight: 0,
	wordsGottenWrong: 0,
	wordsTotal: 0,
	updateTime: function(){
		if(this.maxTime <= 5){
			this.timerElement.style.color = "red";
		}
		this.timerElement.innerHTML = --this.maxTime < 10?"0:0"+this.maxTime:"0:"+ this.maxTime;
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

//pressed key is actually char, not the keycode
function textEntered(event){
	if(test.state != testStates.RUNNING){
		initTest();
	}
	if((event.keyCode >= keys.A_KEY && event.keyCode <= keys.Z_KEY)
	|| event.keyCode == keys.SPACE_BAR){
		let pressedKey = getInputChar();
		if((pressedKey > 'a' && pressedKey < 'z') || (pressedKey > 'A' && pressedKey < 'Z')){
			test.currChar++;
			processUserLetter(pressedKey);
		}
		//user finished typing the word
		else if(pressedKey == ' '){
			test.userInput.value = "";
			let currHighLight = getCurrWordHighLight(test.currWord);
			let futurePrevHighlight;
			if(currHighLight === highlightModes.HIGHLIGHT_WRONG){
				futurePrevHighlight = highlightModes.WRONG;
			}
			else{
				futurePrevHighlight = highlightModes.CORRECT;
			}
			changeWordHighLight(test.currWord,futurePrevHighlight);
			changeWordHighLight(test.currWord+1, highlightModes.HIGHLIGHT_NORMAL);
			test.currWord++;
			test.currChar = -1;
			if(isLineBreak()){
				scrollTextUp();
			}
		}
	}
	else if(event.keyCode == keys.BACK_SPACE){
			if(test.currChar>=0){
				test.currChar--;
				processUserLetter(test.userInput.value.charAt(test.userInput.value.length-1));

			}
		}


}

function processUserLetter(pressedKey){
	if(pressedKey !== words[test.currWord].charAt(test.currChar)){
		changeWordHighLight(test.currWord,highlightModes.HIGHLIGHT_WRONG);
	}
	else{
		changeWordHighLight(test.currWord, highlightModes.HIGHLIGHT_NORMAL);
	}
}

function scrollTextUp(){
	let currentOffset = parseInt(test.userText.style.top);
	currentOffset-=72; //fixed value for now
	test.userText.style.top = currentOffset + "px";
}

function isLineBreak(){
	let thisWordElementOffsets = document.getElementById(test.currWord-1).getBoundingClientRect();
	let nextWordElementOffsets = document.getElementById(test.currWord).getBoundingClientRect();
	if(nextWordElementOffsets.top > thisWordElementOffsets.top){
		return true;
	}
	return false;
}

function getInputChar(){
	let inputStr = test.userInput.value;
	return inputStr.charAt(inputStr.length-1);
}

function getCurrWordHighLight(i){
	let reqWordElement = document.getElementById(i);
	let _className = reqWordElement.className;
	if(_className.indexOf("Wrong") != -1){
		return highlightModes.HIGHLIGHT_WRONG;
	}
	else{
		return highlightModes.HIGHLIGHT_NORMAL;
	}
}

function changeWordHighLight(i, mode){
	let reqWordElement = document.getElementById(i);
	switch(mode){
		case highlightModes.HIGHLIGHT_WRONG:{
			reqWordElement.className = "highlightWrong";
			break;
		}
		case highlightModes.HIGHLIGHT_NORMAL:{
			reqWordElement.className = "highlight";
			break;
		}
		case highlightModes.WRONG:{
			reqWordElement.className = "wrong";
			break;
		}
		case highlightModes.CORRECT:{
			reqWordElement.className = "correct";
			break;
		}
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
