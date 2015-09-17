function AnimatedObject(x,y,type,character) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.height = character.height;
    this.width = character.width;
    this.type = type || null;
    this.character = character || undefined;
    this.visible = true;
    this.velX = 0;
    this.velY = 0;
    this.inMove = false;
    this.grounded = false;
    //this.onJump = false;
    
    var friction = 0.8; //TO SEE
    var gravity = 0.4; //TO SEE
    
    this.collide = function(shape){
        if (this.x + this.width < shape.x) {
            return null;
        }

        var scaleFactor = lastLevelPlayed.matrix.a;
        
        var dx = (parseInt(this.x) + this.width/2) - (parseInt(shape.x) + shape.width/2);
        var dy = (parseInt(this.y) + this.height/2) - (parseInt(shape.y) + shape.height/2);
        var dir = null;
        
        var offs_x = (shape.character != undefined)? this.width/2 + shape.width/2 - Math.abs(dx) - character.marginX - shape.character.marginX : this.width/2 + shape.width/2 - Math.abs(dx) - character.marginX;
        var offs_y = (shape.character != undefined)? this.height/2 + shape.height/2 - Math.abs(dy) - character.marginY - shape.character.marginY : this.height/2 + shape.height/2 - Math.abs(dy) - character.marginY;

        if (offs_x >= 0 && offs_y >= 0) {
          if (shape.type === "tile" || shape.type === "box") {
            
            if (offs_x >= offs_y) {
                if (dy > 0 ) {
                    dir = "top";
                    if (this.type != "box"){
                        if (offs_x > 5) {
                            this.y += offs_y;
                            this.velY = +2; //TOCHECK
                            
                        }
                        this.grounded = false;
                    }
                } else {

                    dir = "bottom";

                    if (offs_x > 5) {
                        this.y -= offs_y;
                        this.grounded = true;
                        this.velY = 0; //TOCHECK
                    }
                }
            }
            else {
                if (dx > 0) {
                    dir = "left";
                    //if (shape.type == "tile" || this.type == "enemy" || this.type == "enemy1") {
                    //    this.x += offs_x;
                    //}
                    this.x += offs_x;
                    if (this.type == "hero" && shape.type == "box" && this.inMove) {
                        
                        shape.inMove = true;
                        //shape.x -= offs_x;  //?
                        this.velX = (mode == "puzzle")? -3: 3;
                        this.velX = this.velX*50/fps;
                    }else if (shape.type == "box" && !this.inMove && this.type == "hero") {
                        
                        shape.inMove = false;
                    }
                } else {
                    dir = "right";
                    //if (shape.type == "tile" || this.type == "enemy" || this.type == "enemy1") {
                    //    this.x -= offs_x;
                    //}
                    this.x -= offs_x;
                    if (this.type == "hero" && shape.type == "box" && this.inMove) {
                        
                        shape.inMove = true;
                        //shape.x += offs_x;  //?
                        this.velX = (mode == "puzzle")? 3: -3;
                        this.velX = this.velX*50/fps;
                    } else if (shape.type == "box" && !this.inMove && this.type == "hero") {
                        
                        shape.inMove = false;
                    } 
                } 
                if (shape.type == "tile") this.velX = 0;  //TOCHECK
            } 
          } else if (shape.type == "star") {
            dir = true;
          } else if (shape.type == "enemy1" || shape.type == "enemy") {
            dir = true;
          }
        } else if (shape.type == "box") {
            shape.inMove = false;
        } 
        
        this.character.grounded = this.grounded;
        return dir; //null means no collision
    }
    
    this.turnLeft = function(maxvel){
        if (mode == "puzzle" && this.velX > -maxvel) {
            this.velX--;
        } else if (mode == "arcade" && this.type == "hero" && this.velX < maxvel) {
            
            this.velX++;
            //midLayer.update(-1.3);
        }
    }
    
    this.turnRight = function(maxvel){
        if (mode == "puzzle" && this.velX < maxvel) {
            this.velX++;
        } else if (mode == "arcade" && this.type == "hero" && this.velX > -maxvel) {
            
            this.velX--;
            //midLayer.update(1.3);
        }
    }
    
    this.render = function(ctx){
        if (this.character && this.visible) {
            this.character.draw(this.x, this.y, ctx);
        }
    }
    
    var oldX = this.x;
    this.update = function() {

        //TOFIX hero, a pressione ripetuta di <- o -> su box o tile immobile trasla il contesto.
        for (var i=0; i<character.behaviors.length; i++) {
            character.behaviors[i].execute(this, undefined, fps);
        }
        
        if (!this.inMove) {
            oldX = this.x;

            this.velX *= friction;
            
            //TO REVIEW
            if (this.velX < 0.5 && this.velX > -0.5) {
                this.velX = 0;
            }
        }
       
        if (mode == "puzzle" && (this.type == "hero" || this.type == "box")) {
            this.x = parseFloat(this.x) + parseFloat(this.velX);
        } else if (mode == "arcade" && (this.type == "hero" || this.type == "box")) {
            //oldX = this.x;
            this.x = parseFloat(this.x) + parseFloat(-this.velX);
            
            if (oldX != this.x && this.type == "hero") {   //forse qui
                //ctx.save();
                ctx.translate((oldX - this.x) ,0);
                oldX = this.x;
                //ctx.restore();
                
            }
        }

        this.y = parseInt(this.y) + parseInt(this.velY);
        
        //g = 9.8 m/s*s, m = 50 px
        //v = v0 + g*t => v += g*dt
        this.velY += gravity;
    }
}