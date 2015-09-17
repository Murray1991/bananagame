var utils = {
    ns: "http://www.w3.org/2000/svg",
    
    createSVGRect: function(x,y,w,h,rx,ry, style){
        var p_rx = rx || 0,
            p_ry = ry || 0,
            rect = document.createElementNS(this.ns, "rect");
        
        rect.setAttributeNS(null, "x", x);
        rect.setAttributeNS(null, "y", y);
        rect.setAttributeNS(null, "height", h);
        rect.setAttributeNS(null, "width", w);
        
        rect.setAttributeNS(null, "rx", p_rx);
        rect.setAttributeNS(null, "ry", p_ry);
        if (style) {
            rect.setAttributeNS(null, "style", style);
        }
        
        return rect;
    },
    
    createSVGText: function(x,y, name, fontsize, style){
        var text = document.createElementNS(this.ns, "text"),
            textNode = document.createTextNode(name);
            
        text.setAttributeNS(null, "x", x);
        text.setAttributeNS(null, "y", y);
        text.setAttributeNS(null, "font-family", "Verdana");    //default
        text.setAttributeNS(null,"text-anchor","middle");       //default
        //text.setAttributeNS(null, "font-size", fontsize);
        if (style) {
            text.setAttributeNS(null, "style", style);
        }
        text.appendChild(textNode);
        
        return text;
    },
    
    createSVGGroup: function(id, _class){
        var group = document.createElementNS(this.ns, "g");
        if (id) {
            group.id = id;
        }
        
        if (_class) {
            group.setAttributeNS(null,"class",_class);
        }
        
        return group;
    },
    
    createSVGButton: function(name,fontsize,x,y,w,h,rx,ry,classname){  //TODO passing callbacks for mouseover, mouseout, mousedown actions
        var g = utils.createSVGGroup();
            rect = utils.createSVGRect(x,y,w,h,rx,ry),
            text = utils.createSVGText(x+w/2,y+h/2,name,fontsize,"pointer-events:none");
        
        g.id = name;
        if (classname) {
            g.setAttributeNS(null, "class", classname);
        }
        
        g.appendChild(text);
        g.appendChild(rect);
        
        return g;
    },
    
    createSVGImageButton: function(src,x,y,w,h,style, classname, id){  //TODO passing callbacks
        var button = document.createElementNS(this.ns, "image");
        
        button.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);
        button.setAttributeNS(null,"x",x);
        button.setAttributeNS(null,"y",y);
        button.setAttributeNS(null,"width",w);
        button.setAttributeNS(null,"height",h);
        if (classname) {
            button.setAttributeNS(null,"class",classname);
        }
        
        if (id) {
            button.setAttributeNS(null,"id",id);
        }
        
        if (style) {
            button.setAttributeNS(null,"style",style);
        }
        
        return button;
    },
    
    getSVGTranslateX: function(svg_obj){
        var xforms = svg_obj.transform.baseVal; // An SVGTransformList
        var firstXForm = xforms.getItem(0);       // An SVGTransform
        if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE){
            var firstX = firstXForm.matrix.e;
            //firstY = firstXForm.matrix.f;
        }
        return firstX;
    },
    
    getSVGTranslateY: function(svg_obj){
        var xforms =svg_obj.transform.baseVal; // An SVGTransformList
        var firstXForm = xforms.getItem(0);       // An SVGTransform
        if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE){
            //var firstX = firstXForm.matrix.e;
            var firstX = firstXForm.matrix.f;
        }
        return firstX;
    },
    
    setSVGTranslate: function(svg_obj, x, y){
        svg_obj.transform.baseVal.getItem(0).setTranslate(30,100);
    },
    
    getSVGScale: function(svg_obj) {
        var xforms = svg_obj.transform.baseVal,
            scndXForm = xforms.getItem(1),
            first, second;
        if (scndXForm.type == SVGTransform.SVG_TRANSFORM_SCALE) {
            console.log("c'e'!");
            first = scndXForm.matrix.a;
            second = scndXForm.matrix.d;
        }
        return {a: first, d: second};
    },
    
    setSVGScale: function(svg_obj, value) {
        svg_obj.transform.baseVal.getItem(0).setScale(value, value);
        //svg_obj.transform.baseVal.getItem(0).matrix.d = value;
    },
    
    getTransformMatrix: function(svg_obj) {
        return svg_obj.transform.baseVal.getItem(0).matrix;
    },
    
    setTransformMatrix: function(someitem,t) {
        someitem.transform.baseVal.getItem(0).setMatrix(t);
    },
    
    printMatrix: function(matrix){
        console.log(matrix.a + " " + matrix.b + " " + matrix.c + " " + matrix.d + " " + matrix.e + " " + matrix.f);
    }
}


//// Getting
//var xforms = myElement.transform.baseVal; // An SVGTransformList
//var firstXForm = xforms.getItem(0);       // An SVGTransform
//if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE){
//  var firstX = firstXForm.matrix.e,
//      firstY = firstXForm.matrix.f;
//}
//
//// Setting
//myElement.transform.baseVal.getItem(0).setTranslate(30,100);







function setCSSProperty(nameElement, typeElement, innerCSS){
    switch (typeElement) {
        case "id":
            document.getElementById(nameElement).setAttribute("style", innerCSS);
            break;
        case "class":
            var elements = document.getElementsByClassName(nameElement);
            for (var i=0; i<elements.length; i++) {
                elements[i].setAttribute("style", innerCSS);
            }
            break;
    }
}

function onMouseOver(){
    this.setAttribute("x", this.getAttribute("x") - 5);
    this.setAttribute("y", this.getAttribute("y") - 5);
    this.setAttribute("width", parseInt(this.getAttribute("width"))+10);
    this.setAttribute("height", parseInt(this.getAttribute("height"))+10);
}

function onMouseOut() {
    this.setAttribute("x", parseInt(this.getAttribute("x")) + 5);
    this.setAttribute("y", parseInt(this.getAttribute("y")) + 5);
    this.setAttribute("width", this.getAttribute("width")-10);
    this.setAttribute("height", this.getAttribute("height")-10);
    
    console.log("mouseout");
}

function fadeOut(element) {
    var elements = document.getElementsByClassName(element);
    var p = function(progress) {
            return 0.5 - Math.cos(progress * Math.PI) / 2;
    }
    
    var op_start = parseFloat(elements[0].style.opacity); //initial opacity
    var timer = setInterval(function(){
        if (op_start > 0) {
            op_start -= p(0.2);
        } else {
            op_start = 0;
            clearInterval(timer);
        }
        for (i in elements)
            elements[i].style.opacity = op_start;
        },50);
}


function fadeIn(element,opacity_end){
    var elements = document.getElementsByClassName(element);
    var p = function(progress) {
            return 0.5 - Math.cos(progress * Math.PI) / 2;
    }
    var op_start = parseFloat(elements[0].style.opacity); //initial opacity
    var op_end = parseFloat(opacity_end);
    
    var timer = setInterval(function(){
        if (op_start < op_end) {
            op_start += p(0.2);
        } else {
            op_start = op_end;
            clearInterval(timer);
        }
        for (i in elements)
            elements[i].style.opacity = op_start;
        },100);
}

  // funzione distanza
  function distance (p,d) {
    return Math.sqrt(Math.pow(p.x - d.x, 2) + Math.pow(p.y - d.y,2));
  }
  
  
  
  
//-----------------------------QUI TUTTO DA PROVARE!!!!!!!!!! --------------------------------------  
            function createBeadSnow(locX, locY){
                var randomX = Math.random()*canvas.width;
                var randomY = Math.random()*canvas.height;
                var randomR = 1+(Math.random()*2)%3;    
                var randomW = (.5 + Math.random()*1.5)%1.5;   
                var randDir = (Math.random() - 0.5 < 0)? -1: 1;
                
                return {
                    x: locX || randomX,
                    y: locY || randomY,
                    radius: randomR,
                    weight: randomW,
                    dir: randDir
                }
            }
            //function render() {
            //    ctx.save();
            //    //ctx.fillStyle = "rgb(135, 206, 250)";
            //    ctx.fillStyle = "rgb(0, 0, 0)";
            //    ctx.fillRect(0,0,canvas.width, canvas.height);
            //    ctx.restore();
            //    
            //    ctx.save();
            //    ctx.fillStyle = "rgba(255,250,250,0.8)";
            //    drawBeads();
            //    ctx.restore();
            //}
            
            function drawBeads(beads) {
                ctx.save();
                ctx.fillStyle = "rgba(255,250,250,0.8)";
                
                ctx.beginPath();
                for (var i=0; i<beads.length; i++){
                    ctx.moveTo(beads[i].x, beads[i].y);
                    ctx.arc(beads[i].x, beads[i].y, beads[i].radius, 0, Math.PI*2, true);
                }
                ctx.fill();
                
                ctx.restore();
            }
            
            function updateBeads(beads) {
                for (var i= 0; i<beads.length; i++){
                    if (beads[i].y > canvas.height + beads[i].radius) {
                        beads[i].y = -beads[i].radius
                        beads[i].x = Math.random()*canvas.width*2 - canvas.width/2;
                        beads[i].radius = 1+(Math.random()*2)%3;
                        beads[i].weight = (.5 + Math.random()*1.5)%1.5;
                        beads[i].dir = (Math.random() - 0.5 < 0)? -1: 1;
                    }
                    
                    angle = 0.1;
                    beads[i].y += 1 + Math.cos(angle+beads[i].weight) + beads[i].radius/2;
                    beads[i].x += beads[i].dir * Math.sin(angle)*2;
                }
            }
            
            //animationLoop
            var lastRender;
            function snowFall(beads) {
                ctx.save();
                ctx.setTransform(1,0,0,1,0,0);
                if (!lastRender) {
                    lastRender = Date.now();
                    return;
                }
                
                var delta = Date.now() - lastRender;
                if (delta >= 1000/33) {
                    updateBeads(beads);
                    lastRender = Date.now();
                }
                drawBeads(beads);
                ctx.restore();
            }
            
            function initScenario() {
                var beads = [];
                var num_beads = 400;
                for (var i=0; i<num_beads; i++){
                    beads.push(createBeadSnow());
                    //printBeadSnow(beads[i]);
                }
                return beads;
            }
            
//------------------------------------------------------------------------------

//Spring Class LAMOLLA!!
var spring = function() {
        this.x = 0;
        this.y = 0;

        this.width = 26;
        this.height = 30;

        //Sprite clipping
        this.cx = 0;
        this.cy = 0;
        this.cwidth = 45;
        this.cheight = 53;

        this.state = 0;
        
        this.render = function(ctx) {
            ctx.beginPath();
            ctx.moveTo(0,0);
            
            for (var y=0; y< 200; y++) {
                var x = 30 * Math.sin(y / 9.05);
                ctx.lineTo(x,y);
            }
        }

        this.draw = function() {
                try {
                        if (this.state === 0) this.cy = 445;
                        else if (this.state == 1) this.cy = 501;

                        ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
                } catch (e) {}
        };
};
            
            
                  function drawSpring(canvas, context) {
        context.beginPath();
        context.moveTo(0, 0);

        for(var y = 0; y < 200; y++) {
          // Sine wave equation
          var x = 30 * Math.sin(y / 9.05);
          context.lineTo(x, y);
        }
      }
            
            
            
            
            
            
            
            
            
            
