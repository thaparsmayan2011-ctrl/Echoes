const canvas = document.getElementById("game");
const ctx= canvas.getContext("2d");

canvas.width = 1000;
canvas.height= 600;
const player = {
    x:100,
    y:500,
    width: 35,
    height:45,
    velocityY: 0,
    gravity:0.7,
    jumppower: -13,
    grounded: false
};
const keys= {};
let recording =[];
let runtime= 0;
let runon= true;
let echoes= [];
let buttonpressed = false;
let echobutton = false;
let gamewon = false;
let echoframes = [];
let moved = false;
let button2pressed= false;
let echo2button = false;
let ePressed = false;
let level= 1;

const echoSize ={
    width: 35,
    height: 45
};

const button = {
    x:200, 
    y:520,
    width: 60,
    height: 30
};

const button2= {
    x: 600,
    y: 370,
    width: 60,
    height: 30,
}

const platform = {
    x: 600,
    y: 400,
    width: 200,
    height: 20,
};

const door2 = {
    x: 850,
    y: 330,
    width: 40,
    height: 220,
};
  
const door={
    x:450,
    y:400,
    width:40,
    height:150
};

const exit = {
    x:930, 
    y: 470,
    width: 50,
    height: 80
};


document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
    if (event.key === "e" && !ePressed && runon && moved){
       echoes.push(recording);
       echoframes.push(0);
       recording =[];
       runtime=0;
       for (let i = 0; i< echoframes.length; i++){
        echoframes[i] =0;
       }
       player.x = 100;
       player.y= 500;
       player.velocityY=0;
       moved = false;
       ePressed = true;
    } 

    
    //jump
    if (event.key === " " && player.grounded){

        player.velocityY= player.jumppower;
        player.grounded= false;
        moved = true;
    }

    if (event.key.toLowerCase() === "r"){
        if (gamewon){
            resetLevel();
            gameloop();
        }    
        else{
            resetLevel();
        }
    }    
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
    if (event.key === "e"){
        ePressed= false;
    }
});

function setuplevel(){
    if (level=== 1){
        button.x =200;
        button.y =520;
        button2.x =600;
        button2.y =420;

        platform.x = 600;
        platform.y= 450;
        platform.width =200;

        door.x=450;
        door2.x =850;
        exit.x =930;
    }
    if (level===2){
        button.x = 200;
        button.y = 520;
        button2.x=700;
        button2.y =420;

        platform.x =600;
        platform.y= 450;
        platform.width = 200;

        door.x = 400;
        door2.x = 850;
        exit.x =930;
    }

    if (level ===3){
        button.x =200;
        button.y =520;

        button2.x=550;
        button2.y= 420;

        platform.x =550;
        platform.y =450;
        platform.width= 250;

        door.x= 700;
        door2.x =850;
        exit.x = 930;
    }
}


function resetLevel(){
    if (gamewon){
        level =1;
    }
    recording= [];
    echoes=[];
    echoframes = [];
    runtime=0;
    moved = false;
    gamewon =false;
    ePressed = false;
    buttonpressed = false;
    echobutton = false;
    button2pressed = false;
    echo2button = false;

    player.x =100;
    player.y= 500;
    player.velocityY= 0;
    player.grounded = false;
    setuplevel();
}

function getframe(i){
    if  (echoframes[i] >= echoes[i].length){
        return echoes[i][echoes[i].length -1];
    }

    return echoes[i][echoframes[i]];
}

function gameloop(){
    if (gamewon){
        drawWinScreen();
        return;
    }

    if (runon){
        recording.push({
            time: runtime,
            x:player.x,
            y: player.y,
            grounded: player.grounded
        });
        runtime += 1/60;
    }


    for (let i=0; i< echoes.length; i++){
        if (echoframes[i] < echoes[i].length-1){
            echoframes[i]+= 1;
        }
    }


    if (keys["ArrowLeft"]) {
        player.x -=5;
        moved = true;
    }
    else if (keys["ArrowRight"]) {
        player.x +=5;
        moved =true;
    }

    player.velocityY+= player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= 550) {
        player.y = 550- player.height;
        player.velocityY= 0;
        player.grounded = true;
    }
    else if (player.y + player.height < 550) {
        player.grounded= false;
    }

    if (player.velocityY >= 0 &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y+ player.height >= platform.y &&
        player.y + player.height <= platform.y + platform.height+ player.velocityY) {
        
        player.y = platform.y - player.height;
        player.velocityY =0;
        player.grounded= true;
    }
    

   
    if (player.x < 0){
        player.x=0;
    }
    else if (player.x+ player.width > canvas.width) {
        player.x = canvas.width- player.width;
    }

    if(player.y> canvas.height){
        resetLevel();
    }

    //door collision
    if (!buttonpressed &&
        player.x+ player.width > door.x &&
        player.x < door.x + door.width &&
        player.y+ player.height > door.y &&
        player.y < door.y+door.height) {
            player.x = door.x- player.width;
    }

    if (!button2pressed &&
        player.x + player.width > door2.x &&
        player.x < door2.x + door2.width &&
        player.y + player.height > door2.y &&
        player.y < door2.y + door2.height){
        player.x = door2.x - player.width;
    }
    



    if (player.x + player.width > exit.x &&
        player.x < exit.x + exit.width &&
        player.y + player.height > exit.y){
            
            if (level < 3){
                level++;
                resetLevel();
            }
            else{
                gamewon=true;

            }
    }
    
    buttonpressed =player.x < button.x + button.width &&
        player.x + player.width> button.x &&
        player.y + player.height >= button.y &&
        player.y + player.height <= button.y + button.height + 10;

    echobutton = false;

    button2pressed = false;

    echo2button = false;

    for (let i= 0; i< echoes.length; i++){
        if (echoes[i].length > 0){
            let currentEcho = getframe(i);

            if (currentEcho.x < button2.x + button2.width &&
                currentEcho.x+ echoSize.width> button2.x &&
                currentEcho.y + echoSize.height >= button2.y &&
                currentEcho.y + echoSize.height <= button2.y + button2.height +10) {
                echo2button = true;
            }
        
        }
    }


    for (let i= 0; i< echoes.length; i++){
        if (echoes[i].length >0){
            let currentEcho = getframe(i);

            if (currentEcho.x < button.x + button.width &&
                currentEcho.x + echoSize.width > button.x &&
                currentEcho.y + player.height>= button.y &&
                currentEcho.y + player.height <= button.y + button.height+ 10)
                echobutton= true;
            
        }
    }

    buttonpressed= buttonpressed || echobutton;

   
    button2pressed = button2pressed || echo2button;
    

    ctx.clearRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = level===1 ?  "#111": level ===2 ? "#18112a": "#10201b";
    ctx.fillRect(0,0, canvas.width, canvas.height);


    ctx.fillStyle ="#444";
    ctx.fillRect(0, 550, canvas.width, 50);
    ctx.fillStyle = "#555";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)


    //button
    ctx.fillStyle = buttonpressed ? "#00ff66" : "#ff3333";
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "#000";
    ctx.font ="14px Arial";
    ctx.fillText("ECHO", button.x +10, button.y+20);

    ctx.fillStyle =button2pressed ? "#00ff66" : "#ff3333";
    ctx.fillRect(button2.x, button2.y, button2.width, button2.height);
    ctx.fillStyle= "#000";
    ctx.font= "14px Arial";
    ctx.fillText("ECHO 2", button2.x +5, button2.y+20);

    //door
    if (!buttonpressed) {
        ctx.fillStyle ="#8844ff";
        ctx.fillRect(door.x, door.y, door.width, door.height);
    }    

    if (!button2pressed){
        ctx.fillStyle = "#8844ff";
        ctx.fillRect(door2.x, door2.y, door2.width, door2.height);
    }

    ctx.fillStyle = "#ffff00";

    ctx.fillRect(exit.x, exit.y, exit.width, exit.height);

    //player
    ctx.fillStyle= "#fff";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    for (let i= 0; i< echoes.length; i++){
        if (echoes[i].length > 0){
            let currentEcho =getframe(i);

            ctx.globalAlpha= 0.45;
            ctx.fillStyle = "#00ffff";
            ctx.fillRect(
                currentEcho.x,
                currentEcho.y,
                echoSize.width,
                echoSize.height
            );
            ctx.globalAlpha= 1;
        }
    }

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.textAlign ="left";
    ctx.fillText("Arrows: MOVE  SPACE: JUMP   E: ECHO  R:RESET", 20, 30);

    ctx.font = "22px Arial";
    ctx.fillText("LEVEL " + level, 850, 30);
    ctx.fillText("ECHOES: " + echoes.length, 850, 55);  
    requestAnimationFrame(gameloop);
}    

function drawWinScreen(){
    ctx.fillStyle ="#111";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    
    ctx.textAlign = "center";
    ctx.font ="48px Arial";
    ctx.fillText("ECHO COMPLETE", canvas.width/2, 250);
    
    ctx.font = "20px Arial";
    ctx.fillText("You escaped the level", canvas.width/2,300);
    ctx.font = "24px Arial";
    ctx.fillText("Press R to restart", canvas.width/2, 350);
}
setuplevel();
gameloop();