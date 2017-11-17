class Ball{
  constructor(x,y) {
     this.x = x;
     this.y = y;
     this.x_speed = 0;
     this.y_speed = 3;
     this.radius = 5;
  }
  render() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
      context.fillStyle = '#000000';
      context.fill();
  }


  update(paddle1, paddle2) {
      this.x += this.x_speed;
      this.y += this.y_speed;
      let top_x = this.x - 5;
      let top_y = this.y -5;
      let bottom_x = this.x + 5;
      let bottom_y = this.y + 5;


      if(this.x - 5 < 0) { //left wall
          this.x = 5;
          this.x_speed = -this.x_speed;
      }else if(this.x + 5 > 400){ // right wall
          this.x = 395;
          this.x_speed = -this.x_speed;
      }

      if(this.y < 0 || this.y > 600) { //point scored
          this.x_speed = 0;
          this.y_speed = 3;
          this.x = 200;
          this.y = 300;
      }

      if(top_y > 300){
          if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x){
              //hit player paddle
              this.y_speed = -3;
              this.x_speed += (paddle1.x_speed / 2);
              this.y += this.y_speed;
          }
      }else{
          if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {					 //hit computer paddle
             this.y_speed = 3;
             this.x_speed += (paddle2.x_speed / 2);
             this.y += this.y_speed;
          }
     }
  }
}

class Paddle{
    constructor(x, y, width, height){
      		this.x = x;
      		this.y = y;
      		this.width = width;
      		this.height = height;
      		this.x_speed = 0;
      		this.y_speed = 0;
    }

  move(x,y) {
      this.x += x;
      this.y += y;
      this.x_speed = x;
      this.y_speed = y;
      if(this.x < 0) { //check for left wall
          this.x = 0;
          this.x_speed = 0;
      }else if (this.x + this.width > 400){ //check for right wall
          this.x = 400 - this.width;
          this.x_speed = 0;
      }
  }

  render(){
      context.fillStyle = '#0000FF';
      context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Computer {
    constructor(){
      this.paddle = new Paddle(175, 10, 50, 10);
    }

    update(ball){
			let x_pos = ball.x;
			let diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
			if(diff < 0 && diff > 4) { //max speed left
					diff = -5;
			}
			this.paddle.move(diff, 0);
			if(this.paddle.x < 0) {
					this.paddle.x =0;
			}else if (this.paddle.x + this.paddle.width > 400) {
					this.paddle.x = 400 - this.paddle.width;
			}
		}

    render() {
    		this.paddle.render();
    }

}

class Player{

    constructor(){
        this.paddle = new Paddle(175, 580, 50, 10);
    }

    render() {
  		  this.paddle.render();
      }

    update(){
      for(let key in keysDown) {
          let value = Number(key);
          if(value == 37){ //left arrow
              this.paddle.move(-4,0);
          }else if(value == 39){ //right arrow
              this.paddle.move(4,0);
          }else{
              this.paddle.move(0,0);
          }
      }
  }

}


let animate = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) { window.setTimeout(callback, 1000/60) };

let canvas = document.createElement('canvas');
let width = 400;
let height = 600;
canvas.width = width;
canvas.height =height;
let context = canvas.getContext('2d');

let keysDown = {};

window.addEventListener("keydown", function (event) {
		keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
		delete keysDown[event.keyCode];
});

window.onload = function(){
		document.body.appendChild(canvas);
		animate(step);
};

let step = function() {
		update();
		render();
		animate(step);
};


let update = function(){
		player.update();
		computer.update(ball);
		ball.update(player.paddle, computer.paddle);
};

let render = function() {
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, width, height);
		player.render();
		computer.render();
		ball.render();
};


let computer = new Computer();
let player = new Player();
let ball = new Ball(200,300);
