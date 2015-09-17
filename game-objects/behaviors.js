function runBehavior(animationRate,that){
    return {
        lastUpdateTime: 0,
        nowTime: 0,
        delta: 0,
        
        //TOFIX: changing tab it goes too fast!!
        execute: function (anObj, deltaTime, fps) {
            var rate = (that.inMove || currentStateGame == STATE_MENU)? animationRate : animationRate/2;    //brutta introduzione del test cSG == STATE_MENU
            
            this.nowTime = Date.now();
            if (this.lastUpdateTime > 0) {
                this.delta += this.nowTime - this.lastUpdateTime;
            }
            
            if (this.delta < 1000/rate){
                this.lastUpdateTime = this.nowTime;
            } else {
                that.next();
                this.lastUpdateTime = 0;
                this.nowTime = 0;
                this.delta = 0;
            }
        }
    };
}

function moveBehavior(maxvel,jumpvel, that){
    var behavior = {
        kbMng: new keyboardManager(),
        
        execute: function (anObj, deltaTime, fps) {
            var velx = maxvel,//maxvel*50/fps,
                vely = jumpvel;

            

            if ((this.kbMng.keysList[38] || this.kbMng.keysList[87]) && anObj.grounded) { //jump
                playSound(wavJump, 0.3);
                anObj.velY = -vely;
                anObj.grounded = false;
            }
            
            if (this.kbMng.keysList[37] || this.kbMng.keysList[65]) { //left
                that.direction = "left";
                anObj.turnLeft(velx);   //velocity?
            }
            
            if (this.kbMng.keysList[39] || this.kbMng.keysList[68]) { //right
                that.direction = "right";
                anObj.turnRight(velx);  //velocity?
            }
            
            if (!this.kbMng.keysList[39] && !this.kbMng.keysList[37] && !this.kbMng.keysList[68] && !this.kbMng.keysList[65]){
                that.inMove = false;
                anObj.inMove = false;
            }
            else {
                that.inMove = true;
                anObj.inMove = true;
                //hero.direction = keysList[39] || keysList[68]? 'right' : 'left';
            }
        }
    };
    
    behavior.kbMng.startListeners();
    return behavior;
}

function bounceBehavior() {
    
}

function idleBehavior(){
    
}

function jumpBehavior(){
    
}

function doubleJumpBehavior(){
    
}

function fallBehavior(){
    
}