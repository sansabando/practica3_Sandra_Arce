class Boss extends Character {
    constructor(game) {
        // Configura las propiedades específicas del Boss
        const height = OPPONENT_HEIGHT * game.width / 100,
              width = OPPONENT_WIDTH * game.width / 100,
              x = getRandomNumber(game.width - width / 2),
              y = 0,
              speed = OPPONENT_SPEED * 3,  // Velocidad aumentada para el Boss
              myImage = 'assets/boss.png',
              myImageDead = 'assets/boss_dead.png';

        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.direction = "R";  // Dirección inicial a la derecha
        this.horizontalMov = getRandomNumber(game.width / 2); // Distancia horizontal antes de cambiar dirección
        
        // Programar el primer disparo
        setTimeout(() => this.shoot(), 300 + getRandomNumber(900));
    }

    /**
     * Maneja el movimiento y cambio de dirección del Boss
     */
    update() {
        if (!this.dead && !this.game.ended) {
            // Movimiento descendente constante en el eje Y
            this.y += this.speed;  // El Boss baja en la pantalla
    
            // Si el Boss llega al fondo de la pantalla, vuelve a aparecer en la parte superior
            if (this.y > this.game.height) {
                this.y = 0;
                this.x = getRandomNumber(this.game.width - this.width);  // Reaparece en una posición X aleatoria
            }
    
            // Movimiento más amplio en el eje X
            // Aumentamos el ratio de movimiento lateral a un valor fijo más grande
            const maxLateralRange = this.game.width * 0.3;  // 30% del ancho de la pantalla como límite de movimiento
            if (this.direction === "R") {  // Moviendo hacia la derecha
                if (this.x < this.game.width - this.width - maxLateralRange) {
                    this.x += this.speed;
                } else {
                    this.direction = "L";  // Cambia de dirección al alcanzar el límite derecho
                }
            } else {  // Moviendo hacia la izquierda
                if (this.x > maxLateralRange) {
                    this.x -= this.speed;
                } else {
                    this.direction = "R";  // Cambia de dirección al alcanzar el límite izquierdo
                }
            }
    
            // Movimiento aleatorio adicional para dar más imprevisibilidad
            if (Math.random() < 0.05) {  // 5% de probabilidad de hacer un cambio pequeño en X
                this.x += (Math.random() - 0.5) * this.speed * 4;  // Pequeño ajuste aleatorio en X
            }
        }
    }
    
    
    

    /**
     * Crea un disparo automáticamente
     */
    shoot() {
        if (!this.dead && !this.game.ended) {
            if (!this.game.paused) {
                this.game.shoot(this);  // Dispara un proyectil
            }
            // Programar el próximo disparo con un intervalo aleatorio
            setTimeout(() => this.shoot(), 1000 + getRandomNumber(2500));
        }
    }

    /**
     * Maneja la colisión y derrota del Boss
     */
    collide() {
        if (!this.dead) {
            this.dead = true;
            this.image.src = this.myImageDead;  // Cambia la imagen al estado "muerto"
            
            // Tras 2 segundos, elimina el Boss y finaliza el juego con victoria
            setTimeout(() => {
                this.remove();
                this.game.endGame(true);  // Llama a endGame con true indicando victoria
            }, 2000);
        }
    }
}
