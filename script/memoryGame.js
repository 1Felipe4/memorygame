var allNames = ["bear", "capuchin", "crocodile", "dolphin", "elephant", "giraffe", "gorilla", "lion", "macaw", "orca", "ostrich", "penguin", "zebra"]

function card(name, pos = null){
	this.name = name.charAt(0).toUpperCase() + name.toLowerCase().substring(1);
	this.img = document.createElement("img");
	this.state = "Turned Down";
	this.flipped = false;
	this.element = document.createElement("div");

	this.init = function(){
		let element = this.element
		element.setAttribute("class", "card");
		element.style.backgroundColor = "cyan";
		element.style.margin = "2px";
		element.style.padding = "5px";
		let img = this.img;
		img.setAttribute("src", "images/mystery.png");
				
		img.style.width = "80%";
		element.appendChild(img);	
		element.style.textAlign = "center";
		element.style.borderRadius = "1em";
		img.style.opacity = "1";

	
	
	}

	this.changeState = function (state){
		console.log(state)
		if(this.state != "Matched"){
			this.state = state;
		}

	}

	this.render = function(){
		let element = this.element
		let img = this.img;
		this.flipped = true;
	
		switch (this.state.toLowerCase()) {
			case "matched":
				element.style.outline = "3px solid green";
				break;
			case "selected":
				element.style.outline = "3px solid gold";
				break;
			case "bad select":
				element.style.outline = "3px solid red";
				break;		
			case "turned down":
				this.flipped = false;
				element.style.outline = "";
				break;	
		
			default:
				element.style.outline = "";
				console.log("switch failed")
				break;
		}

		if(this.flipped){
			img.setAttribute("src", "images/"+ name + ".png");
		}else{
			img.setAttribute("src", "images/mystery.png");
		}
	}


	this.pos = function(row = this.row, col = this.col){
		this.row = row;
		this.col = col;

		return this.row, this.col;
	}

	this.testMatch = function (card){
		if(this.name == card.name){
			this.matched = true;
			card.matched = true;

			
			return true;
		}
		
		return false;
	}




}

function game(gamemode = new gameMode("Easy", 2, 6)){
	this.cards = [];
	this.cardsSelected = [];
	this.guesses = 0;
	this.matches = 0;
	this.timer = 0;
	this.gamemode = gamemode;
	
	this.matchChain = false;
	this.maxMatches = gamemode.maxMatches;
	this.scorebox = new scorebox(this);
	this.state = "prematch";
	this.matchMultiplier = Math.max(gamemode.matchMultiplier, 2);
	this.currentTimeout

	this.render = function (){
		for(let i = 0; i < this.rows; i++){
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				card.render();
			}
		}
		this.scorebox.render();

	}

	this.clearSelection = function(){
		this.cardsSelected.forEach(card => {
			card.selected = false;
			card.changeState("Turned Down");
			card.render();
		});

		this.cardsSelected = [];

		this.render();
	
	}

	this.testMatchChain = function (cards){
		let first = cards.length-1;
		let name = cards[first].name
 

		for (let i = 0; i < cards.length; i++) {
			const card = cards[i];
			if(name!=card.name){
				this.guesses++;

				return false;
			}
		}

		
		
		return true;
	}

	this.select = function(card){
		console.log(card.name + " " + card.state);
		if(!this.matchChain){
			this.clearSelection();
		}
		
		let message = "";
		
		if(this.state == "prematch"){
			this.scorebox.startTimer();
			this.state = "started";
		}


		if(!(card.selected || card.matched)){
			clearTimeout(this.currentTimeout);

			this.cardsSelected.push(card);
			message += card.name + " Was Selected\n";
			card.selected = true;
			card.changeState("Selected");
			 this.currentTimeout = setTimeout(function(game){
				game.cardsSelected.forEach(card => {
					card.selected = false;
					card.changeState("Turned Down");
					card.render();
					console.log(card.name + " " + card.state);
				});
		
				game.cardsSelected = [];
		
				game.render();
			
			}, 5000, this);
			card.flipped = true;
			
		}

		this.matchChain = this.testMatchChain(this.cardsSelected);

		if(this.matchChain && (this.cardsSelected.length == this.matchMultiplier)){
			clearTimeout(this.currentTimeout);
			this.cardsSelected.forEach(card => {
				card.matched = true;
				card.changeState("Matched");
			});
			this.matches++;
			this.matchChain = false;
			this.currentTimeout = setTimeout(function(game){
				game.cardsSelected.forEach(card => {
					card.selected = false;
					card.changeState("Turned Down");

					
					card.render();
				});
		
				game.cardsSelected = [];
		
				game.render();
			
			}, 5000, this);

		}

		if(!this.matchChain){
			this.cardsSelected.forEach(card => {
				card.changeState("Bad Select");
				card.render();
			});
		}
	

		if(this.matches == this.maxMatches){
			this.scorebox.stopTimer();
			this.state = "won";
		}
		this.render();
		console.log(card.name + " " + card.state);
	} 

	

	this.init = function(){
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;
		this.rows = Math.min(matchMultiplier, maxMatches);
		this.cols = Math.max(matchMultiplier, maxMatches);
		let names = [];
		let cardMax = function (grid){

			let maxMax = allNames.length * grid.matchMultiplier;
			
			while(grid.rows*2 < grid.cols){
				grid.rows++;
				grid.cols--;
			}

			let i = grid.rows * grid.cols;


			while(i % grid.matchMultiplier != 0){
				if(grid.rows > grid.cols){
					if(i*2 < maxMax){
						grid.cols++;
					}else{
						grid.rows--;
					}
					
				}else{
					if(i*2 < maxMax){
						grid.rows++;
					}else{
						grid.cols--;
					}
				}
				i = grid.rows * grid.cols;
			}

			return i;
		}
 


		this.cardMax = cardMax(this);
		this.maxMatches = this.cardMax/this.matchMultiplier;
		while(names.length < this.maxMatches){
			let randPos = Math.floor(Math.random() * allNames.length);
			if(!names.includes(allNames[randPos])){
				names.push(allNames[randPos]);
			}

		}

		let table = function(rows){
			let t = [];
			for (var i = 0; i < rows; i++) {
			 t[i] = [];
			}
			return t;
		}



		for (let i = names.length - 1; i >= 0; i--) {
			for(let j = 0; j < this.matchMultiplier; j++){
				this.cards.push(new card(names[i]));
			}
			
			

		}

		this.table = table(this.rows);

		let setTable = function(grid){
			grid.cards = shuffle(grid.cards);
			for (let i = 0; i < grid.table.length; i++) {
				for (let j = 0; j < grid.cols; j++) {

					let rand = Math.floor(Math.random() *grid.cards.length);

					let card = grid.cards.pop();
					card.init();
					card.pos(i, j);
					grid.table[i].push(card);
					


				}	
			}

		}
		setTable(this);
		
		document.getElementById("game").innerHTML = "";
		let div = document.createElement("div");
		let header = document.createElement("h3");
		header.style.textAlign = "center"
		div.appendChild(header)
		header.innerHTML = this.gamemode.name;
		let section = document.createElement("section");
		section.style.display = "grid";
		let gridTemplateCol = "";
		let gridTemplateRows = "";
		for(let i = 0; i < this.rows; i++){
			gridTemplateCol = "";
			
			
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				gridTemplateCol += 100.00/ this.cols - 4 + "% ";
				card.render();
				card.element.addEventListener("click", () => this.select(card));
				section.appendChild(card.element);


			}
			this.scorebox.render();

			gridTemplateRows += 100.00/ this.rows - 4 + "% ";

			

			
		}


		section.style.gridTemplateColumns = gridTemplateCol;
		section.style.gridTemplateRows = gridTemplateRows;
		section.style.gridGap = "2%";

		div.appendChild(section);
		document.getElementById("game").appendChild(div)

	}

			// let scores = document.createElement("div");
			// let guesses = document.createElement("h2");
			// guesses.innerHTML = this.guesses;
			// scores.appendChild(guesses);
			// let timer = document.createElement("h2");
			// document.getElementById("rightSide").appendChild(scores);



	this.init();
	
	
	
}
function scoreboard(){
	this.games = [];
	this.matches = document.createElement("div");
	this.guesses = document.createElement("div");
	this.timer;

	this.gamelist = document.createElement("div");
	this.fastest = document.createElement("div");
	this.leastGuesses = document.createElement("div");

	this.init = function (){
		let div = document.createElement("div");
		div.style.margin = "10% 0";
		div.style.fontSize = ".8em";
		let header = document.createElement("h1");
		header.style.fontSize = ".8em";
		header.style.margin = "0 auto"
		header.style.gridArea = "header";
		header.innerHTML = "<u>Scoreboard</u>";
		header.style.padding = ".2em 0"
		let fastest = this.fastest;
		fastest.style.gridArea = "fastest";

		let leastGuesses = this.leastGuesses;
		leastGuesses.style.gridArea = "leastGuesses";

		let games = this.gamelist;
		games.style.gridArea = "games";

		div.appendChild(header);
		div.appendChild(games);
		div.appendChild(leastGuesses);
		div.appendChild(fastest);
		
		let right = document.getElementById("rightSide");
		right.innerHTML = "";
		right.appendChild(div); 

		

	}

	this.render = function(){
		let game = this.games[0];
		if(!game){
			return;
		}
		this.matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		this.guesses.innerHTML = game.guesses + " Guesses";
		}

	this.addGame = function (game){
		let games = this.games;
		games.push(game);
		let gamelist = this.gamelist;
		let score = game.scorebox;


		while(games.length> 10){
			games.pop();
		}
		let firstChild = gamelist.firstChild;

		if(firstChild){
			gamelist.insertBefore(score.box, firstChild);
		}else{
			gamelist.appendChild(score.box)
		}
		
		this.render();
	}

} 

function gameMode(name, matchMultiplier, maxMatches){
	this.name = name;
	this.matchMultiplier = matchMultiplier;
	this.maxMatches = maxMatches;

	this.equals = function(matchMultiplier, maxMatches){
		if(this.matchMultiplier == matchMultiplier && this.maxMatches == maxMatches){
			return true;
		}
		return false
	}
}

function gameSettingsBar(){
	this.mode = document.createElement("button");
	this.matchMultiplier = document.createElement("input");
	this.maxMatches = document.createElement("input");
	this.gameModes = [];
	this.modeI = 1;
	
	this.init = function (){
		this.gameModes["Easy"] = new gameMode("Easy", 2, 6);
		this.gameModes["Medium"] = new gameMode("Medium", 3, 6);
		this.gameModes["Tuff"] = new gameMode("Tuff", 4, 6);
		this.gameModes["Insane"] = new gameMode("Insane", 5, 6);
		this.gameModes["Custom"] = new gameMode("Custom", 2, 8);

		this.modeKeys = Object.keys(this.gameModes);

		let div = document.createElement("div");
		div.style.fontSize = ".8em"

		let mode = this.mode;
		let settings = this;
		mode.addEventListener("click", () => settings.nextMode())

		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;

		matchMultiplier.addEventListener("change", () => settings.changeMode())
		maxMatches.addEventListener("change", () => settings.changeMode())
		let maxMatchesLbl = document.createElement("label");
		maxMatchesLbl.innerHTML = "Matches to Win: ";
		maxMatchesLbl.style.gridArea = "maxMatchLbl";

		let matchMulLbl = document.createElement("label");
		matchMulLbl.innerHTML = "Cards per Match: ";
		matchMulLbl.style.gridArea = "matchMulLbl";


		maxMatches.setAttribute("type", "number");
		maxMatches.setAttribute("min", "2");
		maxMatches.style.gridArea = "maxMatchInput";



		matchMultiplier.setAttribute("type", "number");
		matchMultiplier.setAttribute("min", "2");
		matchMultiplier.style.gridArea = "matchMulInput";

		mode.style.gridArea = "modeBtn";

		let modeLbl = document.createElement("label");
		modeLbl.innerHTML = "Mode: ";
		modeLbl.style.gridArea = "modeLbl";

		let newGameBtn = document.createElement("button");
		newGameBtn.innerHTML = "New Game";


		newGameBtn.addEventListener("click", () => newGame(settings.gameModes[settings.modeKeys[settings.modeI]]));

		let header = document.createElement("h4");
		header.innerHTML = "Game Options";
		header.style.gridArea = "header";

		div.appendChild(header);
		div.appendChild(modeLbl);
		div.appendChild(mode);
		div.appendChild(maxMatchesLbl);
		div.appendChild(maxMatches);
		div.appendChild(matchMulLbl);
		div.appendChild(matchMultiplier);
		div.appendChild(newGameBtn);

		document.getElementById("settings").appendChild(div);
		this.render();

	}

	this.render = function (){
		
		let currMode = this.gameModes[this.modeKeys[this.modeI]];
		let modeBtn = this.mode;
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches; 

		modeBtn.innerHTML = currMode.name;
		matchMultiplier.value = currMode.matchMultiplier;
		maxMatches.value = currMode.maxMatches;



	}

	this.nextMode = function(){
		this.modeI++;
		if(this.modeI >= this.modeKeys.length){
			this.modeI = 0;
		}

		this.render();
	}

	this.changeMode = function(){
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;

		for (let i = 0; i < this.modeKeys.length; i++) {
			const key = this.modeKeys[i];
			if(this.gameModes[key].equals(matchMultiplier.value, maxMatches.value)){
				this.modeI = i;
				break;
			}
			this.modeI = i;

		}
		let key = this.modeKeys[this.modeI];
		if(key == "Custom"){
			this.gameModes[key].matchMultiplier = matchMultiplier.value;
			this.gameModes[key].maxMatches = maxMatches.value;
		}

		this.render();


	}



}

function scorebox(game){
	this.box = document.createElement("div");
	this.matches = document.createElement("h5");
	this.guesses = document.createElement("h5");
	this.matchMultiplier = document.createElement("h5");
	this.time = document.createElement("h6");
	this.timer = null;
	this.game = game;

	this.init= function (){
		let matches = this.matches;
		let guesses = this.guesses;

		let time = this.time;
		let box = this.box;
		let game = this.game;
		let matchMultiplier = this.matchMultiplier;
		let gamemode = document.createElement("h5");
		gamemode.innerHTML = "Game Mode: " + game.gamemode.name;
		box.style.border = "1px solid cyan";
		box.style.padding = "5px";
		box.innerHTML = "";
		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";
		matchMultiplier.innerHTML =  game.gamemode.matchMultiplier + " Cards per Match" ;
		this.time.innerHTML = 0 + " Seconds";

		box.appendChild(gamemode)
		box.appendChild(guesses);
		box.appendChild(matches);
		box.appendChild(matchMultiplier);
		box.appendChild(time);
		
		};

	this.render	= function (){
		let matches = this.matches;
		let guesses = this.guesses;

		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";
		
	}

	this.startTimer = function(){
		let start = new Date()
		this.timer = setInterval(function(start, time){ 
			let now = new Date().getTime();

			let secs =  (now - start) / 1000;
			secs = parseInt(secs)
			//let milli =  (now - start) % 1000;
			mins = parseInt(secs/60);
			secs%=60;
			if(secs<10){
				secs = "0"+secs;
			}
			time.innerHTML = mins +  ":" + secs;

		 }, 500, start.getTime(), this.time)
	}

	this.stopTimer = function(){
		clearInterval(this.timer);
	}




 this.init();

}



//Fisher Yates
function shuffle(arr){
	for (i = arr.length -1; i > 0; i--) {
		  j = Math.floor(Math.random() * i)
		  k = arr[i]
		  arr[i] = arr[j];
		  arr[j] = k;
		}

		return arr;
}

var sb = new scoreboard();
function newGame(gamemode = new gameMode("Easy", 2, 6)){
	var newG = new game(gamemode);
	
	sb.addGame(newG)
	return newG;
}


function init(){
	
	var gameSettings = new gameSettingsBar();
	sb.init();
	gameSettings.init();
	newGame();

}


	















