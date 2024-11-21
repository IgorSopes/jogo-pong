
// Variáveis para as raquetes, bola e barras horizontais
let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;

function setup() {
  createCanvas(800, 400);
  raqueteJogador = new Raquete(30, height / 2, 10, 60);
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60);
  bola = new Bola(10);
  barraSuperior = new Barra(0, 0, width, 5);
  barraInferior = new Barra(0, height , width, 5);
}

function draw() {
  background(0);

  // Atualiza as posições das raquetes, bola e barras horizontais
  raqueteJogador.atualizar();
  raqueteComputador.atualizar();
  bola.atualizar(barraSuperior, barraInferior);

  // Verifica colisões entre bola e raquetes
  bola.verificarColisaoRaquete(raqueteJogador);
  bola.verificarColisaoRaquete(raqueteComputador);

  // Desenha as raquetes, a bola e as barras horizontais
  raqueteJogador.exibir();
  raqueteComputador.exibir();
  bola.exibir();
  barraSuperior.exibir();
  barraInferior.exibir();
}

class Raquete {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  atualizar() {
    if (this === raqueteJogador) {
      this.y = mouseY;
    } else {
      if (bola.y > this.y + this.h / 2) {
        this.y += 3;
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3;
      }
    }
    this.y = constrain(this.y, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
  }

  exibir() {
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Bola {
  constructor(r) {
   this.r = r;
    this.reiniciar();
  }
  
    aumentarVelocidade() {
    const fatorAumento = 1.1;
    this.velocidadeX *= fatorAumento;
    this.velocidadeY *= fatorAumento;
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-4, -3, 3, 4]);
    this.velocidadeY = random(-3, 3);
  }

  atualizar(barraSuperior, barraInferior) {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    if (
      this.y - this.r / 2 <= barraSuperior.y + barraSuperior.h ||
      this.y + this.r / 2 >= barraInferior.y - barraInferior.h
    ) {
      this.velocidadeY *= -1;
    }

    if (this.x + this.r / 2 >= width) {
      this.reiniciar();
    } else if (this.x - this.r / 2 <= 0) {
      raqueteComputador.y = random(height - raqueteComputador.h);
      this.reiniciar();
    }
  }

  verificarColisaoRaquete(raquete) {
    if (
      this.x - this.r / 2 <= raquete.x + raquete.w / 2 &&
      this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
      this.y + this.r / 2 >= raquete.y - raquete.h / 2 &&
      this.y - this.r / 2 <= raquete.y + raquete.h / 2
    ) {
      this.velocidadeX *= -1;
      let posicaoRelativa = (this.y - raquete.y) / raquete.h;
      let anguloBola = posicaoRelativa * PI / 3 * 2.3;
      this.velocidadeY = this.velocidadeX * Math.tan(anguloBola);
      this.aumentarVelocidade();
    }
  }

  exibir() {
    fill(255);
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.r);
  }
}

class Barra {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  exibir() {
    fill(color(255, 0,0));
    rectMode(CENTER);
    rect(this.x + this.w / 2, this.y, this.w, this.h);
  }
}


/*let ball;
let playerPaddle;
let computerPaddle;

function setup() {
  createCanvas(600, 400);
  
  ball = new Ball();
  playerPaddle = new Paddle(true);
  computerPaddle = new Paddle(false);
}

function draw() {
  background(0);
  
  ball.move();
  ball.display();
  
  playerPaddle.display();
  computerPaddle.display();
  
  playerPaddle.move();
  computerPaddle.move(ball);
  
  if (ball.x < 0 || ball.x > width) {
    ball.reset();
  }
}

class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.speedX = random(2, 4) * (random() < 0.5 ? 1 : -1);
    this.speedY = random(2, 4) * (random() < 0.5 ? 1 : -1);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Ball hits top or bottom
    if (this.y <= 0 || this.y >= height) {
      this.speedY *= -1;
    }

    // Ball hits paddles
    if (this.collidesWithPaddle(playerPaddle) || this.collidesWithPaddle(computerPaddle)) {
      this.speedX *= -1;
    }
  }

  collidesWithPaddle(paddle) {
    if (this.x - 10 < paddle.x + paddle.width && this.x + 10 > paddle.x &&
        this.y > paddle.y && this.y < paddle.y + paddle.height) {
      return true;
    }
    return false;
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, 20, 20);
  }
}

class Paddle {
  constructor(isPlayer) {
    this.width = 10;
    this.height = 80;
    this.isPlayer = isPlayer;
    
    if (this.isPlayer) {
      this.x = 20;
      this.y = height / 2 - this.height / 2;
    } else {
      this.x = width - 30;
      this.y = height / 2 - this.height / 2;
    }
  }

  move() {
    if (this.isPlayer) {
      this.y = mouseY - this.height / 2;
      this.y = constrain(this.y, 0, height - this.height);
    }
  }

  move(ball) {
    if (!this.isPlayer) {
      // Simple AI: randomly move the paddle when ball hits it
      if (ball.collidesWithPaddle(this)) {
        let newPos = random(0, height - this.height);
        this.y = newPos;
      }
    }
  }

  display() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}*/
