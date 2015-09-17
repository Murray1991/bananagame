var images = [];
var dir = "images/fischio/";
var num=8;

function loadImages() {
        for (var i=0; i<num; i++) {
            images.push(new Image());
            var name = parseInt(i)+1;
            images[i].src = dir+name+".png";
            console.log(images[i]);
        }
        
        images[num-1].addEventListener("load",start,false);
}

function start() {
//console.log("...."+images[0].height);
var mycanvas = document.createElement("canvas");
mycanvas.id = "mycanvas";
mycanvas.height = images[0].height * 2;
mycanvas.width = images[0].width * images.length;
var myctx = mycanvas.getContext("2d");

for (var i=0; i<images.length; i++) {
    myctx.drawImage(images[i], i*images[0].width, 0);
}

myctx.save();
myctx.translate(mycanvas.width, mycanvas.height/2);
myctx.scale(-1,1);
for (var i=images.length-1, j=0; i>=0; i--,j++) {
    myctx.drawImage(images[i], j*images[0].width ,0);
}
myctx.restore();

var img = document.createElement("img");
img.src = mycanvas.toDataURL("image/png");
document.body.appendChild(img);
}

loadImages();