class Boss extends Character {
    constructor(game) {
        
        const height = OPPONENT_HEIGHT * game.width / 100,
              width = OPPONENT_WIDTH * game.width / 100,
              x = getRandomNumber(game.width - width / 2),
              y = 0,
              speed = OPPONENT_SPEED * 3,  
              myImage = 'assets/boss.png',
              myImageDead = 'assets/boss_dead.png';

        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.direction = "R";  
        this.horizontalMov = getRandomNumber(game.width / 2); 
        
        
        setTimeout(() => this.shoot(), 300 + getRandomNumber(900));
    }

    
     
     
    update() {
        if (!this.dead && !this.game.ended) {
            
            this.y += this.speed;  
            if (this.y > this.game.height) {
                this.y = 0;
                this.x = getRandomNumber(this.game.width - this.width);  
            }
    
            
            const maxLateralRange = this.game.width * 0.3;  
            if (this.direction === "R") {  
                if (this.x < this.game.width - this.width - maxLateralRange) {
                    this.x += this.speed;
                } else {
                    this.direction = "L";  
                }
            } else { 
                if (this.x > maxLateralRange) {
                    this.x -= this.speed;
                } else {
                    this.direction = "R";  
                }
            }
    
            
            if (Math.random() < 0.05) {  
                this.x += (Math.random() - 0.5) * this.speed * 4;  
            }
        }
    }
    
    
    


    shoot() {
        if (!this.dead && !this.game.ended) {
            if (!this.game.paused) {
                this.game.shoot(this);  
            }
            
            setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
        }
    }

    
    collide() {
        if (!this.dead) {
            this.dead = true;
            this.image.src = this.myImageDead;
            this.image.classList.add('flame-effect');  
    
            this.game.score++;  
            this.game.updateScore(); 
    
            setTimeout(() => {
                this.remove();  
                this.game.opponents = this.game.opponents.filter(o => o !== this);  
                this.game.removeOpponent(this);  
            }, 500);  
        }
    }
    
}
