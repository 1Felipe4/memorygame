var allNames = ["bear", "capuchin", "crocodile", "dolphin", "elephant", "giraffe", "gorilla", "lion", "macaw", "orca", "ostrich", "penguin", "zebra"]

function card(name, pos = null){
	this.name = name.charAt(0).toUpperCase() + name.toLowerCase().substring(1);
	this.img = document.createElement("img");;
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
		element.style.textAlign = "center";
	}

	this.render = function(){
		let element = this.element
		let img = this.img;
		if(this.flipped){
				img.style.opacity = "1.0";
		}else{
			img.style.opacity = "0";
		}

		if(this.selected){
			element.style.outline = "1px solid green";
		}else if(this.matched){
			element.style.outline = "1px solid gold";
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
		
		if(this.name == card.name){
			this.matched = true;
			card.matched = true;
			return true;
		}
		this.selected = false;
		card.selected = false;
		return false;
	}




}

function game(rows = 3, cols = 4){
	this.rows = rows;
	this.cols = cols;
	this.cards = [];
	this.cardsSelected = [];
	this.guesses = 0;
	this.matches = 0;
	this.timer = 0;
	this.maxMatches;
	this.scorebox = new scorebox(this);

	this.render = function (){
		for(let i = 0; i < this.rows; i++){
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				card.render();
			}
		}
		this.scorebox.render();

	}

	this.select = function(card){
		let message = "";



		if(!card.matched || !card.selected){
			this.cardsSelected.push(card);
			message += card.name + " Was Selected\n";
			card.selected = true;
			card.flipped = true;
		}

		if(this.cardsSelected.length == 2){
			this.guesses++;
			let c1 = this.cardsSelected[0];
			let c2 = this.cardsSelected[1];

			if(c1.testMatch(c2)){
				this.matches++;
			}
		}

		
		if(this.cardsSelected.length == 3){
			let c1 = this.cardsSelected[0];
			let c2 = this.cardsSelected[1];
			if(!c1.matched){
				c1.flipped = false;
			}
			if(!c2.matched){
				c2.flipped = false;
			}

			this.cardsSelected.shift();
			this.cardsSelected.shift();
		}

		this.render();
	
	} 

	this.init = function(){
		let names = [];
		let cardMax = function (grid){

			let i = grid.rows * grid.cols;

			while(i % 2 != 0){
				if(grid.rows > grid.cols){
					grid.rows--;
				}else{
					grid.cols--;
				}
				i = grid.rows * grid.cols;
			}

			return i;
		}
 


		this.cardMax = cardMax(this);
		this.maxMatches = this.cardMax/2;
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



		for (var i = names.length - 1; i >= 0; i--) {
			this.cards.push(new card(names[i]));
			this.cards.push(new card(names[i]));

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
	this.matches;
	this.guesses;
	this.timer;

	this.gamelist = document.createElement("div");
	this.fastest = document.createElement("div");
	this.leastGuesses = document.createElement("div");

	this.init = function (){
		let div = document.createElement("div");
		div.style.display = "grid";
		div.style.gridTemplateColumns=  "40% 70%";
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

	this.render = function(){
		let game = games[0];
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

} 


function scorebox(game){
	this.box = document.createElement("div");
	this.matches = document.createElement("h2");
	this.guesses = document.createElement("h2");
	this.timer = document.createElement("h3");
	this.game = game;

	this.init= function (){
		let matches = this.matches;
		let guesses = this.guesses;
		let timer = this.timer
		let box = this.box;
		let game = this.game;
		box.innerHTML = "";
		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";
		box.appendChild(guesses);
		box.appendChild(matches);
		box.appendChild(timer);
		};

	this.render	= function (){
		let matches = this.matches;
		let guesses = this.guesses;

		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";
	}
 this.init();

}




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
}














