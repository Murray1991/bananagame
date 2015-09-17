function createCloud(layer) {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    // draw cloud
    context.beginPath();
    context.moveTo(170, 80);
    context.bezierCurveTo(130, 100, 130, 150, 230, 150);
    context.bezierCurveTo(250, 180, 320, 180, 340, 150);
    context.bezierCurveTo(420, 150, 420, 120, 390, 100);
    context.bezierCurveTo(430, 40, 370, 30, 340, 50);
    context.bezierCurveTo(320, 5, 250, 20, 250, 50);
    context.bezierCurveTo(200, 5, 150, 20, 170, 80);
    context.closePath();
    context.lineWidth = 5;
    context.fillStyle = '#8ED6FF';
    context.fill();
    context.strokeStyle = '#0000ff';
    context.stroke();

    // save canvas image as data url (png format by default)
    var dataURL = canvas.toDataURL();

    // set canvasImg image src to dataURL
    // so it can be saved as an image
    document.getElementById('canvasImg').src = dataURL;
}


function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.stroke();
}
  
  
function cloudStar(ctx, s, ang) {
    
    var tx = parseInt(s.x) + parseInt(s.width/2),
        ty = parseInt(s.y) + parseInt(s.height/2);
    
    ctx.save();
    
    if (!s.beText){
      console.log("nuvoletta");
      var m = lastLevelPlayed.matrix;
      ctx.translate(tx,ty);
      ctx.rotate(ang*(Math.PI/180));
      ctx.fillStyle = 'rgb(250,250,250)';
      //ctx.save();
      //ctx.scale(1/m.a, 1/m.d);
      drawEllipse(ctx,-s.width/2,-s.height/2,s.width,8*(s.width/9));
      ctx.fill();
      //ctx.restore();
    } else {
      var m = lastLevelPlayed.matrix;
      ctx.translate(tx,s.ty);
      s.alpha -= 0.03;
      s.ty -= s.vy;
      ctx.save();
      ctx.scale(1/m.a, 1/m.d);
      ctx.font = 'bold 20pt badaboom';
      ctx.strokeStyle = 'rgba(255,255,0'+s.alpha+')';
      ctx.fillStyle = 'rgba(255,255,255,'+s.alpha+')';
      ctx.textAlign = "center";
      ctx.strokeText("YEA", 0,0);
      ctx.fillText("YEA", 0,0);
      ctx.restore();
    }
    ctx.restore();
}

//argument is star...
function catchedStar(star,pos) {
    //delete taken stars from stars array
    stars.splice(pos,1);
    //push taken star in stars_catched array
    stars_catched.push(star);
    //set timelife of cloud star
    setTimeout(function(){
      star.beText = true;
      star.alpha = 1;
      star.vy = 2;
      star.ty = parseInt(star.y) + parseInt(star.height/2);
      setTimeout(
        function(){star.beText = false; stars_catched.splice(0,1);},
        700
      );
      
    },20)
}