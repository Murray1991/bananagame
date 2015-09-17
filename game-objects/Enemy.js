//Enemy is a character of AnimatedObject
//Enemy1 (maybe there will be other types of enemy) is an apple, not sprite image, is animation is rotation
function Enemy1(enemyImage, from, to, velAng) {
    var dir_enemyImage = enemyImage || {r:enemyImage1, l:enemyImage1_left};
    this.enemyImage = dir_enemyImage.r;
    this.from = from || 0;
    this.to = to || 0;
    this.width = 48;
    this.height = 48;
    this.inMove = true; //always for now, but TOFIX
    
    //sucking attributes
    this.marginX = 10; //??
    this.marginY = 10; //??
    this.dir = 1;
    
    var fps = 50;
    this.velAng = velAng || 1 //in giri al secondo, nel caso velAng sia 2 allora dO/dt = 2*2*pi = 4*pi in rad/sec oppure 640 gradi al sec
    this.rotation = this.velAng*2*Math.PI/fps;
    this.velX = velAng*2*Math.PI*this.width/2; //tangent velocity = velAng * r
    var angle = 0;
    
    //draw method invoked by AnimatedObject
    this.draw = function(x,y,ctx) {
        ctx.save();
        ctx.translate(x+this.width/2 , y+this.height/2);
        ctx.rotate(angle);
        if (this.enemyImage != undefined) {
            ctx.drawImage(this.enemyImage, -this.width/2, -this.height/2, this.width, this.height);
        } else {
            console.log(this.enemyImage + "is undefined");
        }
        ctx.restore();
    }
    
    //change angle in function of angular velocity
    /* If velAng = 2*pi rad/sec = 720 degree/sec and we have framerate = 25 fps, we have that angle change at discrete intervals
     * of length 1/25 sec. Rotation for each interval is +/- velang * (1/framerate) = velang/framerate    
     */
    this.next = function() {
        angle += this.dir*this.rotation%2*Math.PI;
        //console.log("it's me! an enemy! from is "+this.from + " to is " + this.to);
    }

    var moveBehavior = (function(that, maxvel){
        var direction = false; //false is left, true is right
        var behavior ={
            start: true,
            print: function(){console.log("moveBehavior from "+that.from+" to "+that.to);},
            execute: function(anObj) {  //TOFIX
                //go to start
                if (this.start) {
                    anObj.x = that.from;
                    direction = (that.from < that.to)? true : false;
                    if (that.from == that.to) {
                        return;
                    }
                    this.start = false;
                    //console.log()
                }
                
                if (direction) {
                    anObj.x = parseFloat(anObj.x) + parseFloat(that.velX/fps);   //??------------> non sono sicuro che sia corretto, matematicamente parlando dividere per il framerate
                    that.dir = +1;
                    //console.log("dx");
                } else {                        //--------------> POTREI INCAPSULARE moveBehavior nel metodo next
                    anObj.x -= that.velX/fps;   //??
                    that.dir = -1;

                }

                if ((anObj.x > that.to && anObj.x > that.from) || (anObj.x < that.to && anObj.x < that.from)) {
                    direction = (direction)? false: true;
                }
                
                //collision behaviour
                for (var i=0; i<tiles.length; i++){
                    velY = anObj.velY; //vel in y before collision
                    var dir = anObj.collide(tiles[i]);
                    
                    if (dir == "bottom") {
                        //ball.y = canvas.height - ball.r; ball.vy = -Math.abs(ball.vy); ball.vy *= ball.elasticy;
                        anObj.velY = -Math.abs(velY);
                        anObj.velY *= 0.5; //elasticity factor for tile
                    }
                    
                    if (velY < 0.5) {
                        if (dir == "right") {
                            direction = false;
                        } else if (dir == "left") {
                            direction = true;
                        }
                    }
                    
                }
                for (var i=0; i<boxes.length; i++){
                    velY = anObj.velY;
                    var dir = anObj.collide(boxes[i]);
                    
                    if (dir == "bottom") {
                        //ball.y = canvas.height - ball.r; ball.vy = -Math.abs(ball.vy); ball.vy *= ball.elasticy;
                        anObj.velY = -Math.abs(velY);
                        anObj.velY *= 0.55; //elasticity factor for box
                    }
                    
                    if (velY < 0.05) {
                        if (dir == "right") {
                            direction = false;
                        } else if (dir == "left") {
                            direction = true;
                        }
                    }
                }
                that.enemyImage = (direction)? dir_enemyImage.r : dir_enemyImage.l;
            }
        };
        return behavior;
    })(this, this.velX);
    
    this.behaviors = [runBehavior(fps,this), moveBehavior];
}



//(new Enemy1(undefined, 50, 100)).moveBehavior.print();