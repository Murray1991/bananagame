function Hero(heroImage) {
    
    
    var indexFrame = {x:0 , y:0};
    var frameNumber = 14;
    var rowNum = 2;
    var animationRate = 25;
    var maxvel = 5;
    var jumpvel = 9.3;
    var kbMng = new keyboardManager();
    this.inMove = false;
    this.direction = "right";
    this.grounded = false;
    kbMng.startListeners();
    
    var runningImage = heroImage;
    var relax = relaxImage; 
    var jumpImage = [jumpUpImage, jumpDownImage];
    this.heroImage = heroImage;
    this.marginX = 17;
    this.marginY = 10;
    
    this.height = 64;
    this.width = 64;
    
    //TOFIX for y values
    this.next = function() {
        if (this.inMove || currentStateGame == STATE_MENU) {    //brutta introduzione del test cSG == STATE_MENU
            this.heroImage = runningImage;
            frameNumber = 14;
            if (this.direction == "right") {
                indexFrame.y = 0;
            } else {
                indexFrame.y = 1;
            }
            indexFrame.x = (indexFrame.x+1)%frameNumber;
        } else {
            this.heroImage = relaxImage;
            frameNumber = 8;
            if (this.direction == "right") {
                indexFrame.y = 0;
            } else {
                indexFrame.y = 1;
            }
            indexFrame.x = (indexFrame.x+1)%frameNumber;
        }

        if (!this.grounded) {
            frameNumber = 14;
            this.heroImage = runningImage;
            indexFrame.x = 5;
        }
    }
    
    this.draw = function(x,y,ctx){
        ctx.drawImage(this.heroImage, indexFrame.x*this.heroImage.width/frameNumber, indexFrame.y*this.heroImage.height/rowNum, this.heroImage.width/frameNumber, this.heroImage.height/rowNum, x, y, this.height, this.width);
    }
    
    var collideBehavior = (function (that){
        var behavior = {
            execute: function(anObj) {
                for (var i=0; i<tiles.length; i++){
                    anObj.collide(tiles[i]);
                }
                //for (var i=0; i<boxes.length; i++){
                //    
                //}
                
                //for (var i=0; i<enemies.length; i++) {
                //    if (anObj.collide(enemies[i])) {
                //        //died
                //    }
                //}
                //
                //for (var i=0; i<stars.length; i++){
                //    if (anObj.collide(stars[i])) {
                //        //point!
                //    }
                //}
            }
        };
        
        return behavior;
    })(this);

    
    this.behaviors = [runBehavior(animationRate,this), moveBehavior(maxvel,jumpvel, this)];
}