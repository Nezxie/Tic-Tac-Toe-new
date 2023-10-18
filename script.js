function player(mark,name){
    let playerMark = mark;
    return {name, playerMark}
}

function Game(playersNames,ui){    
    let gameBoard = [];
    let initializeBoard = function(){
        for(let i=0;i<9;i++){
            gameBoard[i]=null;
        }
    }
    initializeBoard();
    let players = [player('O',playersNames[0]),player('X', playersNames[1])]
    let currentPlayer = players[0];

    function changePlayer(){
        if(currentPlayer === players[0]){
            currentPlayer = players[1]
        }
        else{
            currentPlayer = players[0]
        }
    }
    const addMark = function (gameField){        
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
     
    return {gameBoard, players, changePlayer, checkForWin, addMark}
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
        document.querySelector('.board').replaceChildren();
        document.querySelector('.board').appendChild(winField)
    }
    const draw = function(){
        const winField = document.createElement('p');
        winField.className = 'win-popup';
        winField.innerHTML = `It's a draw`
        document.querySelector('.board').replaceChildren();
        document.querySelector('.board').appendChild(winField)
    }


    return {ui,displayMark,win,draw,setGame};
}


function startGame(){
    const playersNames = [document.querySelector('#player_O_name').value || "player 1",document.querySelector('#player_X_name').value || "player 2"];
    const ui = Ui();
    const currentGame = Game(playersNames,ui);
    ui.setGame(currentGame);
}

let startButton = document.querySelector('#play');
startButton.addEventListener('click',startGame);

