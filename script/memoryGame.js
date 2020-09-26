var allNames = ["bear", "capuchin", "crocodile", "dolphin", "elephant", "giraffe", "gorilla", "lion", "macaw", "orca", "ostrich", "penguin", "zebra"]

function card(name, pos = null){
	this.name = name.charAt(0).toUpperCase() + name.toLowerCase().substring(1);
	this.img = document.createElement("img");
	this.state = "Turned Down";
	this.flipped = false;
	this.matched = false;
	this.selected = false;
	this.element = document.createElement("div");
	this.init = function(){
		let element = this.element
		element.setAttribute("class", "card");
		element.style.backgroundColor = "cyan";
		element.style.margin = "2px";
		element.style.padding = "5px";
		let img = this.img;
		img.setAttribute("src", "images/"+ name + ".png");
				
		img.style.width = "80%";
		element.appendChild(img);	
		element.style.textAlign = "ce nter";
	}

	this.render = function(){
		let element = this.element
		let img = this.img;
		console.log(this.matched + " " + this.selected);
		if((this.matched || this.selected)){
			this.flipped = true;
		}else{
			this.flipped = false;
		}

		if(this.flipped){
				img.style.opacity = "1.0";
		}else{
			img.style.opacity = "0";
		}

		if(this.matched){
			element.style.outline = "3px solid green";
		}else if(this.selected){
			element.style.outline = "3px solid gold";
		}else{
			element.style.outline = "";
		}




	}


	this.pos = function(row = this.row, col = this.col){
		this.row = row;
		this.col = col;

		return this.row, this.col;
	}

	this.testMatch = function (card){
		// this.selected = false;
		// card.selected = false;
		if(this.name == card.name){
			this.matched = true;
			card.matched = true;
			
			return true;
		}
		
		return false;
	}




}

function game(matchMultiplier = 4, maxMatches = 6){
	this.cards = [];
	this.cardsSelected = [];
	this.guesses = 0;
	this.matches = 0;
	this.timer = 0;
	
	this.matchChain = false;
	this.maxMatches = maxMatches;
	this.scorebox = new scorebox(this);
	this.state = "prematch";
	this.matchMultiplier = Math.max(matchMultiplier, 2);
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
				console.log(card.name);
				this.guesses++;

				return false;
			}
		}

		
		
		return true;
	}

	this.select = function(card){
		if(!this.matchChain){
			this.clearSelection();
		}
		clearTimeout(this.currentTimeout);
		let message = "";
		
		if(this.state == "prematch"){
			this.scorebox.startTimer();
			this.state = "started";
		}


		if(!(card.selected || card.matched)){
			this.cardsSelected.push(card);
			message += card.name + " Was Selected\n";
			card.selected = true;
			console.log(this.cardsSelected);
			 this.currentTimeout = setTimeout(function(game){
				game.cardsSelected.forEach(card => {
					card.selected = false;
					card.render();
				});
		
				game.cardsSelected = [];
		
				game.render();
			
			}, 5000, this);
			console.log(this.cardsSelected);
			card.flipped = true;
		}

		this.matchChain = this.testMatchChain(this.cardsSelected);

		console.log(this.matchChain);
		if(this.matchChain && (this.cardsSelected.length == this.matchMultiplier)){
			this.cardsSelected.forEach(card => {
				card.matched = true;
			});
			this.matches++;
			this.matchChain = false;
			this.currentTimeout = setTimeout(function(game){
				game.cardsSelected.forEach(card => {
					card.selected = false;
					card.render();
				});
		
				game.cardsSelected = [];
		
				game.render();
			
			}, 5000, this);

		}

		
		// if(this.cardsSelected.length == 3){
		// 	let c1 = this.cardsSelected[0];
		// 	let c2 = this.cardsSelected[1];
		// 	if(!c1.matched){
		// 		c1.selected = false;
		// 	}
		// 	if(!c2.matched){
		// 		c2.selected = false;
		// 	}

		// 	this.cardsSelected.shift();
		// 	this.cardsSelected.shift();
		// }

		if(this.matches == this.maxMatches){
			this.scorebox.stopTimer();
			this.state = "won";
		}
		this.render();
	
	} 

	

	this.init = function(){
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;
		this.rows = Math.min(matchMultiplier, maxMatches);
		this.cols = Math.max(matchMultiplier, maxMatches);
		let names = [];
		let cardMax = function (grid){

			let maxMax = allNames.length * grid.matchMultiplier;
			let i = grid.rows * grid.cols;


			while(i % grid.matchMultiplier != 0){
				//console.log(grid.rows + " " + grid.)
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
		console.log(this.maxMatches);
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
		for(let i = 0; i < this.rows; i++){
			let section = document.createElement("section");
			section.style.display = "grid";
			let gridTemplate = "";
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				gridTemplate += 100.00/ this.cols + "% ";
				card.render();
				card.element.addEventListener("click", () => this.select(card));
				section.appendChild(card.element);


			}
			this.scorebox.render();



			

			section.style.gridTemplateColumns = gridTemplate;
			document.getElementById("game").appendChild(section);
		}



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
		div.style.display = "grid";
		div.style.gridTemplateColumns=  "50% 50%";
		div.style.gridTemplatRows = "auto 40% 40%";
		div.style.gridTemplateAreas = '"header header" "games leastGuesses"  "games fastest"';


		let header = document.createElement("h1");
		header.style.margin = "0 auto"
		header.style.gridArea = "header";
		header.innerHTML = "<u>Scoreboard</u>";

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
		console.log(firstChild);
		if(firstChild){
			gamelist.insertBefore(score.box, firstChild);
		}else{
			gamelist.appendChild(score.box)
		}
		
		this.render();
	}

} 

function gameSettingsBar(){
	this.button = document.createElement("button");
	this.matchMultiplier = document.createElement("input");
	this.matchMax = document.createElement("input");
	
	this.init = function (){
		
	}

}

function scorebox(game){
	this.box = document.createElement("div");
	this.matches = document.createElement("h5");
	this.guesses = document.createElement("h5");
	this.time = document.createElement("h6");
	this.timer = null;
	this.game = game;

	this.init= function (){
		let matches = this.matches;
		let guesses = this.guesses;
		let time = this.time;
		let box = this.box;
		let game = this.game;
		box.style.border = "1px solid cyan";
		box.style.padding = "5px";
		box.innerHTML = "";
		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";
		this.time.innerHTML = 0 + " Seconds";
		box.appendChild(guesses);
		box.appendChild(matches);
		box.appendChild(time);
		};

	this.render	= function (){
		let matches = this.matches;
		let guesses = this.guesses;
		console.log("Guesses " + game.guesses);
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
			time.innerHTML = secs + " Seconds";

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
	sb.init();


function newGame(){
	var newG = new game();
	
	sb.addGame(newG)
	return newG;
}














