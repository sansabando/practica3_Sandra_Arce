/**
 * Main character of the game. Inherits from the Character class
 * @extends Character
 */
class Player extends Character {
    /**
    * Initializes a player
    * @param game {Game} The instance of the game to which the player belongs
    */

    constructor (game) {
        const height = PLAYER_HEIGHT * game.width / 100,
            width = PLAYER_WIDTH * game.width / 100,
            x = game.width / 2 - width / 2,
            y = game.height - height,
            speed = PLAYER_SPEED,
            myImage = PLAYER_PICTURE,
            myImageDead = PLAYER_PICTURE_DEAD;

        super(game, width, height, x, y, speed, myImage, myImageDead);
        this.lives = 3;
        this.originalImage = myImage;
    }

    /**
     * Update the position attributes of the player and the shots based on the keys pressed
     */
    update() {
        if (!this.dead) {
            switch (this.game.keyPressed) {
                case KEY_LEFT:
                    if (this.x > this.speed) {
                        this.x -= this.speed;
                    }
                    break;
                case KEY_RIGHT:
                    if (this.x < this.game.width - this.width - this.speed) {
                        this.x += this.speed;
                    }
                    break;
                case KEY_SHOOT:
                    this.game.shoot(this);
                    break;
            }
        }
    }

    collide() {
        if (!this.dead) {
            this.lives--;  // Reduce una vida
            this.game.updateLives();  // Actualiza el marcador de vidas

            // Cambia la imagen a "estrella" cuando el jugador es golpeado
            this.image.src = this.myImageDead;

            if (this.lives > 0) {
                this.dead = true;  // Marca al jugador como "temporalmente muerto"
                setTimeout(() => {
                    this.dead = false;  // Revive al jugador
                    this.image.src = this.originalImage;  // Recupera la imagen original
                }, 2000);  // Recupera después de 2 segundos
            } else {
                this.game.endGame(false);  // Termina el juego si las vidas llegan a cero
            }
        }
    }


}