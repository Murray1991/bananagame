
//set svg game level editor
function configureEditor() {
    
    var cG = utils.createSVGGroup,
        cR = utils.createSVGRect,
        cB = utils.createSVGButton,
        cIB = utils.createSVGImageButton,
        w = 64,
        h = canvas.height,
        x = canvas.width - w,
        y = 0,
        rx = 5,
        ry = 5,
        xB = x + 4, //x bottone
        lB = w - 8, //lato bottone
        dB = 4,   //distanza bottone-bottone
        font_sz = 10,
        drawingArea = cG("drawing"),
        editor = cG("level_editor");
        
    //setting groups
    var groups = [cG("top_group"), cG("tile_group"), cG("star_group"), cG("enemy_group")];
    
    //setting bar
    var bar = cR(0, 0, w, h,rx, ry);
    bar.style.fill = "rgba(0,0,0,0.5)";
    bar.style.visibility = "inherit";
    //for each group
    for (var j=0; j<groups.length; j++) {
        
        //create back button, TOFIX
        var createBackButton = function(){
            var back = cB("BACK",font_sz,dB,dB,lB,lB, rx, ry, "switcher textbutton")
            return back;
        };
        
        switch(groups[j].id){
            case "top_group":
                //appending top level buttons
                var nameArray = ["Scenario", "ENEMY", "SCORE"];
                for (var i=0; i<nameArray.length; i++){
                    if (nameArray[i] != "MOLLA") {
                        groups[j].appendChild(cB(nameArray[i], font_sz, dB, dB + i*(lB + dB), lB, lB, rx, ry, "switcher textbutton") );
                    } else {
                        groups[j].appendChild(cB(nameArray[i], font_sz, dB, dB + i*(lB + dB), lB, lB, rx, ry, "textbutton") );
                    }
                    //if (i!=3) groups[j].childNodes[groups[j].childNodes.length-1].setAttributeNS(null,"class","to_insert");
                }
                break;
            case "tile_group":  //TOFIX --- potrei evitare di scrivere la stessa roba tre volte
                //appending "back" button TODO
                groups[j].appendChild(createBackButton());
                var images = [tileImage.src, tileImage3.src]; //mettere immagine box
                //appending tile buttons
                for (var i=0; i<images.length; i++) {   //TOFIX test
                    groups[j].appendChild( cIB(images[i], dB , lB+dB + dB + i*(lB + dB), lB, lB, "fill: rgba(255,255,255,0);stroke:rgb(0,0,0); stroke-width:2", "inserter", "tile") );
                }
                groups[j].appendChild( cIB(boxImage.src, dB , lB+dB + dB + i*(lB + dB), lB, lB, "fill: rgba(255,255,255,0);stroke:rgb(0,0,0); stroke-width:2", "inserter", "box") );
                
                break;
            case "star_group":
                groups[j].appendChild(createBackButton());
                for (var i=1; i<2; i++) {   //TOFIX test
                    groups[j].appendChild( cIB(starImage.src, dB , dB + i*(lB + dB), lB, lB, "fill: rgba(255,255,255,0);stroke:rgb(0,0,0); stroke-width:2", "inserter", "star") );
                }                
                break;
            case "enemy_group":
                groups[j].appendChild(createBackButton());
                var images = [enemyImage1_left.src, enemyImage2_left.src];
                for (var i=0; i<images.length; i++) {   //TOFIX test
                    groups[j].appendChild( cIB(images[i], dB , lB+dB + dB + i*(lB + dB), lB, lB, "fill: rgba(255,255,255,0);stroke:rgb(0,0,0); stroke-width:2", "inserter", "enemy") );
                }  
                break;
        }
        

    }
    
    //setting image in drawingArea
    var hero = cIB("images/128x128/6.png", canvas.width/2, canvas.height/2, 64, 64, "cursor:move", "draggable", "hero");
    drawingArea.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
    drawingArea.appendChild(hero);
    drawingArea.style.visibility = "inherit";
    editor.appendChild(drawingArea);
    
    //appending rect color
    svgBar.appendChild(bar);
    //appending options...
    var optionArray = [{src:"images/play-icon.png", id:"play"}, {src:"images/Eraser-icon.png", id:"eraser"}, {src:"images/document_save.png", id:"save"}, {src:"images/delete.png", id:"cross"} ];
    for (var i=0; i<optionArray.length; i++){   //TOFIX? troppe costanti
        if (i % 3 == 0) {
            svgBar.appendChild( cIB(optionArray[i].src, dB-2, -2 +h - lB/2 - i*(2+lB/6), lB/2,  lB/2,undefined,"option", optionArray[i].id) );
        } else {
            svgBar.appendChild( cIB(optionArray[i].src, dB-2 + lB/2 + 2, -2+ h - lB/2 - (i%2)*(2+lB/2), lB/2,  lB/2, undefined, "option",optionArray[i].id) );
        }
    }
    svgBar.appendChild(cB("PUZZLE", font_sz, dB, h - 2*dB - (lB + dB)*2, lB, lB, rx, ry, "switcher textbutton") );
    svgBar.appendChild(cIB("images/sun-smiling.png", dB ,h - 2*dB - (lB + dB)*3, lB, lB, undefined, "switcher", "WEATHER"));
    
    
    
    svgBar.appendChild(groups[0]);//editor.appendChild(groups[0]);
    groups[0].setAttributeNS(null, "transform", "translate(0,0)");
    groups[0].style.visibility = "inherit";
    for (var i=1; i<groups.length; i++){
        svgBar.appendChild(groups[i]);//editor.appendChild(groups[i]);
        groups[i].setAttributeNS(null, "transform", "translate(0,"+h+")")
        groups[i].style.visibility = "inherit";
    }
    
    
    var selectorRect = document.createElementNS(ns, "rect");
    selectorRect.id = "selectorRect";
    selectorRect.setAttributeNS(null, "fill" , "#22C" );
    selectorRect.setAttributeNS(null, "fill-opacity" ,  "0.15" );
    selectorRect.setAttributeNS(null, "stroke" , "#22C" );
    selectorRect.setAttributeNS(null, "stroke-width" , 0.5);
    selectorRect.setAttributeNS(null, "style", "pointer-events:none");
    selectorRect.setAttributeNS(null, "display", "none");
    selectorRect.style.visibility = "inherit";
    
    editor.appendChild(selectorRect);
    svg.appendChild(editor);
    //document.getElementById("back").parentNode.appendChild(document.getElementById("back"));
    //document.getElementById("note").parentNode.appendChild(document.getElementById("note"));
    //document.getElementById("volumeline").parentNode.appendChild(document.getElementById("volumeline"));

    setCSSProperty("level_editor","id","visibility:hidden");
    setCSSProperty("svgBar","id","visibility:hidden");
}

//passing callbacks for play level, save level, or something else
function createEditorBar(callPlay) {
    /*------------------------------FUNCTIONS----------------------------------------------------*/
    function selection(obj) {        
        var rect1 = document.getElementById("selectorRect"),
            enemies = document.getElementsByClassName("enemy");
            
        for (var i=0; i<enemies.length; i++){
            enemies[i].parentNode.childNodes[1].setAttributeNS(null,"display","none");
        }
        
        if (obj != null) {
            
            var rect;
            if (obj.parentNode.id != "drawing" && obj.parentNode.parentNode.id != "drawing") {
            
                rect= rect1.cloneNode();
                rect1.parentNode.removeChild(rect1);
                obj.parentNode.appendChild(rect);
            } else {
                rect= rect1.cloneNode();
                rect1.parentNode.removeChild(rect1);
                svg.appendChild(rect);
            }

            
            var height = parseInt(obj.getAttribute("height")) || parseInt(obj.getAttribute("r"))*2 || undefined,
                width = parseInt(obj.getAttribute("width")) || parseInt(obj.getAttribute("r"))*2 || undefined,
                x = parseInt(obj.getAttribute("x")) || parseInt(obj.getAttribute("cx")) - width/2 || undefined,
                y = parseInt(obj.getAttribute("y"))|| parseInt(obj.getAttribute("cy")) - height/2 || undefined;
            
            if (obj.getAttribute("class").indexOf("draggable") != -1){
                var worldpt = svg.createSVGPoint();
                worldpt.x = x; worldpt.y = y;
                var pt = worldpt.matrixTransform(utils.getTransformMatrix(drawingArea));

                x = pt.x;
                y = pt.y;
                height = height*utils.getTransformMatrix(drawingArea).d;
                width = width*utils.getTransformMatrix(drawingArea).a;

                if (obj.id == "enemy" && obj.class != "inserter"){
                    var vel_enemy = document.getElementById("vel_enemy");
                    var point = svg.createSVGPoint();
                    var top = y - 100,
                        left = x - 100;
                    vel_enemy.style.top = top+"px";
                    vel_enemy.style.left = left+"px";
                    vel_enemy.style.display = "block"
                }
            }
            
            if (obj.id == "enemy" || obj.tagName == "circle") {
                obj.parentNode.childNodes[1].setAttributeNS(null, "display", "inline");
                
            }

            var printCoord = function(){
                console.log(x);
                console.log(y);
                console.log(height);
                console.log(width);
            }

            //printCoord();

            if (x && y && height && width) {

                rect.setAttributeNS(null, "height", height+2);
                rect.setAttributeNS(null, "width", width+2);
                rect.setAttributeNS(null, "x", x-1);
                rect.setAttributeNS(null, "y", y-1);
                rect.setAttributeNS(null, "display", "inline");
            } else {
                console.log("problem in selection function");
            }
            
        } else {
            rect1.setAttributeNS(null, "display", "none");
            document.getElementById("vel_enemy").style.display = "none";
        }
    }
    
    /*------------------------------LISTENERS----------------------------------------------------*/
    
    /*
     * @name: function switchBar
     * @description: listener for mousedown/click event over a switcher button
     *
     * @effect: change bar
     * TODO: animation in changing bar effect
     */
    var switchBar = function (evt){
        evt = evt || window.event;
        var btn = evt.which || evt.button;
        //var animate = false;
        function changeBar(bar1, bar2, r){
            var x = -64*r;
            var x2 = 0;
            var timer = setInterval(function(){
                    x = x + 8*r;
                    x2 = x2 + 8*r;
                    bar1.setAttributeNS(null, "transform", "translate("+x2+",0)");
                    bar2.setAttributeNS(null, "transform", "translate("+x+",0)")
                    
                    if (x == 0) {
                        clearInterval(timer);
                    }
                },30); 
        }
        if (btn == 1) {
            wait = true;
            inserter = null;
            
            switch (this.id) {
                case "Scenario":
                    changeBar(topBar, tileBar, 1);
                    //topBar.setAttributeNS(null, "transform","translate(-64,0)");
                    //tileBar.setAttributeNS(null,"transform","translate(0,0)");
                    break;
                case "ENEMY":
                    changeBar(topBar, enemyBar, 1);
                    //topBar.setAttributeNS(null, "transform","translate(-64,0)");
                    //enemyBar.setAttributeNS(null,"transform","translate(0,0)");
                    break;
                case "SCORE":
                    changeBar(topBar, pointBar, 1);
                    //topBar.setAttributeNS(null, "transform","translate(-64,0)");
                    //pointBar.setAttributeNS(null,"transform","translate(0,0)");
                    break;
                case "BACK":
                    changeBar(this.parentNode, topBar ,-1);
                    //this.parentNode.setAttributeNS(null,"transform","translate(-64,0)");
                    //topBar.setAttributeNS(null, "transform", "translate(0,0)");
                    break;
                //WEATHER, todo
                case "WEATHER":
                    console.log("weather button clicked!");
                    if (this.getAttribute("href") == "images/cloud-snowing.png") {
                        this.setAttributeNS("http://www.w3.org/1999/xlink","href","images/sun-smiling.png");
                        weather = "sun";
                    } else {
                        this.setAttributeNS("http://www.w3.org/1999/xlink","href","images/cloud-snowing.png");
                        weather = "snow";
                    }
                    break;
                case "PUZZLE":
                    var childText = this.childNodes[0],
                        textNode = document.createTextNode("ARCADE");
                    
                    childText.removeChild(childText.childNodes[0]);
                    childText.appendChild(textNode);
                    mode = "arcade";
                    this.id = "ARCADE";
                    break;
                case "ARCADE":
                    var childText = this.childNodes[0],
                        textNode = document.createTextNode("PUZZLE");
                    
                    childText.removeChild(childText.childNodes[0]);
                    childText.appendChild(textNode);
                    mode = "puzzle";
                    this.id = "PUZZLE";
                    break;
                default:
                    console.log("something wrong");
                    break;
            }
        }

    }
    
    /*
     *@name function inZoom
     *
     *@description press Z; zooms drawing area atmost of the 120% of the original
     */
    //var scale_value = 0;
    var inZoom = function(evt){
        if (this.id == "zoomin" || evt.keyCode == 90) {
            var factor = 0.1,
                viewMatrix = utils.getTransformMatrix(drawingArea);
                
            viewMatrix.e = viewMatrix.e - (canvas.width/2)*factor
            viewMatrix.f = viewMatrix.f - (canvas.height/2)*factor
            viewMatrix.a += factor;
            viewMatrix.d += factor;
            selection(created);
        }
    }
    
    
    /*
     *@name function outZoom
     *
     *@description zooms drawing area atmost of the 120% of the original
     */
    var outZoom = function(evt){
        if (this.id == "zoomout" || evt.keyCode == 88) {
            var factor = -0.1,
                viewMatrix = utils.getTransformMatrix(drawingArea);
               
            viewMatrix.e = viewMatrix.e - (canvas.width/2)*factor
            viewMatrix.f = viewMatrix.f - (canvas.height/2)*factor    
            viewMatrix.a += factor;
            viewMatrix.d += factor;
            selection(created);
        }      
    }
    
    /*
     *@name function translate
     *
     *@description translate drawing area atmost of the 120% of the original
     */
    var translate = function(evt){  //TODO matrice vista, matrice mondo, blablabla
        var vel = 10,
            viewMatrix = utils.getTransformMatrix(drawingArea);
            
        if (this.id == "moveleft" || evt.keyCode == 37) {
            viewMatrix.e -= vel;
        } else if (this.id == "moveup" || evt.keyCode == 38) {
                viewMatrix.f -= vel;
        } else if (this.id == "moveright" || evt.keyCode == 39) {
                viewMatrix.e += vel;
        } else if (this.id == "movedown" || evt.keyCode == 40){
                viewMatrix.f += vel;
        }
        
        utils.setTransformMatrix(drawingArea, viewMatrix);
        selection(created);
    }
      
    
    /*
     * @name: function mouseOver
     * @description: listener for mouseove event over a inserter button
     *
     * @effect: in zoom the button
     */
    var mouseOver = function(){
        this.setAttribute("x", this.getAttribute("x") - 5);
        this.setAttribute("y", this.getAttribute("y") - 5);
        this.setAttribute("width", parseInt(this.getAttribute("width"))+10);
        this.setAttribute("height", parseInt(this.getAttribute("height"))+10);
        
        //if (editor.selected.element == this) {
        //    selectGrip(this);
        //}
    };
    
    /*
     * @name: function outZoom
     * @description: listener for mouseout event over a inserter button
     *
     * @effect: out zoom the button
     */
    var mouseOut = function(){
        this.setAttribute("x", parseInt(this.getAttribute("x")) + 5);
        this.setAttribute("y", parseInt(this.getAttribute("y")) + 5);
        this.setAttribute("width", this.getAttribute("width")-10);
        this.setAttribute("height", this.getAttribute("height")-10);
        
        console.log("mouseover in outZoom");
        //if (editor.selected.element == this) {
        //    selectGrip(this);
        //}
    };
    
    /*
     * @name: function selectInserter
     * @description: listener for mousedown over a inserter button
     *
     * @effect: select an inserter
     */
    var selectInserter = function(evt){
        evt = evt || window.event;
        var btn = evt.which || evt.button;
        
        if (btn == 1) {
            if (deleting) {
                deleting = false;
            }
            
            if (inserter == this) {
                inserter = null;
                //wait = false;
                selection(null);
            } else {
                inserter = this;
                //wait = true;
                selection(this);
            }
        }
    };
    
    /*
     * @name: function createElement
     * @description: listener for mousedown event over svg root
     *
     * @effect: create an element, if possible
     */
    var createElement = function(evt){
        evt = evt || window.event;
        var btn = evt.which || evt.button;
        
        if (btn == 1) {
            var viewpt = svg.createSVGPoint(),
                viewMatrix = utils.getTransformMatrix(drawingArea);
    

            viewpt.x = evt.clientX - document.getElementById("wrapper").offsetLeft; 
            viewpt.y = evt.clientY - document.getElementById("wrapper").offsetTop;
            var pt = viewpt.matrixTransform(viewMatrix.inverse());
            
            var x = pt.x,
                y = pt.y;
            
            if (inserter != null /*&& !wait*/) {
                var dupNode = inserter.cloneNode();
                
                if (dupNode.id == "tile" || dupNode.id == "box") {
                    dupNode.setAttributeNS(null,"width", 50);
                    dupNode.setAttributeNS(null,"height", 50);
                }
                
                if (dupNode.id == "enemy") {
                    dupNode.setAttributeNS(null,"width", 48);
                    dupNode.setAttributeNS(null,"height", 48);
                }
                
                if (dupNode.id == "star") {
                    dupNode.setAttributeNS(null,"width", 32);
                    dupNode.setAttributeNS(null,"height",32);
                }
                
                dupNode.setAttributeNS(null, "class", "draggable "+dupNode.id);
                dupNode.setAttributeNS(null, "x", x - (dupNode.getAttribute("width")/2));
                dupNode.setAttributeNS(null, "y", y - (dupNode.getAttribute("height")/2));
                dupNode.addEventListener("mousedown", selectElement, false);
                //dupNode.addEventListener("mouseup", deSelectElement, false);
                
                if (dupNode.id == "enemy") {
                    var circle = document.createElementNS(ns, "circle");
                    circle.setAttributeNS(null, "cx", parseInt(dupNode.getAttribute("x")) + 50 + parseInt(dupNode.getAttribute("width"))/2);
                    circle.setAttributeNS(null, "cy", parseInt(dupNode.getAttribute("y")) + parseInt(dupNode.getAttribute("height"))/2);
                    circle.setAttributeNS(null, "r", 10);
                    circle.setAttributeNS(null, "stroke", "black");
                    circle.setAttributeNS(null, "stroke-width", 4);
                    circle.setAttributeNS(null, "fill", "rgba(0,0,0,0)");
                    circle.setAttributeNS(null, "class", "draggable");
                    circle.setAttributeNS(null, "style", "cursor: move");
                    //vedere come selezionare le foglie di g, affinche' sia piu' facile l'event handler per mousemove nel caso si becchi un enemy,
                    //se muovo immagine, muovo anche pallino.. se muovo pallino, col cavolo che muovo l'immagine
                    //pallino dovrebbe muoversi solo sull'asse delle x
                    circle.addEventListener("mousedown", selectElement, false);
                    //circle.addEventListener("mouseup", deSelectElement, false);
                    
                    var group = document.createElementNS(ns, "g");
                    //group.setAttributeNS(null, "class", "enemy");
                    group.appendChild(dupNode);
                    group.appendChild(circle);
                    
                    drawingArea.appendChild(group);
                    
                    if (last_enemy == null) {
                        last_enemy = dupNode;
                        dupNode.vel = 1;
                    } else {
                        dupNode.vel = last_enemy.vel;
                    }
                } else {
                    drawingArea.appendChild(dupNode);
                }
            
                dupNode.style.cursor = "move";
                elements.push(dupNode);
            /*} else if (inserter != null){
                wait = false;*/
            } else if (inserter == null && selected == null && !deleting) {
                created = null;
                selection(null);
                var viewpt = svg.createSVGPoint(),
                    viewMatrix = utils.getTransformMatrix(drawingArea);
    
                viewpt.x = evt.clientX - document.getElementById("wrapper").offsetLeft; 
                viewpt.y = evt.clientY - document.getElementById("wrapper").offsetTop;
                var pt = viewpt.matrixTransform(viewMatrix.inverse());


                //controllare se ci sono elementi selezionati e ho cliccato nel quadrato
                var rect = document.getElementById("multipleRect"), x, y, w, h;

                if (rect) {
                    x = parseInt(rect.getAttribute("x"));
                    y = parseInt(rect.getAttribute("y"));
                    w = parseInt(rect.getAttribute("width"));
                    h = parseInt(rect.getAttribute("height"));
                }

                if (rect && multipleSelected && multipleSelectedElements.length != 0 && pt.x < x + w && pt.x > x && pt.y < y + h && pt.y > y) {
                    
                    multipleMoving = true;
                    multipleDistance = {dx: x-pt.x, dy: y-pt.y};
                
                    for (var i=0; i<multipleSelectedElements.length; i++){
                        var o = multipleSelectedElements[i],
                            xo = parseInt(o.getAttribute("x")) || 0,
                            yo = parseInt(o.getAttribute("y")) || 0;

                        if (o.tagName == "g"){  
                            xo = parseInt(o.childNodes[0].getAttribute("x"));
                            yo = parseInt(o.childNodes[0].getAttribute("y"));


                            o.childNodes[0].dx = xo - pt.x;
                            o.childNodes[0].dy = yo - pt.y;

                            xo = parseInt(o.childNodes[1].getAttribute("cx"));
                            yo = parseInt(o.childNodes[1].getAttribute("cy"));


                            o.childNodes[1].dx = xo - pt.x;
                            o.childNodes[1].dy = yo - pt.y;
                        } else {
                            o.dx = xo - pt.x;
                            o.dy = yo - pt.y;
                        }
                    }

                } else if (!multipleSelecting) {
                 
                    multipleSelecting = true;
                    multipleSelected = false;
                    multipleInitialPoint = {x: pt.x, y: pt.y};
                    multipleSelectedElements = [];
                }
            }
        }
        
    };
    
    /*
     * @name: function selectElement
     * @description: listener for mousedown event over draggable element
     *
     * @effect: select the draggable element
     */
    var selectElement = function(evt){
        evt = evt || window.event;
        var btn = evt.which || evt.button;
        if (btn == 1) {
            if (!deleting) {
                inserter = null;  //valutare se conviene per usabilita', l'alternativa e' mettere wait = true
                var locX = evt.clientX - document.getElementById("wrapper").offsetLeft,
                    locY = evt.clientY - document.getElementById("wrapper").offsetTop,
                    viewpt = svg.createSVGPoint(),
                    viewMatrix = utils.getTransformMatrix(drawingArea);
                
                viewpt.x = locX;
                viewpt.y = locY;
                
                var pt = viewpt.matrixTransform(viewMatrix.inverse());
                locX = pt.x;
                locY = pt.y;
              
                selected = this;
                if (selected.id == "enemy") {
                    last_enemy = this;
                    document.getElementById("vel_enemy_value").value = this.vel;
                    var vel_enemy = document.getElementById("vel_enemy");


                    var point = svg.createSVGPoint();
                    point.x = this.getAttribute("x"); point.y = this.getAttribute("y");
                    point = point.matrixTransform(viewMatrix);
                    var top = point.y - 100,
                        left = point.x - 100;

                    vel_enemy.style.top = top+"px";
                    vel_enemy.style.left = left+"px";
                    vel_enemy.style.display = "block";
                } else {
                    document.getElementById("vel_enemy").style.display = "none";
                }
                
                if (this.getAttribute("x")) {
                    offset = {
                        x: this.getAttribute("x") - locX,
                        y: this.getAttribute("y") - locY,
                    }
                } else if (this.getAttribute("cx")) {
                    offset = {
                        x: this.getAttribute("cx") - locX,
                        y: this.getAttribute("cy") - locY,
                    }            
                }
                

                if (selected.id == "enemy") {
                    selected.parentNode.parentNode.appendChild(selected.parentNode);
                }
                else {
                    selected.parentNode.appendChild(selected);
                }

                created = this;
                selection(this);
                            
            } else {
                if (this.id != "hero"){
                if (this.id == "enemy" || this.id == "enemy1" || this.id == "enemy2") {
                    var g = this.parentNode;
                    g.parentNode.removeChild(g)
                    document.getElementById("vel_enemy").style.display = "none";
                } else {
                    this.parentNode.removeChild(this);
                }
                }
            }

        }
    };
    
    /*
     * @name: function deSelectElement
     * @description: listener for mouseup event over draggable element
     *
     * @effect: deselect the draggable element
     */    
    var deSelectElement = function(){
        selected = null;     //?
    };
    
    /*
     * @name: function moveElement
     * @description: listener for mousemove event over svg root
     *
     * @effect: move the selected draggable element or do nothing
     */
    var moveElement = function(evt){
        if (selected != null && selected.getAttribute("class").indexOf("draggable") != -1) {
            

            var locX = evt.clientX - document.getElementById("wrapper").offsetLeft,
                locY = evt.clientY - document.getElementById("wrapper").offsetTop,
                viewpt0 = svg.createSVGPoint(),
                viewpt1 = svg.createSVGPoint(),
                viewMatrix = utils.getTransformMatrix(drawingArea),
                newX = locX + offset.x*viewMatrix.a,
                newY = locY + offset.y*viewMatrix.d;
                
             
            viewpt0.x = locX;
            viewpt0.y = locY;
            viewpt1.x = newX;
            viewpt1.y = newY;
            
            var pt0 = viewpt0.matrixTransform(viewMatrix.inverse()),
                pt1 = viewpt1.matrixTransform(viewMatrix.inverse());
                
            locX = pt0.x;
            locY = pt0.y;
            newX = pt1.x;
            newY = pt1.y;
            
            if (selected.tagName == "circle") {
                selected.setAttribute("cx", newX);
                //selected.setAttribute("cy", newY);
            } else if (selected.id == "enemy") {
                var circle = selected.parentNode.childNodes[1],
                    offX = parseInt(circle.getAttribute("cx")) - parseInt(selected.getAttribute("x"));
                
                selected.setAttribute("x", newX);
                selected.setAttribute("y", newY);
                
                circle.setAttribute("cx", newX + offX);
                circle.setAttribute("cy", newY + selected.getAttribute("height")/2);

                var vel_enemy = document.getElementById("vel_enemy");
                var point = svg.createSVGPoint();
                point.x = selected.getAttribute("x"); point.y = selected.getAttribute("y");
                point = point.matrixTransform(viewMatrix);
                var top = point.y - 100,
                    left = point.x - 100;
                
                console.log("px "+point.x);
                console.log("x "+selected.getAttribute("x"));
                console.log("left "+left);
                // var svgPoint = svg.createSVGPoint(); svgPoint.x = left; svgPoint.y = top;
                // var viewSvgPoint = svgPoint.matrixTransform(viewMatrix);

                vel_enemy.style.top = top+"px";
                vel_enemy.style.left = left+"px";
            } else {
                selected.setAttribute("x", newX);
                selected.setAttribute("y", newY);
            }
            
            selection(selected);
        } 

        if (multipleSelecting) {

            if (document.getElementById("multipleRect")) {
                document.getElementById("multipleRect").parentNode.removeChild(document.getElementById("multipleRect"));
            }

            var viewpt = svg.createSVGPoint(),
                viewMatrix = utils.getTransformMatrix(drawingArea),
                p = multipleInitialPoint;
    
            viewpt.x = evt.clientX - document.getElementById("wrapper").offsetLeft; 
            viewpt.y = evt.clientY - document.getElementById("wrapper").offsetTop;
            var pt = viewpt.matrixTransform(viewMatrix.inverse());

            var pt0;
            if (p.x <= pt.x && p.y <= pt.y) {
                pt0 = p;
            } else if (pt.x <= p.x && pt.y <= p.y) {
                pt0 = pt;
            } else if (p.x <= pt.x && pt.y <= p.y) {
                pt0 = {x: p.x, y: pt.y};
            } else {
                pt0 = {x: pt.x, y: p.y};
            }

            var w = Math.abs(p.x - pt.x), h = Math.abs(p.y - pt.y),
                rect = utils.createSVGRect(pt0.x, pt0.y, w, h); 

            rect.setAttribute("id", "multipleRect");
            rect.setAttribute("fill", "#22C");
            rect.setAttribute("fill-opacity", 0.15);
            rect.setAttribute("stroke", "#22C");
            rect.setAttribute("stroke-width", 0,5);
            rect.style.cursor = "move";
            
            multipleSelectedElements = [];
            var objects = document.getElementById("drawing").childNodes;
         
            for (var i=0; i<objects.length; i++) {
                var o = objects[i],
                    x = parseInt(o.getAttribute("x")) || undefined,
                    y = parseInt(o.getAttribute("y")) || undefined;
                if (objects[i].tagName == "g") {
                    o = objects[i].childNodes[0];
                    x = parseInt(o.getAttribute("x"));
                    y = parseInt(o.getAttribute("y"));
                }

                if (x > pt0.x && x < pt0.x + w && y > pt0.y && y < pt0.y + h){
                    multipleSelectedElements.push(objects[i]);
                }
            }

            drawingArea.appendChild(rect);
        } else if (multipleSelected && multipleMoving) {
            var viewpt = svg.createSVGPoint(),
                viewMatrix = utils.getTransformMatrix(drawingArea),
                p = multipleInitialPoint;
    
            viewpt.x = evt.clientX - document.getElementById("wrapper").offsetLeft; 
            viewpt.y = evt.clientY - document.getElementById("wrapper").offsetTop;
            var pt = viewpt.matrixTransform(viewMatrix.inverse());

            var rect = document.getElementById("multipleRect");
            

            rect.setAttribute("x", pt.x + multipleDistance.dx);
            rect.setAttribute("y", pt.y + multipleDistance.dy);

            for (var i=0; i<multipleSelectedElements.length; i++){
                var o = multipleSelectedElements[i],
                    x = parseInt(o.getAttribute("x")) || 0,
                    y = parseInt(o.getAttribute("y")) || 0;


                if (o.tagName == "g"){
                    x = parseInt(o.childNodes[0].getAttribute("x"));
                    y = parseInt(o.childNodes[0].getAttribute("y"));

                    o.childNodes[0].setAttribute("x", pt.x+o.childNodes[0].dx);
                    o.childNodes[0].setAttribute("y", pt.y+o.childNodes[0].dy);

                    x = parseInt(o.childNodes[1].getAttribute("cx"));
                    y = parseInt(o.childNodes[1].getAttribute("cy"));


                    o.childNodes[1].setAttribute("cx", pt.x+o.childNodes[1].dx);
                    o.childNodes[1].setAttribute("cy", pt.y+o.childNodes[1].dy);
                } else {
                    o.setAttribute("x", pt.x + o.dx);
                    o.setAttribute("y", pt.y + o.dy);
                }
            }
        }
    };    
    
    /*
     * @name: function replicate
     * @description: listener for keydown event
     *
     * @effect: replicate the tile object
     */
    var replicate = function(evt) {
        var keyCode = evt.keyCode,
            grass_images = [tileImage2.src, tileImage2.src],
            soil_images = [tileImage3.src, tileImage4.src],
            offs = 5;
        
        function checkUpAndSet(node, tiles){
            node.setAttributeNS("http://www.w3.org/1999/xlink","href",grass_images[Math.floor(Math.random()*grass_images.length)]);
            for (var i=0; i<tiles.length; i++) {
                if (tiles[i].getAttribute("x") == node.getAttribute("x") &&
                    tiles[i].getAttribute("y") == node.getAttribute("y") - parseFloat(created.getAttribute("height")) + offs) {
                    
                    node.setAttributeNS("http://www.w3.org/1999/xlink","href",soil_images[Math.floor(Math.random()*soil_images.length)]);
                }
                
                if (tiles[i].getAttribute("x") == node.getAttribute("x") &&
                    tiles[i].getAttribute("y") == parseFloat(node.getAttribute("y")) + parseFloat(created.getAttribute("height")) - offs) {
                    
                    tiles[i].setAttributeNS("http://www.w3.org/1999/xlink","href",soil_images[Math.floor(Math.random()*soil_images.length)]);
                    
                }
            }
        }
        
        if ((keyCode == 87 ||    //W
            keyCode == 83 ||    //S
            keyCode == 65 ||    //A
            keyCode == 68) &&   //D
            created != null && created.id == "tile"
            ) {
            
            var dupNode = created.cloneNode(),
                x = created.getAttribute("x"),
                y = created.getAttribute("y"),
                tiles = document.getElementsByClassName("tile");
            
            dupNode.addEventListener("mousedown", selectElement, false);
            dupNode.addEventListener("mouseup", deSelectElement, false);
            
            switch (keyCode) {
                case 87:
                    y = parseFloat(created.getAttribute("y")) - parseFloat(created.getAttribute("height")) + offs;
                    dupNode.setAttribute("x", x); dupNode.setAttribute("y", y);
                    created.setAttributeNS("http://www.w3.org/1999/xlink","href",soil_images[Math.floor(Math.random()*soil_images.length)]);
                    checkUpAndSet(dupNode, tiles);
                    break;
                case 83:
                    y = parseFloat(created.getAttribute("y")) + parseFloat(created.getAttribute("height")) - offs;
                    dupNode.setAttribute("x", x); dupNode.setAttribute("y", y);
                    dupNode.setAttributeNS("http://www.w3.org/1999/xlink","href",soil_images[Math.floor(Math.random()*soil_images.length)]);
                    break;
                case 65:
                    x = parseFloat(created.getAttribute("x")) - parseFloat(created.getAttribute("width")) + offs;
                    dupNode.setAttribute("x", x); dupNode.setAttribute("y", y);
                    checkUpAndSet(dupNode, tiles);
                    break;
                case 68:
                    x = parseFloat(created.getAttribute("x")) + parseFloat(created.getAttribute("width")) - offs;
                    dupNode.setAttribute("x", x); dupNode.setAttribute("y", y);
                    checkUpAndSet(dupNode, tiles);              
                    break;
            }
            
            var ok=true;
            for (var i=0; i<tiles.length; i++){
                if (tiles[i].getAttribute("x") == dupNode.getAttribute("x") && tiles[i].getAttribute("y") == dupNode.getAttribute("y")) {
                    ok = false;
                }
            }
            
            if (ok) {
                drawingArea.appendChild(dupNode);
                created = dupNode;
                selection(dupNode);
            } else {
                delete(window.dupNode);
            }
            
        }
    };
    
    /*
     * @name: function selectForEliminate
     * @description: listener for mousedown event over svg cross button
     *
     * @effect: set "the deleting mode"
     */
    var selectForEliminate = function() {
        deleting = (deleting)? false : true;
        inserter = null;
        selected = null;
        created = null;
        if (deleting) {
            selection(this);
        } else {
            selection(null);
        }
    };
    
    /*
     * @name: function eraseAll
     * @description: listener for mousedown event over svg cross button
     *
     * @effect: set "the deleting mode"
     */
    var eraseAll = function(){
        var objects = drawingArea.childNodes;
        while (objects.length != 1){
            if (objects[0].id != "hero") {
                objects[0].parentNode.removeChild(objects[0]);
            } else {
                objects[1].parentNode.removeChild(objects[1]);
            }
        }
    };
    
    var createLevel = function(_name){   //TOFIX
        var hero = {},
            enemies = [],
            stars = [],
            tiles = [],
            boxes = [],
            translate_value = 0,
            worldMatrix = utils.getTransformMatrix(drawingArea),
            matrix = {a: worldMatrix.a, b: worldMatrix.b, c: worldMatrix.c, d: worldMatrix.d, e: worldMatrix.e, f:worldMatrix.f},
            name = _name || "something";
        
        var objects = drawingArea.childNodes;
        for (var i=0; i<objects.length; i++) {
            var locx = objects[i].getAttribute("x"),
                locy = objects[i].getAttribute("y");

            
            if (objects[i].id == "hero") {
                hero.x = locx;
                hero.y = locy;
                
                if (mode == "arcade") {
                    var worldPoint = svg.createSVGPoint(),
                        vM = svg.createSVGMatrix();
                    //creo worldPoint di hero
                    worldPoint.x = hero.x;
                    worldPoint.y = hero.y;
                    
                    //creo view point, ovvero in che posizione hero appare nello schermo
                    
                    var viewPoint = worldPoint.matrixTransform(worldMatrix);
                   
                    translate_value = viewPoint.x - canvas.width/2;
                    
                    matrix.e -= translate_value;
                    
                }
            } else if (objects[i].id == "box") {
                boxes.push({x: locx, y: locy});
            } else if (objects[i].id == "tile") {
                var img = (function () {
                    switch (objects[i].getAttribute("href")) {
                        case (tileImage.src):
                            return tileImage;
                            break;
                        case (tileImage2.src):
                            return tileImage2;
                            break;
                        case (tileImage3.src):
                            return tileImage3;
                            break;
                        case (tileImage4.src):
                            return tileImage4;
                            break;
                        default:
                            console.log("something wrong");
                            break;
                    }
                    return tileImage;   //default
                })();
                tiles.push({x:locx, y:locy, image: img.src});
                //tiles.push(new Tile(locx,locy, image));
            } else if (objects[i].id == "star") {
                stars.push({x: locx, y:locy, width: 32, height: 32, type: "star"})
            } else if (objects[i].tagName == "g"){
                if (objects[i].childNodes[0].getAttribute("id") == "enemy" || objects[i].childNodes[0].getAttribute("id")== "enemy1") {
                    var toX = objects[i].childNodes[1].getAttribute("cx");
                    var locx = objects[i].childNodes[0].getAttribute("x");
                    var locy = objects[i].childNodes[0].getAttribute("y");
                    var img = objects[i].childNodes[0].getAttribute("href");
                    var velX = objects[i].childNodes[0].vel;
                    enemies.push({x:locx, y: locy, src: img, to: toX, vel: velX});
                }
            } else {
                console.log(objects[i].id + " not recognized as valid id");
            }
        }

        return retlevel(name, hero, enemies, tiles, stars, boxes, mode, matrix, weather);
    }
    
    var switchState = callPlay;
    
    var playLevel = function() {
            var level = createLevel(),
                m = level.matrix;

            if (level.stars.length != 0){
                lastLevelPlayed = level;
                console.log("start level...");
                inserter = null;
                selected = null;
                lvl_trasf = m;
                ctx.save();
                ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                hero = level.load_hero();
                //hero.velX is 0
                enemies = level.load_enemies();
                stars = level.load_stars();
                tiles = level.load_tiles();
                boxes = level.load_boxes();
                
                document.getElementById("selectorRect").setAttributeNS(null,"display","none");
                if (document.getElementById("multipleRect"))
                    document.getElementById("multipleRect").parentNode.removeChild(document.getElementById("multipleRect"));
                document.getElementById("vel_enemy").style.display = "none";
                switchState(STATE_PLAY_LEVEL);
            } else {
                console.log("no...non puoi...");
            }
    }
    
    var saveLevel = function() {    //da affinare
        

        var lvl = createLevel();

        if (lvl.stars.length != 0){
            console.log("saving...");

            if (!localStorage.puzzleBanana) {
                localStorage.puzzleBanana = "[]";
            }

            if (!localStorage.arcadeBanana){
                localStorage.arcadeBanana = "[]";
            }
            
            console.log(lvl.type);
            if (lvl.type == "arcade"){
                custom_arcade_levels = JSON.parse(localStorage.arcadeBanana);
                custom_arcade_levels.push(lvl);
                localStorage.arcadeBanana = JSON.stringify(custom_arcade_levels);
            } else if (lvl.type == "puzzle") {
                custom_puzzle_levels = JSON.parse(localStorage.puzzleBanana);
                custom_puzzle_levels.push(lvl);
                localStorage.puzzleBanana = JSON.stringify(custom_puzzle_levels);
            } else {
                console.log("something wrong");
            }

            new_level_saved = true;
            console.log("new level written in log console...")
            console.log(JSON.stringify(lvl));
        } else {
            console.log("no... non puoi...")
        }
    };
    
    
    //---------------------------------------------------------------------------------
    configureEditor();
    
    var svg = document.getElementById("svgRoot");
        states = [],
        state = {top: 0, enemy: 1, tile: 2, point: 3},
        topBar = document.getElementById("top_group"),
        tileBar = document.getElementById("tile_group"),
        enemyBar = document.getElementById("enemy_group"),
        pointBar = document.getElementById("star_group"),
        switchers = document.getElementsByClassName("switcher"),
        inserters = document.getElementsByClassName("inserter"),
        elements = [],
        drawingArea = document.getElementById("drawing"),
        inserter = null,
        wait = true,
        selected = null,
        last_enemy = null,
        offset = null,
        created = null,
        deleting=false,
        viewMatrix = undefined,
        wM = svg.createSVGMatrix(),
        multipleSelecting = false,
        multipleSelectedElements = [],
        multipleInitialPoint = undefined,
        multipleSelected = false,
        multipleDistance = 0,
        multipleMoving = false;


    //adding listeners to svg buttons
    //document.getElementById("zoomin").addEventListener("mousedown", inZoom, false);   <svg>
    document.getElementById("zoomin").addEventListener("mousedown", inZoom, false);
    document.getElementById("zoomout").addEventListener("mousedown", outZoom, false);

    document.getElementById("moveup").addEventListener("mousedown", translate, false);
    document.getElementById("movedown").addEventListener("mousedown", translate, false);
    document.getElementById("moveleft").addEventListener("mousedown", translate, false);
    document.getElementById("moveright").addEventListener("mousedown", translate, false);

    //adding listeners
    document.getElementById("vel_enemy_value").addEventListener("change", function(){last_enemy.vel = this.value;}, false);
    document.getElementById("hero").addEventListener("mousedown", selectElement, false);
    svg.addEventListener("mouseup", deSelectElement, false);
    
    for (var i=0; i<switchers.length; i++){
        switchers[i].addEventListener("mousedown", switchBar, false);
    }
    
    for (var i=0; i<inserters.length; i++){
        inserters[i].addEventListener("mousedown", selectInserter, false);
    }
    
    document.getElementById("cross").addEventListener("mousedown", selectForEliminate, false);
    document.getElementById("eraser").addEventListener("mousedown", eraseAll, false);  
    document.getElementById("play").addEventListener("mousedown", playLevel, false);
    document.getElementById("save").addEventListener("mousedown", saveLevel, false);
    svg.addEventListener("mouseup", function(evt){
        if (selected != null && selected.tagName == "circle") selected=null;

        if (multipleSelected){
            multipleSelected = false;
        }


        if (multipleSelecting){
            multipleSelecting = false;
            if (multipleSelectedElements.length == 0) {
                if (document.getElementById("multipleRect")) {
                    document.getElementById("multipleRect").parentNode.removeChild(document.getElementById("multipleRect"));
                    multipleSelected = false;
                } 
            } else {
                multipleSelecting = false;
                multipleSelected = true;
            }
        }

        if (multipleMoving)
            multipleSelected = true;

        multipleMoving = false;

    }, false);
    svg.addEventListener("mousedown", createElement, false);
    svg.addEventListener("mousemove", moveElement, false);

    return {
        active: false,
        elements: [] ,
        hideEditor: function(){
            document.body.removeEventListener("keydown", replicate, false);    //?
            document.body.removeEventListener("keydown", translate, false);
            document.body.removeEventListener("keydown", inZoom, false);
            document.body.removeEventListener("keydown", outZoom, false);
            setCSSProperty("level_editor","id","visibility: hidden");
            setCSSProperty("drawing","id","visibility: hidden");
            setCSSProperty("svgBar", "id", "visibility:hidden");
            //setCSSProperty("transformationControls", "id", "visibility:hidden");
            //setCSSProperty("draggable","class","visibility: hidden");
        },
        showEditor: function(){
            ctx.setTransform(1,0,0,1,0,0);
            document.body.addEventListener("keydown", replicate, false);    //?
            document.body.addEventListener("keydown", translate, false);
            document.body.addEventListener("keydown", inZoom, false);
            document.body.addEventListener("keydown", outZoom, false);
            setCSSProperty("level_editor","id","visibility: visible");
            setCSSProperty("drawing","id","visibility: visible");
            setCSSProperty("svgBar", "id", "visibility:visible");
            //setCSSProperty("transformationControls", "id", "visibility:visible");
            //setCSSProperty("draggable","class","visibility: visible");
        },
        slideEditorBar: function(){},
        changeState: function(newState){}
    };
}


function retlevel(_name, _hero, _enemies, _tiles, _stars, _boxes, _type, transf, _weather){
    var level = {
        name: _name,
        hero: _hero,
        enemies: _enemies,
        tiles: _tiles,
        score: _stars.length,
        stars: _stars,
        boxes: _boxes,
        type: _type,
        matrix: transf || {a: 1, b:0, c:0, d:1, e:0, f:0},
        weather: _weather || undefined,
        
        load_hero: function() {
            hero.x = this.hero.x;
            hero.y = this.hero.y;
            hero.velX = 0;
            hero.velY = 0;
            return hero;
        },
        
        load_enemies: function() {
            var enemies = [];
            for (var i=0; i<this.enemies.length; i++){
                var img = (function(){
                    switch(level.enemies[i].src){
                        case enemyImage1.src || enemyImage1_left.src:
                            return {r:enemyImage1, l:enemyImage1_left};
                            break;
                        case enemyImage2.src || enemyImage2_left.src:
                            return {r:enemyImage2, l:enemyImage2_left};
                            break;
                        default:
                            console.log("something wrong");
                            break;
                    }
                    return undefined;
                })();
                enemies.push(new AnimatedObject(this.enemies[i].x,this.enemies[i].y,"enemy1",(new Enemy1(img, this.enemies[i].x, this.enemies[i].to, this.enemies[i].vel))));
            }
            return enemies;
        },
        
        load_tiles: function() {
            var t=[];
            for (var i=0; i<this.tiles.length; i++){
                var img = (function (src) {
                    console.log(src);
                    switch (src) {
                        case (tileImage.src):
                            return tileImage;
                            break;
                        case (tileImage2.src):
                            return tileImage2;
                            break;
                        case (tileImage3.src):
                            return tileImage3;
                            break;
                        case (tileImage4.src):
                            return tileImage4;
                            break;
                        default:
                            console.log("something wrong");
                            break;
                    }
                    return tileImage;   //default
                })(this.tiles[i].image);
                
                
                t.push(new Tile(this.tiles[i].x, this.tiles[i].y, img));
            }
            return t;
        },
        
        load_stars: function() {
            var stars = [];
            for (var i=0; i<this.stars.length; i++){
                stars.push({});
                stars[i].x = this.stars[i].x;
                stars[i].y = this.stars[i].y;
                stars[i].width = this.stars[i].width;
                stars[i].height = this.stars[i].height;
                stars[i].type = this.stars[i].type;
                stars[i].image = starImage;
            }
            return stars;
        },
        
        load_boxes: function() {
            var boxes = [];
            for (var i=0; i<this.boxes.length; i++){
                boxes.push(new AnimatedObject(this.boxes[i].x, this.boxes[i].y, "box", (new Box())));
            }
            return boxes;
        },
        
        print: function() {
            console.log("hero: " + this.hero);
            
            console.log("enemies: ");
            for (var i=0; i<this.enemies.length; i++){
                console.log(this.enemies[i]);
            }
            
            console.log("tiles: ");
            for (var i=0; i<this.tiles.length; i++){
                console.log(this.tiles[i]);
            }
            
            console.log("stars: ");
            for (var i=0; i<this.stars.length; i++){
                console.log(this.stars[i]);
            }
            
            console.log("mode: "+this.type);
            console.log("scale view: "+this.scale_view);
            console.log("translate view: "+this.translate_view);
        }
    };
    
    return level;
}



///////////////////////////////////////////////////////////////////////



var ns = "http://www.w3.org/2000/svg";




