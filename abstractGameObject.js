//Type-Based inheritance works with constructor functions instead of objects, which means you need access
//to the constructor function of the object you want to inherit from

var gameObject = function(x, y, width, height, type, image){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type || undefined;
    this.image = image || undefined;
    
    var c = 102114;

}
//draw method
gameObject.prototype.draw = function(){
    if (this.image != "undefined") {
        ctx.drawImage(this.image, this.image.x, this.image.y, this.image.width, this.image.height, this.x, this.y, this.width, this.height);
    }
}
//toString method
gameObject.prototype.print = function(){
    return "[x:"+this.x+", y:"+this.y+", width:"+this.width + ", height:" +this.height + ", type:" + this.type +", image:" +this.image + "---"+"]";
}

//game_object soggetti alla fisica del mondo e movibili
var movableGameObject = function(x,y,width,height,type, image, _maxvel){
    gameObject.call(this,x,y,width,height,type,image);
    
    //attributes
    this.onMovement = false;
    this.grounded = false;
    this.velX = 0;
    this.velY = 0;
    
    var maxvel = _maxvel;
    var gravity = .3;
    var friction = .8;
    
    //methods
    this.print = function(){
        console.log(gameObject.prototype.print.call(this)+"eheheheheh");
        //console.log("eheheheh");
    }
    
    this.moveLeft = function(maxvel){
        if (this.velX > -maxvel) {
            this.velX--;
        }
    }
    
    this.moveRight = function(maxvel){
        if (this.velX < maxvel) {
            this.velX++;
        }
    }
    
    this.collide = function(shape){
        if (this.x + this.width < shape.x) {
            return null;
        }
        
        var dx = (this.x + this.width/2) - (shape.x + shape.width/2);
        var dy = (this.y + this.height/2) - (shape.y + shape.height/2);
        var offs_x = this.width/2 + shape.width/2 - Math.abs(dx) - character.marginX;
        var offs_y = this.height/2 + shape.height/2 - Math.abs(dy) - character.marginY;
        var dir = null;
        
        if (offs_x >= 0 && offs_y >= 0) {
          if (shape.type === "tile") {        
            if (offs_x >= offs_y) {
                if (dy > 0 ) {
                    dir = "top";
                    this.y += offs_y;
                } else {
                    dir = "bottom";
                    this.y -= offs_y;
                    this.grounded = true;
                }
                this.velY = 0; //TOCHECK
            }
            else {
                if (dx > 0) {
                    dir = "left";
                    this.x += offs_x;
                } else {
                    dir = "right";
                    this.x -= offs_x;
                }
                this.velX = 0;  //TOCHECK
            }  
          } else if (shape.type == "star") {
            dir = true;
          }
        }
        return dir; //null means no collision
    }
    
    this.update = function() {    
        //for (var i=0; i<character.behaviors.length; i++) {
        //    character.behaviors[i].execute(this);
        //}
        this.x += this.velX;
        this.y += this.velY;
        
        if (!this.inMove) {
            this.velX *= friction;
            
            //TO REVIEW
            if (this.velX < 0.5 && this.velX > -0.5) {
                this.velX = 0;
            }
        }
        
        this.velY += gravity;
    }
}

movableGameObject.prototype = Object.create(gameObject.prototype);

var some = new movableGameObject(50,50,50,50,"something",undefined,5);
some.print();


//var animatedGameObject = function(x,y,width,height,image){
//    gameObject.call(this,x,y,width,height,image);
//    
//    
//    this.moveLeft = function() {console.log("move left");}
//    this.moveRight = function() {console.log("move right");}
//}
//animatedGameObject.prototype = Object.create(gameObject.prototype);
//
//var spriteGameObject = function(x,y,width,height, image, fps){
//    animatedGameObject.call(this,x,y,widht,height,image);    
//}
//spriteGameObject.prototype = Object.create(animatedGameObject.prototype);


//Object-Based inheritance or prototypal inheritance: one object inherits from another without invoking a function constructor
//var person = {
//    name: "Pino",
//    getName: function(){return this.name;}
//}
//
//console.log("________________ prove... _________________");
//console.log(person.getName());
//
//var otherPerson = Object.create(person);
//
//person.name = "somosmomo";
//otherPerson.name = "gigi";
//
//console.log("person:"+person.getName());
//console.log("otherPerson:"+otherPerson.getName());
//
/////////////////////////////////////////////////////////////////////////////////////////////////
//
//// game objects prototypes
//var gameObject = {
//    create: function(x, y, width, height) {
//        var self = Object.create(this);
//        self.x = x;
//        self.y = y;
//        self.width = width;
//        self.height = height;
//        //self.image = image;
//        return self;
//    },
//    
//    print: function() {
//        console.log("x: "+this.x+", y: "+this.y+", height: "+this.height+", width: "+this.width);
//    }
//}
//
//var animatedGameObject = Object.create(gameObject, {
//    create: {       //create method
//        value: function(x,y,width,height) {
//            return gameObject.create.call(this,x,y,width,height);
//        }
//    },
//    
//    moveLeft: {     //moveLeft method
//        value: function() {
//        
//        }
//    },
//    
//    moveRight: {    //moveRight method
//        value: function() {
//        
//        }
//    }
//});
//
//var counter = (function() {
//    var that = Object.create(gameObject, {
//        c: {value:0,writable:true},
//        create: {
//            value: function(x,y,width,height) {
//                this.c=0;
//                return gameObject.create.call(this,x,y,width,height);
//            }
//        },
//        count: {
//            value: function(){
//                this.c = this.c+1;
//                return this.c;
//            }
//        }
//    });
//    return that;
//})();
//
//var spriteGameObject = {
//    create: function() {
//        
//    },
//    
//    nextFrame: function() {
//        
//    }
//}
//
//var some = gameObject.create(100,150, 64, 64);
//var some2 = animatedGameObject.create(5,5,5,5);
//some.print();
//some2.print();
//var counter2 = counter.create(100,150,64,64);
//var counter3 = counter.create(100,150,64,64);
//
//console.log(counter2.count());
//counter2.c = 5;
//console.log(counter2.count());
//console.log(counter3.count());
//functional inheritance approach
//
//var gameObject = function(X,Y) {
//    var that = {
//        x: X,
//        y: Y
//    };
//    return that;
//}

//function gameObject(X,Y) {
//    this.x = X;
//    this.y = Y;
//}
//
//function animatedGameObject(X,Y){
//    
//    animatedGameObject.prototype = gameObject(X,Y);    
//}
//animatedGameObject.prototype.getX = function() {return this.x};
//animatedGameObject.prototype.getY = function() {return this.y};
//
//var something = new animatedGameObject(5,10);
//var someelse = new gameObject(15,20);
//console.log(something.getX());
//console.log(something.getY());
//console.log(someelse.getX());