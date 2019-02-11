// var scoreboard=document.getElementById("scoreboard");
// alert(scoreboard.offsetTop);

initilize();


// Detecting mobile browser
function isMobile(){
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile']; 
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;
    return false;
}

// Initilization function turn = 1 for white or Player 1 and turn =-1 for black or player 2
function initilize(){
    window.mat=new Array(9)
    window.turn=1
    for(var i=0;i<=8;i++)mat[i]=new Array(9)
    window.cellSize = 60

    // Detecting mobile browser
    if (isMobile()) {
        button = document.getElementById('button')
        button.style.fontSize = '2rem'
        button.style.borderRadius = '0.50rem'
        cellSize = 100
     }
    
    window.canvas=document.getElementById("gamearea")
    document.getElementById('board').style.width = String(8*cellSize) + 'px'
    canvas.width = 8*cellSize
    canvas.height = 8*cellSize

    window.ctx=canvas.getContext('2d')
    ctx.fillStyle = "#00FF00"
    for(var i=1;i<=8;i++){
        for(var j=1;j<=8;j++){
            mat[i][j] = 0
            ctx.fillRect((j-1)*cellSize,(i-1)*cellSize,cellSize-1,cellSize-1)
        }
    }
    updateColor(4,4,-1)
    mat[4][4] = -1
    updateColor(4,5,1)
    mat[4][5] = 1
    updateColor(5,4,1)
    mat[5][4] = 1
    updateColor(5,5,-1)
    mat[5][5] = -1
    updateScore();
}

// Function called when theres is turn
function clicked(event){
    var rect = canvas.getBoundingClientRect();
    var j = Math.floor((event.clientX - rect.left)/cellSize) + 1
    var i = Math.floor((event.clientY - rect.top)/cellSize) + 1

    if(mat[i][j]!=0)return;

    directions = isValid(i, j, turn)

    if(directions.length>0){

        for( index in directions){
            updateTable(i, j, directions[index][0], directions[index][1], turn)
        }
        updateScore()
        changeTurn()

    }else{

        giveHint()

    }
}

// function for changing turn
function changeTurn(){
    turn = -turn
    if(turn == 1){
        document.getElementById("turn").style = "color : white"
    }else{
        document.getElementById("turn").style = "color : black"
    }
}

// give player the coordinates of succcessful turns
function giveHint(){
    
    isFinished = true
    for(i = 1; i <= 8; i++){
        for(j=1; j <= 8; j++){
            if(isValid(i,j, turn).length > 0){
                updateColor(i, j, turn)
                isFinished = false
            }
        }
    }
    
    if(isFinished){
        if(turn == -1){
            alert('Player1 won')
            initilize()
        }else{
            alert('Player2 won')
            initilize()
        }
    }else{
        setTimeout(()=>{
            for(i = 1; i <= 8; i++){
                for(j=1; j <= 8; j++){
                    if(mat[i][j] == 0 && isValid(i,j, turn).length > 0){
                        resetColor(i, j, 0)
                    }
                }
            }
    },200)
    }

}

// Update the matrix after a succesful turn
function updateTable(i, j, di, dj, turn){

    updateColor(i, j, turn)
    mat[i][j] = turn
    i+=di; j+=dj;

    while(mat[i][j]!=turn){
      mat[i][j] = turn
      updateColor(i, j, turn)
      i+=di
      j+=dj
    }

}

// Checking if a coordinate is valid or not
function isCoordinateValid(i,j){

    if(i >= 1 && i <= 8 && j >= 1 && j<=8){
        return true;
    }
    return false;
}

// Checking for 011110 or 100001 sequence
function lineCheck(i, j, di, dj, turn){

    if(!isCoordinateValid(i,j) || mat[i][j] != -turn){
        return false
    }
    
    while(isCoordinateValid(i,j) && mat[i][j] == -turn){
     i+=di
     j+=dj
    }

    if(!isCoordinateValid(i,j) || mat[i][j]==0){
        return false
    }

    return true;
}

// Checking if  a turn is possible at a given coordinate. Returns all  directions at which color change will take place. 
function isValid(i, j, turn){

    directions = []

    if(i < 1 || i > 8 || j < 1 || j > 8 || mat[i][j] != 0){
        return directions
    }

    for(di=-1;di<=1;di++){
        for(dj=-1;dj<=1;dj++){
            if(di!=0||dj!=0){
                if(lineCheck(i+di, j+dj, di, dj, turn)){
                    directions.push([di, dj])
                }
            }
        }
    }

    return directions
}

// Update color of a box 1 for white and 0 for black
function updateColor(i, j, color){
    ctx.beginPath();
    if(color == 1){
        ctx.fillStyle = "#ffffff";
    }
    else if(color == -1){
        ctx.fillStyle = "#000000";
    }
    ctx.arc((j-1)*cellSize + cellSize/2, (i-1)*cellSize + cellSize/2, cellSize/2 -1, 0,2*Math.PI);
    ctx.fill();
}

function resetColor(i, j){
    ctx.fillStyle = "#00FF00";
    ctx.fillRect((j-1)*cellSize, (i-1)*cellSize, cellSize-1, cellSize-1)
}

// Update score by counting no. of white and black
function updateScore(){
    whiteScore = 0
    blackScore = 0

    for(i = 1; i <=8; i++ ){
        for(j = 1; j<=8; j++){
           if(mat[i][j] == 1){
               whiteScore++;
           }else if(mat[i][j] == -1){
               blackScore++;
           }
        }
    }

    if(whiteScore == 0){
        alert('Player 2 won')
        initilize();
        return;
    }
    if(blackScore == 0){
        alert('player 1 is won')
        initilize();
        return;
    }
    document.getElementById("score1").innerHTML=whiteScore;
    document.getElementById("score2").innerHTML=blackScore;
}

