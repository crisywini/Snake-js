var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
var score = 0;

var drawCircle = function(x, y, radius, fillCircle){
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2, false)
    if(fillCircle){
        context.fill();
    }else{
        context.stroke();
    }
};

var drawScore = function(){
    context.font = "20px CaskaydiaCove Nerd Font";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " +score,blockSize, blockSize);
};


var gameOver = function(){
    clearInterval(intervalId);
    context.font  = "70px PlayMeGames";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over", width/2, height/2);
};

var Block = function(row, col){
    this.row = row;
    this.col = col;
};

Block.prototype.drawSquare = function(color){
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
}

Block.prototype.drawCircle = function(color){
    var centerX = this.col * blockSize + blockSize/2;
    var centerY = this.row * blockSize + blockSize/2;
    context.fillStyle = color;
    drawCircle(centerX, centerY, blockSize/2, true);
};

Block.prototype.equal = function(otherBlock){
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

var Snake = function(){
    this.segments = [
      new Block(5, 7), //Head
      new Block(5, 6),
      new Block(5, 5)  //Tail
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

Snake.prototype.draw = function(){
    for(var i = 0; i<this.segments.length; i++){
        this.segments[i].drawSquare("Blue");
    }
};

Snake.prototype.move = function(){

    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if(this.direction === "right"){
        newHead = new Block(head.row, head.col+1);
    }else if(this.direction === "down"){
        newHead = new Block(head.row+1, head.col);
    }else if(this.direction === "left"){
        newHead = new Block(head.row, head.col-1);
    }else if(this.direction === "up"){
        newHead = new Block(head.row-1, head.col);
    }

    if(this.checkCollision(newHead)){
        gameOver();
        return;
    }

    this.segments.unshift(newHead); //Adding the head at the start

    if(newHead.equal(apple.position)){
        score++;
        apple.move();
    }else{
        this.segments.pop();
    }
    console.log(apple.position, this.segments[0].position);
};

Snake.prototype.checkCollision = function(head){
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks-1);
    var bottomCollision = (head.row === heightInBlocks-1);

    var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    var selfCollision = false;
    for(var i = 0; i<this.segments.length;i++){
        if(head.equal(this.segments[i])){
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function(newDirection){
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }
    this.nextDirection = newDirection;       
};

var Apple = function(){
    this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
    this.position.drawCircle("Red");
};

Apple.prototype.move = function () {
    var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomRow, randomCol);
};
var snake = new Snake();
var apple = new Apple();


var intervalId = setInterval(function () {
    context.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
}, 100);

var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

$("body").keydown(function (event) {
    var newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});
