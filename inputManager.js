function keyboardManager() {
    //for tracking multiple keys
    this.keysList = [];
    var that = this;
    
    this.startListeners = function(evt) {
        document.body.addEventListener("keydown", function(evt) { that.keysList[evt.keyCode] = true; /*Debugger.log(evt.keyCode+" down");*/});
        document.body.addEventListener("keyup", function(evt) { that.keysList[evt.keyCode] = false; /*Debugger.log(evt.keyCode+" up");*/});
    }
    
    this.removeListeners = function(evt) {
        
    }
}

var mouseX;
var mouseY;

function mouseManager() {
    var that = this;
    
    this.startListener = function(evt, callback) {
        document.body.addEventListener("mousedown", function(evt) {console.log("mouse x:"+(evt.clientX - canvas.offsetLeft)+" , mouse y:"+evt.clientY+" , offset left: "+canvas.offsetLeft)});
    }
}