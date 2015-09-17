function Tile(x,y,img) {
    this.x = x;
    this.y = y;
    this.height = 50;
    this.width = 50;
    this.type = "tile";
    this.marginX=3;
    this.marginY=3;
    this.image = img.src;
    
    var image = img;
    
    this.render = function(ctx){
        ctx.drawImage(image, image.x, image.y, image.width, image.height, this.x, this.y, this.width, this.height);
    }
}

function Box() {
    var image = boxImage;
    var deg = 0;
    this.height = 50;
    this.width = 50;
    this.marginX = 3;
    this.marginY = 3;
    
    this.draw = function(x,y,ctx){
        ctx.save();
        ctx.translate(x+this.width/2, y+this.height/2);
        if (mode == "arcade")
            ctx.rotate(-deg*(Math.PI/180));
        else
            ctx.rotate(deg*(Math.PI/180));
        ctx.drawImage(image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }

    var prima = 0;
    var fallingBehavior =  {
        execute: function(anObj){
            ctx.save();
            if (!anObj.grounded) {
               
                if (anObj.velX > 0) {
                    deg = +((Math.abs(deg) + 5)%360);
                    prima = 1;
                } else if (anObj.velX < 0) {
                    deg = -((Math.abs(deg) + 5)%360);
                    prima = -1;
                } else {
                    switch (prima) {
                        case -1:
                            deg = -((Math.abs(deg) + 5)%360);
                            break;
                        case 1:
                            deg = +((Math.abs(deg) + 5)%360);
                            break;
                    }
                }
            }else if (anObj.grounded) {
                //console.log(Math.abs(deg));
                if (!(Math.abs(deg) == 0 || Math.abs(deg) == 90 || Math.abs(deg) == 180 || Math.abs(deg) == 270 || Math.abs(deg) == 360)) {
                    
                    var v= Math.abs(deg),
                        a = v-0,
                        b = v-90,
                        c = v-180,
                        d = v-270,
                        e = v-360,
                        min = a,
                        values = [a,b,c,d,e];

                    for (var i=0; i<values.length; i++){
                        min = (Math.abs(values[i])<Math.abs(min))? values[i]: min;
                    }
                    
                    if (v == 45 || v == 135 || v == 225 || v == 315) {
                        switch (prima) {
                            case -1:
                                deg = deg + 10; //mi sembra piu' verosimile così...
                                break;
                            case 1:
                                deg = deg - 10;
                                break;
                        }
                    } else if ((min < 0 && deg > 0) || (min > 0 && deg < 0)){
                        deg = (deg+5)%360;
                    } else {
                        deg = (deg-5)%360;
                    }
                } else {
                    prima = 0;
                }
            }
            ctx.restore();
        }
    }
    
    var moveBehavior = {
        execute: function(anObj){
            //collision behaviour


            for (var i=0; i<tiles.length; i++){
                var dir = anObj.collide(tiles[i]);
            }
        }
    }
    this.behaviors = [moveBehavior, fallingBehavior];

}