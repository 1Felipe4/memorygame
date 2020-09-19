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
		let img = this.img;
		img.setAttribute("src", "images/"+ name + ".png");
				
		img.style.width = "80%";
		element.appendChild(img);
		console.log(element);	
		element.style.textAlign = "center";
	}

	this.render = function(){
		let element = this.element
		let img = this.img;
		console.log(this.name + "rendered");
		if(this.flipped){
				img.style.opacity = "1.0";
		}else{
			img.style.opacity = "0";
		}

		if(this.selected){
			element.style.outline = "1px solid green";
		}else{
			element.style.outline = "";
		}

		if(this.matched){
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

function gameGrid(rows = 3, cols = 4){
	this.rows = rows;
	this.cols = cols;
	this.cards = [];
	this.cardsSelected = [];
	
	

	this.render = function (){
		for(let i = 0; i < this.rows; i++){
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				card.render();
			}
		}
	}

	this.select = function(card){
		let message = "";

		if(!card.matched && !card.selected){
			this.cardsSelected.push(card);
			message += card.name + " Was Selected\n";
			card.selected = true;
			card.flipped = true;
		}

		if(this.cardsSelected.length == 2){
			let c1 = this.cardsSelected[0];
			let c2 = this.cardsSelected[1];
			if(c1.testMatch(c2)){
				alert("Match");
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
		console.log(message);
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

			console.log(i)
			return i;
		}



		console.log(cardMax(this))
		this.cardMax = cardMax(this);
		while(names.length < this.cardMax/2){
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
					
					console.log(grid.table[i]);


					let rand = Math.floor(Math.random() *grid.cards.length);
					console.log(i + " " + j + " " + rand);
					let card = grid.cards.pop();
					card.init();
					card.pos(i, j);
					grid.table[i].push(card);
					


				}	
			}

		}
		setTable(this);
		// console.log(this.cards);
		// console.log(this.table);
		
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
			section.style.gridTemplateColumns = gridTemplate;
			document.getElementById("game").appendChild(section);
		}
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

var currGrid;