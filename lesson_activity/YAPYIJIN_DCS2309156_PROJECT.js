let cannon;
let balls = [];
let shoot = [];
let score = 0;
let backgroundImage;
let gameState = 'start'; 

function preload() {
  backgroundImage = loadImage('star sky.jpeg');
}

function setup() {
  createCanvas(1280, 720);
  cannon = new Cannon();
  setInterval(() => {
    if (gameState === 'play') { 
      balls.push(new Ball());
    }
  }, 1000);
}

function draw() {
  background(backgroundImage);

  if (gameState === 'start') {
    displayStartScreen(); 
  } else if (gameState === 'play') {
    playGame(); 
  } else if (gameState === 'end') {
    displayEndScreen();
  }

  textSize(30);
  fill(255);
  text(`Score: ${score}`, width - 150, 30);
}

function keyPressed() {
  if (gameState === 'start' && keyCode === ENTER) {
    gameState = 'play'; 
  } else if (gameState === 'play' && keyCode === 32) {
    shoot.push(new Shoot(cannon.x, height - 30));
  } else if (gameState === 'end' && keyCode === ENTER) {
    resetGame(); 
  }
}

function displayStartScreen() {
  textSize(48);
  fill(255);
  textAlign(CENTER);
  text('Press ENTER to Start', width / 2, height / 2);
}

function displayEndScreen() {
  textSize(48);
  fill(255, 0, 0);
  textAlign(CENTER);
  text('Game Over!', width / 2, height / 2 - 40);
  textSize(30);
  text(`Final Score: ${score}`, width / 2, height / 2 + 20);
  textSize(24);
  text('Press ENTER to Restart', width / 2, height / 2 + 60);
}

function playGame() {
  cannon.display();
  cannon.update();

  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].display();
    balls[i].update();

    if (balls[i].hitsCannon(cannon)) {
      gameState = 'end';
      return;
    }

    for (let j = shoot.length - 1; j >= 0; j--) {
      if (balls[i].intersects(shoot[j])) {
        score++;
        balls.splice(i, 1); 
        shoot.splice(j, 1);
        break;
      }
    }
  }

  for (let i = shoot.length - 1; i >= 0; i--) {
    shoot[i].display();
    shoot[i].update();
    if (shoot[i].offscreen()) {
      shoot.splice(i, 1);
    }
  }
}

function resetGame() {
  balls = [];
  shoot = [];
  score = 0;
  cannon = new Cannon();
  gameState = 'play';
}

class Cannon {
  constructor() {
    this.x = width / 2;
    this.y = height - 10;
    this.width = 100;
    this.height = 70;
  }

  display() {
    rectMode(CENTER);
    fill(100);
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
    this.x = constrain(this.x, this.width / 2, width - this.width / 2);
  }
}

class Ball {
  constructor() {
    this.x = random(width);
    this.y = random(-50, -10);
    this.diameter = random(20, 60);
    this.ySpeed = random(2, 5);
    this.xSpeed = random(-3, 3);
    this.elasticity = 0.8;
    this.minSpeed = 1;
  }

  display() {
    fill(137, 176, 201);
    ellipse(this.x, this.y, this.diameter);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x <= this.diameter / 2 || this.x >= width - this.diameter / 2) {
      this.xSpeed *= -1;
      this.x = constrain(this.x, this.diameter / 2, width - this.diameter / 2);
    }

    if (this.y <= this.diameter / 2) {
      this.ySpeed *= -1 * this.elasticity;
      this.y = this.diameter / 2;
    }

    if (this.y >= height - this.diameter / 2) {
      this.y = height - this.diameter / 2;
      this.ySpeed *= -1 * this.elasticity;
      if (abs(this.ySpeed) < this.minSpeed) {
        this.ySpeed = -this.minSpeed;
      }
    }
  }

  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d < this.diameter / 2 + other.size / 2);
  }

  hitsCannon(cannon) {
    let d = dist(this.x, this.y, cannon.x, cannon.y);
    return (d < this.diameter / 2 + cannon.height / 2);
  }
}

class Shoot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 5;
  }

  display() {
    fill(185, 214, 222);
    ellipse(this.x, this.y, this.size);
  }

  update() {
    this.y -= this.speed;
  }

  offscreen() {
    return (this.y < 0);
  }

  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d < this.size / 2 + other.diameter / 2);
  }
}



