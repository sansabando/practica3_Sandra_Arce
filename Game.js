/**
 * The game itself
 */
class Game {
    /**
     * Initializes a game
     */
    constructor () {
        this.started = false; // Indicates whether the game has started or not
        this.ended = false; // Indicates whether the game has ended or not
        this.keyPressed = undefined; // Indicates the key the user is pressing
        this.width = 0; // Width of the game screen
        this.height = 0; // Height of the game screen
        this.player = undefined; // Instance of the main character in the game
        this.playerShots = []; // Shots fired by the main character
        this.opponent = undefined; // Instance of the opponent in the game
        this.opponentShots = []; // Shots fired by the opponent
        this.xDown = null; // Position where the user touched the screen
        this.paused = false; // Indicates whether the game is paused
        this.score = 0;
        this.opponents = [];
        
    }


    /**
     * Start the game
     */
    start () {
        if (!this.started) {
            
            // RequestAnimationFrame(this.update());
            window.addEventListener("keydown", (e) => this.checkKey(e, true));
            window.addEventListener("keyup", (e) => this.checkKey(e, false));
            window.addEventListener("touchstart", (e) => this.handleTouchStart(e, true));
            window.addEventListener("touchmove", (e) => this.handleTouchMove(e, false));
            document.getElementById("pause").addEventListener("click", () => {
                this.pauseOrResume();
            });
            document.getElementById("reset").addEventListener("click", () => {
                this.resetGame();
            });
            this.started = true;
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.player = new Player(this);
            this.timer = setInterval(() => this.update(), 50);
            
       }
    }

    initializeUI() {
        const scoreElement = document.createElement('ul');
        scoreElement.innerHTML = `<li id="scoreli">Score: ${this.score}</li><li id="livesli">Lives: ${this.lives}</li>`;
        document.body.appendChild(scoreElement);
    }

    /**
     * Pause or resume the game
     */
    pauseOrResume() {
        if (this.paused) {
            this.timer = setInterval(() => this.update(), 50);
            document.body.classList.remove('paused');
            this.paused = false;
        } else {
            clearInterval(this.timer);
            document.body.classList.add('paused');
            this.paused = true;
        }
    }
    /**
    * Adds a new shot to the game, either from the opponent or the main character
    * @param character {Character} Character that is shooting
    */

    shoot (character) {
        const arrayShots = character instanceof Player ? this.playerShots : this.opponentShots;

        arrayShots.push(new Shot(this, character));
        this.keyPressed = undefined;
    }

    /**
    * Removes a shot from the game when it goes off-screen or the game ends
    * @param shot {Shot} Shot to be removed
    */

    removeShot (shot) {
        const shotsArray = shot.type === "PLAYER" ? this.playerShots : this.opponentShots,
            index = shotsArray.indexOf(shot);

        if (index > -1) {
            shotsArray.splice(index, 1);
        }
    }

    /**
     * Remove the opponent from the game
     */
   
    removeOpponent(opponent) {
        
        this.opponents = this.opponents.filter(o => !o.dead);
    
        
        if (this.score === 6) {
            this.endGame(true);  
            return;  
        }
    
       
        if (this.opponents.length === 0) {
            if (this.score === 1) {  
                
                this.opponents = [new Boss(this)];
                
            } else if (this.score === 2) {
                
                this.opponents = [new Boss(this), new Opponent(this)];
                
            } else if (this.score === 4) {
                
                this.opponents = [new Boss(this), new Boss(this)];
            } else {
               
                this.opponents = [new Opponent(this)];
            }
        }
    }
    
    
    
    


    /**
    * Checks which key the user is pressing
    * @param event {Event} Key up/pressed event
    * @param isKeyDown {Boolean} Indicates whether the key is pressed (true) or not (false)
    */

    checkKey (event, isKeyDown) {
        if (!isKeyDown) {
            this.keyPressed = undefined;
        } else {
            switch (event.keyCode) {
            case 37: // Left arrow
                this.keyPressed = KEY_LEFT;
                break;
            case 32: // Spacebar
                this.keyPressed = KEY_SHOOT;
                break;
            case 39: // Right arrow
                this.keyPressed = KEY_RIGHT;
                break;
            case 27: case 81: // ESC or Q key
                this.pauseOrResume();

            }
        }
    }

    /**
    * Checks the position on the screen that the user is touching
    * @param evt {Event} Screen touch event
    * @returns {*} Position on the screen that the user is touching
    */

    getTouches (evt) {
        return evt.touches || evt.originalEvent.touches;
    }

    /**
    * Handles the screen touch event
    * @param evt {Event} Screen touch event
    */

    handleTouchStart (evt) {
        const firstTouch = this.getTouches(evt)[0];

        this.xDown = firstTouch.clientX;
        this.keyPressed = KEY_SHOOT;
    }

    /**
    * Handles the finger drag event on the screen
    * @param evt {Event} Finger drag event on the screen
    */

    handleTouchMove (evt) {
        if (!this.xDown) {
            return;
        }
        const xUp = evt.touches[0].clientX,
            xDiff = this.xDown - xUp;

        if (xDiff > MIN_TOUCHMOVE) { /* Left swipe */
            this.keyPressed = KEY_LEFT;
        } else if (xDiff < -MIN_TOUCHMOVE) { /* Right swipe */
            this.keyPressed = KEY_RIGHT;
        } else {
            this.keyPressed = KEY_SHOOT;
        }
        this.xDown = null; /* Reset values */
    }

    /**
    * Checks if the main character and the opponent have collided with each other or with the shots using the hasCollision method
    */

    checkCollisions() {
        let impact = false;
    
        
        this.opponentShots.forEach(shot => {
            impact = impact || this.hasCollision(this.player, shot);
        });
    
        if (impact) {
            this.player.collide();
        }
    
        
        this.opponents.forEach(opponent => {
            if (this.hasCollision(this.player, opponent)) {
                this.player.collide();
            }
    
            
            let killed = false;
            this.playerShots.forEach(shot => {
                if (this.hasCollision(opponent, shot)) {
                    killed = true;
                }
            });
            if (killed) {
                opponent.collide();
            }
        });
    }
    

   /**
    * Checks if two game elements are colliding
    * @param item1 {Entity} Game element 1
    * @param item2 {Entity} Game element 2
    * @returns {boolean} Returns true if they are colliding and false if not.
    */

    hasCollision (item1, item2) {
        if (item2 === undefined) {
            return false; // When opponent is undefined, there is no collision
        }
        const b1 = item1.y + item1.height,
            r1 = item1.x + item1.width,
            b2 = item2.y + item2.height,
            r2 = item2.x + item2.width;

        if (b1 < item2.y || item1.y > b2 || r1 < item2.x || item1.x > r2) {
            return false;
        }

        return true;
    }

    /**
     * End the game
     */
    endGame(playerWon) {
        clearInterval(this.timer);
        const endGameImage = document.createElement('img');
        endGameImage.id = 'end-game-image';
        endGameImage.src = playerWon ? 'assets/you_win.png' : 'assets/game_over.png';
        document.body.appendChild(endGameImage);
        this.ended = true;
    }
    
    
   

    /**
     * Reset the game
     */
     resetGame () {
       document.location.reload();
     }

    /**
     * Update the game elements
     */
    update() {
        if (!this.ended) {
            this.player.update();
            
           
            if (this.opponents.length === 0) {
                this.opponents = [new Opponent(this)];  
            }
    
           
            this.opponents.forEach(opponent => opponent.update());
            
            
            this.playerShots.forEach(shot => shot.update());
            this.opponentShots.forEach(shot => shot.update());
            
            this.checkCollisions();
            this.render();
        }
    }
    
    
    
    /**
     * Display all the game elements on the screen
     */
    render() {
        this.player.render();
    
        
        this.opponents.forEach(opponent => opponent.render());
    
      
        this.playerShots.forEach(shot => shot.render());
        this.opponentShots.forEach(shot => shot.render());
    }
    
    
    updateScore() {
        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.innerText = `Score: ${this.score}`;
        }
    }
    updateLives() {
        const livesElement = document.getElementById("lives");
        if (livesElement) {
            livesElement.innerText = `Lives: ${this.player.lives}`;
        }
    }
   
}
