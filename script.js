function player(mark,name){
    let playerMark = mark;
    return {name, playerMark}
}

function Game(playersNames,ui,ai){    
    let gameBoard = [];
    let initializeBoard = function(){
        for(let i=0;i<9;i++){
            gameBoard[i]=null;
        }
    }
    initializeBoard();
    let players = [player('O',playersNames[0]),player('X', playersNames[1])]
    let currentPlayer = players[0];
    if(ai && players[0].name === "Computer"){
        addMark(ai.play(gameBoard));
    }

    function changePlayer(){
        if(currentPlayer === players[0]){
            currentPlayer = players[1]
        }
        else{
            currentPlayer = players[0]
        }
        if(ai && currentPlayer.name === 'Computer'){
            addMark(ai.play(gameBoard));
        }
    }
    function addMark (gameField){        
        if(ui.displayMark(gameField,currentPlayer.playerMark)){
            gameBoard[gameField.id] = currentPlayer.playerMark;
            checkForWin();
            changePlayer();
        }
    }
    function checkForWin(){
        if( 
            (gameBoard[0] !== null && gameBoard[0] === gameBoard[1] && gameBoard[1] === gameBoard[2])||
            (gameBoard[3] !== null && gameBoard[3] === gameBoard[4] && gameBoard[4] === gameBoard[5])||
            (gameBoard[6] !== null && gameBoard[6] === gameBoard[7] && gameBoard[7] === gameBoard[8])||
            (gameBoard[0] !== null && gameBoard[0] === gameBoard[3] && gameBoard[3] === gameBoard[6])||
            (gameBoard[1] !== null && gameBoard[1] === gameBoard[4] && gameBoard[4] === gameBoard[7])||
            (gameBoard[2] !== null && gameBoard[2] === gameBoard[5] && gameBoard[5] === gameBoard[8])||
            (gameBoard[0] !== null && gameBoard[0] === gameBoard[4] && gameBoard[4] === gameBoard[8])||
            (gameBoard[2] !== null && gameBoard[2] === gameBoard[4] && gameBoard[4] === gameBoard[6])
            ){
                triggerWin(currentPlayer);
            }
            if(!gameBoard.includes(null)){
                triggerDraw();
            }
    }

    function triggerWin(currentPlayer){
        initializeBoard();
        ui.win(currentPlayer); 
    }
    function triggerDraw(){
        initializeBoard();
        ui.draw();        
    }
     
    return {gameBoard, players, currentPlayer, changePlayer, checkForWin, addMark}
}

function Ui(){
    let ui = document.querySelector('.board');
    let game;
    const setGame = function (gameObject) { //linking to game object, so i can use it's functions
        game = gameObject;
    };
    let nameFields = [...document.querySelectorAll('.name')].forEach((item)=>{item.value = ""})

    const displayMark = function (field,mark){
        if(field.innerHTML === ""){
            field.innerHTML = mark;
            return true
        }
        return false;
    }

    const initializeBoard = function(){

        ui.classList.add("board-active");
        ui.replaceChildren();
            for(let i=0;i<9;i++){
                const gameField = document.createElement('div');
                gameField.className = 'board-field';
                gameField.id = i;
                gameField.addEventListener('click',()=>{game.addMark(gameField)})
                ui.appendChild(gameField)

            }
    }()
    const win = function(player){
        const winField = document.createElement('p');
        winField.className = 'win-popup';
        winField.innerHTML = `${player.name} wins!`
        ui.replaceChildren();
        ui.appendChild(winField)
        ui.classList.remove("board-active");
    }
    const draw = function(){
        const winField = document.createElement('p');
        winField.className = 'win-popup';
        winField.innerHTML = `It's a draw`
        ui.replaceChildren();
        ui.appendChild(winField)
        ui.classList.remove("board-active");
    }


    return {ui,displayMark,win,draw,setGame};
}

function Ai(playersNames){
        const aiSymbol = Object.keys(playersNames).find(key => playersNames[key] === 'Computer');
        const play = function(gameBoard){
        const bestMove = minimax(gameBoard, aiSymbol)
        return placeSymbol(bestMove);     
    }
    const minimax = function (board, currentPlayer) {
      if (isGameOver(board)) {
        return evaluate(board);
      }

      let bestMove = -1;
      let bestScore = currentPlayer === aiSymbol ? -Infinity : Infinity;
  
      for (let move = 0; move < board.length; move++) {
        if (board[move] === null) {
          board[move] = currentPlayer;
          const score = minimax(board, currentPlayer === 'X' ? 'O' : 'X');
          board[move] = null;
  
          if (currentPlayer === aiSymbol) {
            if (score > bestScore) {
              bestScore = score;
              bestMove = move;
            }
          } else {
            if (score < bestScore) {
              bestScore = score;
              bestMove = move;
            }
          }
        }
      }
  
      return bestMove;
    };
  
    const isGameOver = function (gameBoard) {
        if( !gameBoard.includes(null) ||
            (gameBoard[0] !== null && gameBoard[0] === gameBoard[1] && gameBoard[1] === gameBoard[2])||
            (gameBoard[3] !== null && gameBoard[3] === gameBoard[4] && gameBoard[4] === gameBoard[5])||
            (gameBoard[6] !== null && gameBoard[6] === gameBoard[7] && gameBoard[7] === gameBoard[8])||
            (gameBoard[0] !== null && gameBoard[0] === gameBoard[3] && gameBoard[3] === gameBoard[6])||
            (gameBoard[1] !== null && gameBoard[1] === gameBoard[4] && gameBoard[4] === gameBoard[7])||
            (gameBoard[2] !== null && gameBoard[2] === gameBoard[5] && gameBoard[5] === gameBoard[8])||
            (gameBoard[0] !== null && gameBoard[0] === gameBoard[4] && gameBoard[4] === gameBoard[8])||
            (gameBoard[2] !== null && gameBoard[2] === gameBoard[4] && gameBoard[4] === gameBoard[6])
            ){
                return true;
            }
            return false;
    };
  
    const evaluate = function (gameBoard) {
        if((gameBoard[0]!= null && gameBoard[0] == !aiSymbol) && (
            (gameBoard[0] === gameBoard[1] && gameBoard[1] === gameBoard[2]) ||
            (gameBoard[0] === gameBoard[3] && gameBoard[3] === gameBoard[6]) ||
            (gameBoard[0] === gameBoard[4] && gameBoard[4] === gameBoard[8])
            ) ||
        (gameBoard[3]!= null && gameBoard[3] == !aiSymbol) && (
            gameBoard[3] === gameBoard[4] && gameBoard[4] === gameBoard[5]
            ) ||
        (gameBoard[6]!= null && gameBoard[6] == !aiSymbol) && (gameBoard[6] === gameBoard[7] && gameBoard[7] === gameBoard[8])||
        (gameBoard[1]!= null && gameBoard[1] == !aiSymbol) && (
            (gameBoard[1] === gameBoard[4] && gameBoard[4] === gameBoard[7])
        ) ||
        (gameBoard[2]!= null && gameBoard[2] == !aiSymbol) && (
            (gameBoard[2] === gameBoard[5] && gameBoard[5] === gameBoard[8]) ||
            (gameBoard[2] === gameBoard[4] && gameBoard[4] === gameBoard[6])
        )
        ){
            return -1;
        }

        if(gameBoard[0] == aiSymbol && (
            (gameBoard[0] === gameBoard[1] && gameBoard[1] === gameBoard[2]) ||
            (gameBoard[0] === gameBoard[3] && gameBoard[3] === gameBoard[6]) ||
            (gameBoard[0] === gameBoard[4] && gameBoard[4] === gameBoard[8])
            ) ||
        gameBoard[3]== aiSymbol && (
            gameBoard[3] === gameBoard[4] && gameBoard[4] === gameBoard[5]
            ) ||
        gameBoard[6]== aiSymbol && (gameBoard[6] === gameBoard[7] && gameBoard[7] === gameBoard[8])||
        gameBoard[1]== aiSymbol && (
            (gameBoard[1] === gameBoard[4] && gameBoard[4] === gameBoard[7])
        ) ||
        gameBoard[2]== aiSymbol && (
            (gameBoard[2] === gameBoard[5] && gameBoard[5] === gameBoard[8]) ||
            (gameBoard[2] === gameBoard[4] && gameBoard[4] === gameBoard[6])
        )
        ){
            return 1;
        }

        if(!gameBoard.includes(null))
        return 0;
    };
    
    const placeSymbol = function(move){
        let gameFields = [... document.getElementsByClassName('board-field')];
        for(field of gameFields){
            if(field.id == move){
                return field;
            }
        }
    }
    return {play}
}

function setDefaultNames(){
    let defaultNames ={
        o:'O',
        x:'X'
        }
    
    if(aiToggle.checked){

        if(!document.querySelector('#x-singleplayer-selection').checked){
            defaultNames.o = 'You'
            defaultNames.x = 'Computer'
        }
        else{
            defaultNames.x = 'You'
            defaultNames.o = 'Computer'
        }
    }
    return defaultNames;
}

function startGame(){
    const defaultNames = setDefaultNames();
    const playersNames = [document.querySelector('#player_O_name').value || defaultNames.o,document.querySelector('#player_X_name').value || defaultNames.x];
    const ui = Ui(playersNames);
    const ai = aiToggle.checked? Ai(ui) : false;
    const currentGame = Game(playersNames,ui,ai);
    ui.setGame(currentGame);
}

function toggleAiView(){
    let xNameField = document.querySelector('.X-player');
    let oNameField = document.querySelector('.O-player');
    let aiSymbolSelection =  document.querySelector('.ai-symbol-selection');
    if(document.querySelector('#AI').checked){
        xNameField.children[1].value = "";
        oNameField.children[1].value = "";
        xNameField.hidden = true;
        oNameField.hidden = true;
        aiSymbolSelection.hidden = false;
        
    }
    else{
        aiSymbolSelection.hidden = true;
        xNameField.hidden = false;
        oNameField.hidden = false;
    }
}

let aiToggle = document.querySelector('#AI')
let startButton = document.querySelector('#play');
startButton.addEventListener('click',startGame);
aiToggle.addEventListener('click',toggleAiView);
