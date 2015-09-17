function Star(){
    this.width = 32;
    this.height = 32;
    
    this.draw = function(x,y,ctx) {
        ctx.drawImage(starImage,x,y,this.width, this.height);
    }
}