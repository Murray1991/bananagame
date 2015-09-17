window.addEventListener("load", eventWindowLoaded, false);

//game states
const STATE_WAITING = -1;
const STATE_MENU = 0;   //0->1 or 0->2
const STATE_LEVEL = 1;  //1->3 or 1->0
const STATE_EDITOR = 2; //2->0 or 2->3
const STATE_PLAY_LEVEL = 3; //3->1 or 3->2 or 3->4 or 3->5
const GAME_OVER_SUCCESS = 4; //4->3 (retry, nextLevel) 
const GAME_OVER_FAIL = 5;   //4->3 (retry)
const GAME_HELP = 6;

var fps;

function eventWindowLoaded() {
    bananaGame();
}

var Debugger = function () { };
Debugger.log = function (message) {
    try {
        console.log(message);
    } catch (exception) {
        return;
    }        
}

var LoadLevelFile = function (){
    
}

function bananaGame() {
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
    
    function canvasSupport () {
        return Modernizr.canvas;
    }
    
    if (!canvasSupport()) {
        return;
    }
    
    //----------------------------- VAR -----------------------------
    canvas = document.getElementById("canvas");
    svgArea = document.getElementById("svgArea");
    ctx = canvas.getContext('2d');  //AAAAAAAAAAAAAATTEEEEEEEEEEEEEEEEEEENZIOOOOOOOOOOOOOOOOOOOOONEEEEEEEEEEEEEEEEEEEEEEEE
    
    //images
    mountainsImage = new Image();
    skyImage = new Image();
    tileMenuImage = new Image();

    heroImage = new Image();
    relaxImage = new Image();
    jumpUpImage = new Image();
    jumpDownImage = new Image();
    background = new Image();
    boxImage = new Image();
    
    tileImage = new Image();
    tileImage2 = new Image();
    tileImage3 = new Image();
    tileImage4 = new Image();

    cloudImage1 = new Image();
    cloudImage2 = new Image();
    cloudImage3 = new Image();

    bushImage1 = new Image();
    bushImage2 = new Image();
    bushImage3 = new Image();

    treeImage1 = new Image();
    treeImage2 = new Image();
    treeImage3 = new Image();

    enemyImage = new Image();
    enemyImage1_left = new Image();
    enemyImage1 = new Image();
    enemyImage2_left = new Image();
    enemyImage2 = new Image();
    
    starImage = new Image();
    deleteImage = new Image();
    
    previousStateGame = undefined;
    currentStateGame = 0;
    currentStateGameFunc = null;
    var stateList = [];
    //var lvlManager = new levelManager();
    
    //game objects
    hero = {};
    tiles = [];
    stars = [];
    stars_catched = [];
    enemies = [];
    boxes = [];
    lvl_trasf = {};
    
    //----------------------------- FUNCTIONS FOR GAME STATES -----------------------------
    function currentGameState(state){
        if (state == currentStateGame) {
            return true;
        } else {
            return false;
        }
    }
    
    function switchGameState(newState) {
        document.getElementById("transformationControls").style.display = "none";
        previousStateGame = (newState != GAME_OVER_FAIL &&
                             newState != GAME_OVER_SUCCESS &&
                             currentStateGame != GAME_OVER_SUCCESS &&
                             currentStateGame != GAME_OVER_FAIL)? currentStateGame : previousStateGame;
        if (previousStateGame == STATE_EDITOR) {
            editor.hideEditor();
        }
        
        currentStateGame = newState;
        switch (currentStateGame) {
            case STATE_WAITING:
                console.log("wait...");
                break;
            case STATE_MENU:
                currentStateGameFunc = menuState;
                //------------------ onmouseover ----------------
                var menuElements = document.getElementsByClassName("menu_button");
                for (var i=0; i<menuElements.length; i++) {
                    menuElements[i].onmouseover = function() {
                        this.style.stroke = "rgb(255,255,0)";
                    };
                    
                    menuElements[i].onmouseout = function() {
                        this.style.stroke = "rgb(0,0,0)";
                    };
                    
                    menuElements[i].onmousedown = function() {
                        backgroundLayer.offsX = 0;
                        midLayer.offsX = 0;
                        if (this.id == "menu_play") {
                            switchGameState(STATE_LEVEL);
                            //gameLoop() ???
                        } else if (this.id == "menu_editor") {
                            switchGameState(STATE_EDITOR);
                        } else if (this.id == "menu_help") {
                            switchGameState(GAME_HELP);
                        }
                        setCSSProperty("menu","class","visibility: hidden");
                    }
                }

                break;
            case STATE_LEVEL:
                currentStateGameFunc = showLevelsState;
                break;
            case STATE_EDITOR:
                switch (mode) {
                    case "arcade":
                        if (!document.getElementById("ARCADE")){
                            var M = document.getElementById("PUZZLE");
                            M.childNodes[0].textContent = "ARCADE";
                            M.id = "ARCADE";
                        }

                        break;
                    case "puzzle":
                        if (!document.getElementById("PUZZLE")){
                            var M = document.getElementById("ARCADE");
                            M.childNodes[0].textContent = "PUZZLE";
                            M.id = "PUZZLE";
                        }
                        break;
                }

                editor.active = true;
                currentStateGameFunc = levelEditorState;
                document.getElementById("transformationControls").style.display = "block";
                break;
            case STATE_PLAY_LEVEL:
                //ctx.setTransform(1,0,0,1,0,0);
                currentStateGameFunc = playLevelState;
                if (previousStateGame == STATE_EDITOR) {
                    
                    editor.hideEditor();
                    
                }
                
                break;
            case GAME_OVER_SUCCESS:
                currentStateGameFunc = gameSuccessState;
                break;
            case GAME_OVER_FAIL:
                currentStateGameFunc = gameOverState;
                break;

            case GAME_HELP:
                currentStateGameFunc = helpState;
                break;
        }
    }


    function helpState() {
        //third layer, sky
        backgroundLayer.draw(ctx);
        backgroundLayer.update(0.7);

        //mid layer, mountains
        midLayer.draw(ctx);
        
        //first layer
        firstLayer.draw(ctx, 0, canvas.height-tileMenuImage.height + 20);

    ctx.save();
    ctx.font = "25px badaboom";
    
    ctx.textBaseline = "top";
    ctx.textAlign="left"; 
    ctx.fillStyle = "rgba(0,0,0,1)";
    
    var move = "move your banana boy with left/right arrow keys or a/d keys"
    var jump = "and jump with w key or up arrow key"
    ctx.translate(30,50);
    ctx.fillText(move, 0, 0);

    ctx.translate(0,20);
    ctx.fillText(jump,0,0);

    var editor = "in editor mode select and click clikc klicc!"
    var editor2 = "you can set view with arrow keys.........."
    var editor3 = "try wasd keys when you put and select a"
    var editor4 = "scenario's tile in your own level!"

    ctx.translate(450,100);
    ctx.fillText(editor,0,0);
    ctx.translate(0,20);
    ctx.fillText(editor2,0,0);
    ctx.translate(0,20);
    ctx.fillText(editor3,0,0);
    ctx.translate(0,20);
    ctx.fillText(editor4,0,0);

    var goal = "take all the stars in the level"
    var becareful ="be careful, apples are evil!"
    ctx.translate(-450,100);
    ctx.fillText(goal,0,0);
    ctx.translate(0,20);
    ctx.fillText(becareful,0,0);
    
    
    ctx.restore();

        //HERO
        hero.character.direction = "left";

        hero.character.height = 100;
        hero.character.width = 100;
        hero.y = canvas.height-tileMenuImage.height + 20 - hero.character.height +10;
        hero.x = canvas.width - hero.character.width;
        
        hero.grounded = true; hero.character.grounded = true;
        hero.character.behaviors[0].execute();
        hero.render(ctx);
        

    }

    var backgroundLayer = {
        images: [skyImage],

        flipped: true,

        velX: 4,

        offsX: 0,

        offsY: 0,

        side: 1,

        update: function(vx){
            this.velX = vx || this.velX;
            this.setOffs();
        },

        setOffs: function(){
            var offsX = this.offsX + this.velX;

            if (Math.abs(offsX) > 0 && Math.abs(offsX) < canvas.width) {
                this.offsX = offsX;
            } else {
                this.offsX = 0;
            }

        },

        draw: function(ctx){
            var flip = this.flipped,
                offsX = this.offsX,
                offsY = this.offsY,
                imgData = this.images;

            ctx.save();
            
            ctx.translate(-offsX,0);
            
            for (var i=0; i<imgData.length; i++) {
                //initially onscreen:
                ctx.drawImage(imgData[i], 0, 0, canvas.width, canvas.height);

                //initially offscreen:
                ctx.drawImage(imgData[i], canvas.width, 0, canvas.width, canvas.height);
                ctx.drawImage(imgData[i], -canvas.width, 0, canvas.width, canvas.height);
            }
            ctx.restore();
        }
    }

    var midLayer = {
        images: [mountainsImage],

        flipped: true,

        velX: 4,

        offsX: 0,

        offsY: 0,

        update: function(vx){
            this.velX = vx || this.velX;
            this.setOffs();
        },

        setOffs: function(){
            var offsX = this.offsX + this.velX;

            if (Math.abs(offsX) > 0 && Math.abs(offsX) < canvas.width) {
                this.offsX = offsX;
            } else {
                this.offsX = 0;
            }

        },

        draw: function(ctx){
            var flip = this.flipped,
                offsX = this.offsX,
                offsY = this.offsY,
                imgData = this.images;

            ctx.save();
            
            ctx.translate(-offsX,0);
            
            for (var i=0; i<imgData.length; i++) {
                //initially onscreen:
                ctx.drawImage(imgData[i], 0, 0, canvas.width, canvas.height);

                //initially offscreen:
                ctx.drawImage(imgData[i], canvas.width, 0, canvas.width, canvas.height);
                ctx.drawImage(imgData[i], -canvas.width, 0, canvas.width, canvas.height);
            }
            ctx.restore();
        }
    }

    var firstLayer = {
        images: [tileMenuImage],

        flipped: true,

        velX: 4,

        offsX: 0,

        offsY: 0,

        update: function(vx){
            this.velX = vx || this.velX;
            this.setOffs();
        },

        setOffs: function(){
            var offsX = this.offsX + this.velX;

            if (offsX > 0 && offsX < canvas.width) {
                this.offsX = offsX;
            } else {
                this.offsX = 0;
            }

        },

        draw: function(ctx, locx, locy){
            var flip = this.flipped,
                offsX = this.offsX,
                offsY = this.offsY,
                imgData = this.images,
                x = locx || 0,
                y = locy || 0;

            ctx.save();
            
            ctx.translate(-offsX,0);
            
            for (var i=0; i<imgData.length; i++) {
                //initially onscreen:
                ctx.drawImage(imgData[i], 0, y);

                //initially offscreen:
                ctx.drawImage(imgData[i], canvas.width, y);
            }
            ctx.restore();
        }
    }


    
    //MENU STATE FUNCTION
    var vx = 0;
    var flip = true;
    function menuState() {

        //third layer, sky
        backgroundLayer.draw(ctx);
        backgroundLayer.update(0.7);

        //mid layer, mountains
        midLayer.draw(ctx);
        midLayer.update(1.3);

        //front layer, tile's image
        firstLayer.draw(ctx, 0, canvas.height-tileMenuImage.height + 20);
        firstLayer.update(4);

    ctx.save();

    ctx.font = "120px badaboom";
    
    ctx.textBaseline = "top";
    ctx.textAlign="center"; 
    ctx.fillStyle = "rgba(245,245,245,1)";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgb(255,255,0)"
    ctx.strokeText("banana", canvas.width/2, 30);
    ctx.fillText("banana", canvas.width/2, 30);
    
    
    ctx.restore();
    //HERO!
    hero.character.height = 100;
    hero.character.width = 100;
    hero.y = canvas.height-tileMenuImage.height + 20 - hero.character.height +10;
    hero.x = 0;
    hero.character.direction = "right";
    hero.grounded = true; hero.character.grounded = true;
    hero.character.behaviors[0].execute();
    hero.render(ctx);
    hero.character.height = 64;
    hero.character.width = 64;
    }
    
    //----> SVG

    var gameMode = 0; //1 for puzzle, 2 for arcade
    var translate = function(evt){  
        var vel = 10,
            obj = document.getElementById("levels")
            viewMatrix = utils.getTransformMatrix(obj);
            
        if (this.id == "levelmoveup" || evt.keyCode == 38) {
                viewMatrix.f -= vel;
        } else if (this.id == "levelmovedown" || evt.keyCode == 40){
                viewMatrix.f += vel;
        }
        
        utils.setTransformMatrix(obj, viewMatrix);
    }

    function showLevelsState() {

        ctx.save();
        //ctx.setTransform(1,0,0,0,1,0);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height); 
        var w = 100, h = 100, rx = 5, ry = 5, d = 20, i=0;
        
        function createLevelButton(numb) {
            i = (numb%4 == 1)? i+1: i;
            return utils.createSVGButton(numb, 10, (w+d)*((numb-1)%4), (h+d)*i, w, h, rx, ry);
        }


        function showMode(numb) {
            switch(numb){
                case 0:
                    document.getElementById("levels").style.display = "none";
                    document.getElementById("levelmoveup").style.display = "none";
                    document.getElementById("levelmovedown").style.display = "none";
                    document.getElementById("gameMode").style.display = "block";
                    break;
                case 1:
                    mode = "puzzle";
                    game_levels = puzzle_levels.concat(custom_puzzle_levels);
                    document.getElementById("levels").style.display = "block";
                    document.getElementById("levelmoveup").style.display = "block";
                    document.getElementById("levelmovedown").style.display = "block";
                    var levels = document.getElementById("levels").childNodes;
                    for (var i=0; i<game_levels.length; i++) {
                        levels[i].style.display = "block";
                    }

                    for ( ; i<levels.length; i++) {
                        levels[i].style.display = "none";
                    }
                    
                    document.getElementById("gameMode").style.display = "none";
                    break;
                case 2:
                    
                    mode = "arcade";
                    game_levels = arcade_levels.concat(custom_arcade_levels);

                    document.getElementById("levels").style.display = "block";
                    document.getElementById("levelmoveup").style.display = "block";
                    document.getElementById("levelmovedown").style.display = "block";

                    var levels = document.getElementById("levels").childNodes;
                    for (var i=0; i<game_levels.length; i++) {
                        levels[i].style.display = "block";
                    }

                    for ( ; i<levels.length; i++) {
                        levels[i].style.display = "none";
                    }
                    
                    document.getElementById("gameMode").style.display = "none";
                    break;
                default:
                    console.log("ma vaffanculo");
                    break;
            }
        }
        
        if (!document.getElementById("levels") || new_level_saved) {

            if (new_level_saved && document.getElementById("levels")) {
                document.getElementById("levels").parentNode.removeChild(document.getElementById("levels"));
            }
            new_level_saved = false;

            var xT = ((w+d)*3 + w)/2,
                group = utils.createSVGGroup("levels", "textbutton"),
                gr = utils.createSVGGroup("gameMode", "textbutton"),
                length;
            
            group.setAttribute("transform", "translate("+xT+",50)");
            gr.setAttribute("transform", "translate("+xT+",50)");

            if (!document.getElementById("puzzle")) {
                var p = utils.createSVGButton("puzzle", "40px", 0, (h+d)*2, w*2 + d, h, 0, 0);
                p.onmousedown = function(){
                    gameMode = 1; 
                    utils.getTransformMatrix(document.getElementById("levels")).f = 0;
                    document.body.addEventListener("keydown", translate, false);
                };
                document.getElementById("levelmoveup").addEventListener("mousedown", translate, false);
                document.getElementById("levelmovedown").addEventListener("mousedown", translate, false);
                gr.appendChild(p);
            }

            if (!document.getElementById("arcade")) {
                var p = utils.createSVGButton("arcade", "40px", (w+d)*2, (h+d)*2, w*2 + d, h, 0, 0);
                p.onmousedown = function(){
                    gameMode = 2; 
                    utils.getTransformMatrix(document.getElementById("levels")).f = 0;
                    document.body.addEventListener("keydown", translate, false);
                };
                //document.getElementById("levelmoveup").addEventListener("mousedown", translate, false);
                //document.getElementById("levelmovedown").addEventListener("mousedown", translate, false);
                gr.appendChild(p);
            }
            svg.appendChild(gr);

            length = (custom_arcade_levels.length > custom_puzzle_levels.length)? custom_arcade_levels.length : custom_puzzle_levels.length;
            for (var numb=1; numb < length + 13; numb++) {
                var level = createLevelButton(numb);
                
                level.childNodes[1].addEventListener("mouseover", function(){this.style.stroke = "rgb(255,255,0)";})
                level.childNodes[1].addEventListener("mouseout", function(){this.style.stroke = "rgb(0,0,0)";})
                level.childNodes[1].addEventListener("mousedown", function(){
                    
                    var l = game_levels[this.parentNode.id - 1],
                        m = l.matrix,
                        lvl = retlevel(l.name, l.hero, l.enemies, l.tiles, l.stars, l.boxes, l.type, m, l.weather);
                        
                    lastLevelPlayed = lvl;
                    document.getElementById("levels").style.display = "none";
                    document.getElementById("levelmoveup").style.display = "none";
                    document.getElementById("levelmovedown").style.display = "none";
                    countStars = lastLevelPlayed.score;
                    
                    var m = lvl.matrix;
                    
                    ctx.save();
                    ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                    hero = lvl.load_hero();
                    enemies = lvl.load_enemies();
                    stars = lvl.load_stars();
                    stars_catched = [];
                    tiles = lvl.load_tiles();
                    boxes = lvl.load_boxes();
            
                    utils.getTransformMatrix(document.getElementById("levels")).f = 0;
                    document.body.removeEventListener("keydown", translate, false);
                    //document.getElementById("levelmoveup").removeEventListener("mousedown", translate, false);
                    //document.getElementById("levelmovedown").removeEventListener("mousedown", translate, false);
                    switchGameState(STATE_PLAY_LEVEL);
                    
                    //playLevel(lastLevelPlayed);
                })
                //level.onmousedown = function() {} TODO
                group.appendChild(level);
            }
            svg.appendChild(group);
        } 

        showMode(gameMode);
        ctx.restore();
    }
    
    //----> SVG
    function levelEditorState() {
        //levelEditor();
        //console.log("editor state func...")
        if (mode == "puzzle") {
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);   //qualcosa per il meteo...
        } else if (mode == "arcade") {
            backgroundLayer.draw(ctx);
            backgroundLayer.update(0.2);

            midLayer.draw(ctx);
        }

        if (editor.active) {
            //show editor
            editor.showEditor();
            editor.active = false;
        }
        if (weather == "snow") {
            snowFall(beads);
        }
    }
    
    function drawWeather(forecast, ctx){
        var SUNNY = 0,
            RAINY = 1,
            SNOWY = 2;
            
        switch (forecast){
            case SUNNY:
                break;
            case RAINY:
                break;
            case SNOWY:
                break;
            default:
                console.log("something wrong in drawWeather");
                break;
        }
    }
    
    //----> CANVAS PLAYLEVELSTATE
    var velStar = 0.5;
    setInterval(function(){velStar *= -1}, 1400);
    function updateStar(s){
        s.y = parseFloat(s.y) - velStar;

    }

    var due =1;
    var moving = true;
    var catched = false;
    function playLevelState() {

        countStars = stars.length;
        
        //render();
        //drawBackground();
        if (mode == "puzzle"){
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            drawBackground();
            ctx.restore();
        } else if (mode == "arcade"){
            ctx.save();
            //var m = lastLevelPlayed.matrix;
            ctx.setTransform(1,0,0,1,0,0);

            backgroundLayer.draw(ctx);
            backgroundLayer.update(0.1);

            midLayer.draw(ctx);
            if(hero.character.inMove && moving){
                if (hero.character.direction == "left"){
                    backgroundLayer.update(-0.4);
                    midLayer.update(-1.3);
                }

                if (hero.character.direction == "right"){
                    backgroundLayer.update(0.4);
                    midLayer.update(1.3);
                }
            }
            ctx.restore();
        }

        moving = true;
        
        if (lastLevelPlayed.weather == "snow") {
            snowFall(beads);
        }

        //ctx.save();
        var m = lastLevelPlayed.matrix;

        drawTiles();
        drawBoxes();
        drawHero();
        drawStars();
        drawEnemies();
        //ctx.setTransform(m.a,m.b,m.c,m.d,,m.f);
        
        //ctx.restore();
        // funcPrintBabbeo();
        // funcPrintQualcosa();
        
        // //checkKeys();
        // //update();
        // printQualcosa = false;
        // printBabbeo = false;
        
        hero.update();
       
        //check collision -----> meno codice facendo array di game_objects, scorro array e testo tipo di ogni game-object
        var dir, allnull = true;
        for (var i=0 ; i<tiles.length; i++) {
            dir = hero.collide(tiles[i]);
            if (dir == "left" || dir == "right") {moving = false;}
            allnull = allnull && (dir == null);
        }

        if (allnull) {
            hero.grounded = false;
        }
        

        for (var i=0; i<stars.length; i++){
            updateStar(stars[i]);
            if (hero.collide(stars[i])){
                playSound(wavStar);
                catchedStar(stars[i], i);
                //printQualcosa = true;
            }
        }
        
        //draw catched stars...
        (function(){
            for (var i=0; i<stars_catched.length; i++){
             //console.log("something happens...");
             var s=stars_catched[i];
             cloudStar(ctx,s,-60);
            }
        })();
        
        for (var i= 0; i<boxes.length; i++){
            boxes[i].update();
            var dir = hero.collide(boxes[i]);
            if ( (dir == "left" || dir == "right") && hero.inMove) {
                boxes[i].velX = hero.velX;
            }
            boxes[i].grounded = (dir == "bottom");
        }
        
        for (var i = 0; i<enemies.length; i++) {
            
            if (hero.collide(enemies[i])) {
                if (catched) {
                    playSound(wavGameOver);
                    ctx.restore();
                    catched = false;
                    switchGameState(GAME_OVER_FAIL);
                } else {
                    catched = true;
                }

            }

            enemies[i].update();
        }

        var l = lastLevelPlayed,
            m = l.matrix,
            y = m.d*hero.y + m.f;   //y in coordinate vista


        if (y > canvas.height){
            playSound(wavGameOver);
            ctx.restore();
            switchGameState(GAME_OVER_FAIL);
        }
        
        if (stars.length == 0 && stars_catched.length == 0) {
            playSound(wavWin);
            ctx.restore();
            switchGameState(GAME_OVER_SUCCESS);
        }


    }
    
    function playLevel(level){
        var m = level.matrix;
        
        console.log("start level...");
        ctx.save();
        ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
        hero = level.load_hero();
        enemies = level.load_enemies();
        stars = level.load_stars();
        tiles = level.load_tiles();
        boxes = level.load_boxes();
        stars_catched = [];
        switchGameState(STATE_PLAY_LEVEL);
        gameLoop();
    }
    
    //gameSuccessState function
    function gameSuccessState() {
        
        if (!document.getElementById("Level Completed!")) {
            
            
            var w = 500, h = 300, posX = (canvas.width-w)/2, posY = (canvas.height - h)/5, wR = 100, hR = 60,
                game_over = utils.createSVGButton("Level Completed!", 60, posX, posY, w, h, 5, 5, "game_over"),
                group = utils.createSVGGroup(),
                editor = utils.createSVGButton("Editor", 30, (w-90)/2, h-hR-10, wR, hR, 5, 5, "textbutton" ),
                retry = utils.createSVGButton("Retry", 30, 60, h-hR-10, wR, hR, 5, 5, "textbutton"),
                next = utils.createSVGButton("Next", 30, w-wR-60, h-hR-10, wR, hR, 5, 5, "textbutton");
                
            group.appendChild(retry);
            group.appendChild(next);
            group.appendChild(editor);
            game_over.style.display = "none";
            game_over.appendChild(group);
            svg.appendChild(game_over);
            
            //game_over.childNodes[0].y.baseVal.value = -200;
            //game_over.childNodes[0].setAttribute("y", canvas.height/2 - 20);
            group.setAttribute("transform","translate("+posX+","+posY+")");
            
            
            retry.onmouseover = function() {
                this.childNodes[1].style.stroke = "rgb(255,255,0)";
            }
            
            retry.onmouseout = function() {
                this.childNodes[1].style.stroke = "rgb(0,0,0)";
            }
            
            retry.onmousedown = function() {
                var l = game_levels[lastLevelPlayed.name- 1] || lastLevelPlayed,
                        m = l.matrix || {a:1,b:0,c:0,d:1,e:0,f:0},
                        lvl = retlevel(l.name, l.hero, l.enemies, l.tiles, l.stars, l.boxes, l.type, m);
                              
                midLayer.offsX = 0;
                backgroundLayer.offsX = 0;
                lastLevelPlayed = lvl;
                game_over.style.display = "none";
                countStars = lastLevelPlayed.score;
                playLevel(lastLevelPlayed);

            }
            
            next.onmouseover = function() {
                this.childNodes[1].style.stroke = "rgb(255,255,0)";
            }
            
            next.onmouseout = function() {
                this.childNodes[1].style.stroke = "rgb(0,0,0)";
            }
            
            next.onmousedown = function() {
                //qua dovrei caricare il livello successivo...
                var n = parseInt(lastLevelPlayed.name),
                    l = game_levels[n] 
                    m = l.matrix,
                    lvl = retlevel(l.name, l.hero, l.enemies, l.tiles, l.stars, l.boxes, l.type, m);

                lastLevelPlayed = lvl;
                game_over.style.display = "none";
                countStars = lastLevelPlayed.score;

                ctx.save();
                ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                hero = lvl.load_hero();
                enemies = lvl.load_enemies();
                stars = lvl.load_stars();
                stars_catched = [];
                tiles = lvl.load_tiles();
                boxes = lvl.load_boxes();
        
                switchGameState(STATE_PLAY_LEVEL);
                gameLoop();
            }

            editor.onmousedown = function(){
                game_over.style.display = "none";
                switchGameState(STATE_EDITOR);
                gameLoop();
            }
            
        }
        
        function fadeRectangle(x, y, w, h) {
            var steps = 50,
            //dr = (255 - r) / steps,
            //dg = (255 - g) / steps,
            //db = (255 - b) / steps,
            da = (1-0.5)/steps
            i = 0,
            interval = setInterval(function() {
                ctx.save();
                //var m = lastLevelPlayed.matrix;
                //ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f);
                ctx.setTransform(1,0,0,1,0,0);
                ctx.fillStyle = 'rgba(' + 0 + ','
                                       + 0 + ','
                                       + 0 + ','
                                       + parseFloat(0 + da) + ')';
                ctx.fillRect(x, y, w, h);
                ctx.restore();
                i++;
                if(i === steps) {
                    clearInterval(interval);
                    document.getElementById("Level Completed!").style.display = "block";
                }
            }, 20);
        }

        fadeRectangle(0, 0, canvas.width, canvas.height);
    }
    
    //game over state function
    function gameOverState() {
        
        if (!document.getElementById("Game Over!")) {
            var w = 500, h = 300, posX = (canvas.width-w)/2, posY = (canvas.height - h)/5, wR = 100, hR = 60,
                game_over = utils.createSVGButton("Game Over!", 60, posX, posY, w, h, 5, 5, "game_over"),
                group = utils.createSVGGroup(),
                retry = utils.createSVGButton("Retry", 30, 60, h-hR-10, wR, hR, 5, 5, "textbutton"),
                editor = utils.createSVGButton("Editor", 30, (w-90)/2, h-hR-10, wR, hR, 5, 5, "textbutton" );
                levels = utils.createSVGButton("Levels", 30, w-wR-60, h-hR-10, wR, hR, 5, 5, "textbutton");
                
            group.appendChild(retry);
            group.appendChild(levels);
            group.appendChild(editor);
            game_over.style.display = "none";
            game_over.appendChild(group);
            svg.appendChild(game_over);
            
            //game_over.childNodes[0].y.baseVal.value = -200;
            //game_over.childNodes[0].setAttribute("y", canvas.height/2 - 20);
            group.setAttribute("transform","translate("+posX+","+posY+")");
            
            
            retry.onmouseover = function() {
                this.childNodes[1].style.stroke = "rgb(255,255,0)";
            }
            
            retry.onmouseout = function() {
                this.childNodes[1].style.stroke = "rgb(0,0,0)";
            }

            retry.onmousedown = function() {
                var l = game_levels[lastLevelPlayed.name- 1] || lastLevelPlayed,
                        m = l.matrix || {a:1,b:0,c:0,d:1,e:0,f:0},
                        lvl = retlevel(l.name, l.hero, l.enemies, l.tiles, l.stars, l.boxes, l.type, m);
                              
                midLayer.offsX = 0;
                backgroundLayer.offsX = 0;
                lastLevelPlayed = lvl;
                game_over.style.display = "none";
                countStars = lastLevelPlayed.score;
                playLevel(lastLevelPlayed);
            }
            
            levels.onmouseover = function() {
                this.childNodes[1].style.stroke = "rgb(255,255,0)";
            }
            
            levels.onmouseout = function() {
                this.childNodes[1].style.stroke = "rgb(0,0,0)";
            }
            
            levels.onmousedown = function() {
                game_over.style.display = "none";
                ctx.setTransform(1,0,0,1,0,0);
                switchGameState(STATE_LEVEL);
                gameLoop();
            }

            editor.onmousedown = function(){
                game_over.style.display = "none";
                switchGameState(STATE_EDITOR);
                gameLoop();
            }
            
        }
        
        function fadeRectangle(x, y, w, h) {
            var steps = 50,
            //dr = (255 - r) / steps,
            //dg = (255 - g) / steps,
            //db = (255 - b) / steps,
            da = (1-0.5)/steps
            i = 0,
            interval = setInterval(function() {
                ctx.save();
                //var m = lastLevelPlayed.matrix;
                //ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f);
                ctx.setTransform(1,0,0,1,0,0);
                ctx.fillStyle = 'rgba(' + 0 + ','
                                       + 0 + ','
                                       + 0 + ','
                                       + parseFloat(0 + da) + ')';
                ctx.fillRect(x, y, w, h);
                ctx.restore();
                i++;
                if(i === steps) {
                    clearInterval(interval);
                    document.getElementById("Game Over!").style.display = "block";
                }
            }, 20);
        }

        fadeRectangle(0, 0, canvas.width, canvas.height);
    }
    
    //----------------------------- FUNCTIONS FOR DRAWING -----------------------------
    function setIcons() {
        
    }
    
    function drawBackground(args) {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
    
    function drawTiles() {
        var scale = lastLevelPlayed.matrix.a;
        for (var i=0; i<tiles.length; i++) {
                tiles[i].render(ctx);
        }

    }
    
    function drawHero() {
        hero.render(ctx);
    }
    
    function drawBoxes() {
        for (var i=0; i<boxes.length; i++) {
            boxes[i].render(ctx);
        }
    }
    
    function drawStars() {
        for (var i = 0; i< stars.length ; i++){

            ctx.drawImage(starImage,stars[i].x,stars[i].y,stars[i].width, stars[i].height);

        }
    }
    
    function drawEnemies() {
        for (var i=0 ; i<enemies.length; i++){
            enemies[i].render(ctx);
        }
    }
    
    function drawSnow() {
        
    }
    
    //--------------------------------------------------
    function gameStateInit() {
        function flip(img) {
            //flipped image
            var myctx = document.createElement("canvas").getContext("2d");
            myctx.canvas.width = 128;
            myctx.canvas.height = 128;
            myctx.translate(myctx.canvas.width,0);
            myctx.scale(-1,1);
            img.onload = function(){
                myctx.drawImage(img,0,0);
            }
            return myctx.canvas;
        }

        skyImage.src = "images/sky_layer.png"
        skyImage.onload = itemLoaded;

        mountainsImage.src = "images/mountains.png";
        mountainsImage.onload = itemLoaded;

        tileMenuImage.src = "images/tileMenuImage.png";
        tileMenuImage.onload = itemLoaded;
        
        heroImage.src = "images/banana_sprite.png";   //TOFIX
        heroImage.onload = itemLoaded;

        relaxImage.src = "images/banana_relax.png";
        relaxImage.onload = itemLoaded;

        jumpUpImage.src = "images/banana_jump_up.png";
        jumpUpImage.onload = itemLoaded;

        jumpDownImage.src = "images/banana_jump_down.png";
        jumpDownImage.onload = itemLoaded;

        cloudImage1.src = "images/bg_cloud1.png";
        cloudImage1.onload = itemLoaded;

        cloudImage2.src = "images/bg_cloud2.png";
        cloudImage2.onload = itemLoaded;

        cloudImage3.src = "images/bg_cloud3.png";
        cloudImage3.onload = itemLoaded;

        boxImage.src = "images/tile-box.png";
        boxImage.onload = itemLoaded;

        tileImage.src = "images/tile-brown-1.png";
        tileImage.onload = itemLoaded;

        tileImage2.src = "images/tile-brown-2.png";
        tileImage2.onload = itemLoaded;

//11
        tileImage3.src = "images/tile-brown-3.png";
        tileImage3.onload = itemLoaded;

        tileImage4.src = "images/tile-brown-4.png";
        tileImage4.onload = itemLoaded;
        
        enemyImage.src = "images/mela-rossa.png";
        enemyImage.onload = itemLoaded;

        enemyImage1_left.src = "images/mela-rossa.png";
        enemyImage1_left.onload = itemLoaded;

        enemyImage1 = flip(enemyImage1_left);
        //it no needs of itemLoaded

        enemyImage2_left.src = "images/mela-verde.png";
        enemyImage2_left.onload = itemLoaded;

        enemyImage2 = flip(enemyImage2_left);
        //it no needs of itemLoaded
        
        starImage.src = "images/star.png";
        starImage.onload = itemLoaded;

        deleteImage.src = "images/delete.png";
        deleteImage.onload = itemLoaded;
        
        background.src = "images/sky-background.png"
        background.onload = itemLoaded;
//19

        //sounds
        starSound1 = document.createElement("audio");
        document.body.appendChild(starSound1);
        starSound1.setAttribute("src", "music/star.wav");
        starSound1.setAttribute("type", "audio/wave");
        starSound1.addEventListener("canplaythrough", itemLoaded, false);

        starSound2 = document.createElement("audio");
        document.body.appendChild(starSound2);
        starSound2.setAttribute("src", "music/star.wav");
        starSound2.setAttribute("type", "audio/wave");
        starSound2.addEventListener("canplaythrough", itemLoaded, false);

        starSound3 = document.createElement("audio");
        document.body.appendChild(starSound3);
        starSound3.setAttribute("src", "music/star.wav");
        starSound3.setAttribute("type", "audio/wave");
        starSound3.addEventListener("canplaythrough", itemLoaded, false);
        
        placingSound1 = document.createElement("audio");
        document.body.appendChild(placingSound1);
        placingSound1.setAttribute("src","music/placing.wav");
        placingSound1.setAttribute("type","audio/wave");
        placingSound1.addEventListener("canplaythrough", itemLoaded, false);
        
        placingSound2 = document.createElement("audio");
        document.body.appendChild(placingSound2);
        placingSound2.setAttribute("src","music/placing.wav");
        placingSound2.setAttribute("type","audio/wave");
        placingSound2.addEventListener("canplaythrough", itemLoaded, false);

        placingSound3 = document.createElement("audio");
        document.body.appendChild(placingSound3);
        placingSound3.setAttribute("src","music/placing.wav");
        placingSound3.setAttribute("type","audio/wave");
        placingSound3.addEventListener("canplaythrough", itemLoaded, false);

        //enemySounds?????

        gameoverSound = document.createElement("audio");
        document.body.appendChild(gameoverSound);
        gameoverSound.setAttribute("src", "music/game-over.wav"); //or failure
        gameoverSound.setAttribute("type", "audio/wave");
        gameoverSound.addEventListener("canplaythrough", itemLoaded, false);

        failureSound = document.createElement("audio");
        document.body.appendChild(failureSound);
        failureSound.setAttribute("src", "music/failure.wav");
        failureSound.setAttribute("type", "audio/wave");
        failureSound.addEventListener("canplaythrough", itemLoaded, false);
       
        jumpSound1 = document.createElement("audio");
        document.body.appendChild(jumpSound1);
        jumpSound1.setAttribute("src","music/jump.wav");
        jumpSound1.addEventListener("canplaythrough", itemLoaded, false);

        winSound = document.createElement("audio");
        document.body.appendChild(winSound);
        winSound.setAttribute("src", "music/win.wav"); //or failure
        winSound.addEventListener("canplaythrough", itemLoaded, false);

        musicSound = document.createElement("audio");
        document.body.appendChild(musicSound);
        musicSound.setAttribute("src", "music/POL-cave-story-short.wav"); //or failure
        musicSound.addEventListener("canplaythrough", itemLoaded, false);
//30   

        //background.addEventListener("load",startGame,false); // da cambiare
    }

    function itemLoaded() {

        if (typeof loadCount == 'undefined') {
            loadCount = 0;
        }
        
        loadCount++;
        console.log("loading: " + loadCount);
        console.log(this);

        if (loadCount >= 30){
            console.log("remove listeners...");
            starSound1.removeEventListener("canplaythrough", itemLoaded, false);
            starSound2.removeEventListener("canplaythrough", itemLoaded, false);
            starSound3.removeEventListener("canplaythrough", itemLoaded, false);
            
            placingSound1.removeEventListener("canplaythrough", itemLoaded, false);
            placingSound2.removeEventListener("canplaythrough", itemLoaded, false);
            placingSound3.removeEventListener("canplaythrough", itemLoaded, false);
            
            jumpSound1.removeEventListener("canplaythrough", itemLoaded, false);
            winSound.removeEventListener("canplaythrough", itemLoaded, false);
            gameoverSound.removeEventListener("canplaythrough", itemLoaded, false);
            failureSound.removeEventListener("canplaythrough", itemLoaded, false);
            musicSound.removeEventListener("canplaythrough", itemLoaded, false);

            //adding sounds in pool of sounds
            sounds.push({name:wavMusic, element: musicSound, played:false});
            sounds.push({name:"star", element: starSound1, played:false});
            sounds.push({name:"star", element: starSound1, played:false});
            sounds.push({name:"star", element: starSound1, played:false});
            
            sounds.push({name:"placing", element: placingSound1, played:false});
            sounds.push({name:"placing", element: placingSound1, played:false});
            sounds.push({name:"placing", element: placingSound1, played:false});
            
            sounds.push({name:"jump", element: jumpSound1, played:false});
            sounds.push({name:"gameover", element: gameoverSound, played:false});
            sounds.push({name:"failure", element: failureSound, played:false});
            sounds.push({name:"win", element: winSound, played:false});

            musicSound.loop = true;
            playSound(wavMusic, 0.2);
            switchGameState(STATE_MENU);
            startGame();
        }
    }


    function loadImages() {
        function flip(img) {
            //flipped image
            var myctx = document.createElement("canvas").getContext("2d");
            myctx.canvas.width = 128;
            myctx.canvas.height = 128;
            myctx.translate(myctx.canvas.width,0);
            myctx.scale(-1,1);
            img.onload = function(){
                myctx.drawImage(img,0,0);
            }
            return myctx.canvas;
        }
        
        
        heroImage.src = "images/banana_sprite.png";   //TOFIX
        relaxImage.src = "images/banana_relax.png";
        jumpUpImage.src = "images/banana_jump_up.png";
        jumpDownImage.src = "images/banana_jump_down.png";
        
        cloudImage1.src = "images/bg_cloud1.png";
        cloudImage2.src = "images/bg_cloud2.png";
        cloudImage3.src = "images/bg_cloud3.png";

        boxImage.src = "images/tile-box.png";
        tileImage.src = "images/tile-brown-1.png";
        tileImage2.src = "images/tile-brown-2.png";
        tileImage3.src = "images/tile-brown-3.png";
        tileImage4.src = "images/tile-brown-4.png";
        
        enemyImage.src = "images/mela-rossa.png";
        //enemy images
        enemyImage1_left.src = "images/mela-rossa.png";
        enemyImage1 = flip(enemyImage1_left);
        
        enemyImage2_left.src = "images/mela-verde.png";
        enemyImage2 = flip(enemyImage2_left);
        
        starImage.src = "images/star.png";
        deleteImage.src = "images/delete.png";

        
        background.src = "images/sky-background.png"

        //treeImage1 = "images/.png";
        //treeImage2 = "images/.png";
        //treeImage3 = "images/.png";

        //bushImage1 = "images/.png";
        //bushImage2 = "images/.png";
        //bushImage3 = "images/.png";
        
        //background.addEventListener("load",startGame,false);
    }
    
    //function render() {
    //    
    //    drawBackground();
    //    
    //    drawTiles();
    //    drawHero();
    //    drawStars();
    //    drawEnemies();
    //
    //    funcPrintBabbeo();
    //    funcPrintQualcosa();
    //}
    
    //something weird
    var printBabbeo = false;
    var funcPrintBabbeo = function(){
        if (printBabbeo) {
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            ctx.font = "bold 70px verdana";
            ctx.textBaseline = "top";
            ctx.textAlign="center"; 
            ctx.fillStyle = "rgb(245,245,0)";
            ctx.fillText("BABBEO", canvas.width/2, canvas.height/2);
            ctx.restore();
        }
    }
    
    var printQualcosa = false;
    var catched = {index: 0, bool: false};
    var funcPrintQualcosa = function(){
        var array = ["Yeah!", "Vai che sei grande!", "YUHUUU!", "Happy moment for you!", "WOOOSH!", "GOGOGOGO!"];
        if (printQualcosa && !catched.bool) {
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            ctx.font = "bold 35px verdana";
            ctx.textBaseline = "top";
            ctx.textAlign="center"; 
            ctx.fillStyle = "rgb(0,245,245)";
            ctx.fillText(array[Math.floor(Math.random() * array.length)], canvas.width/2, 30);
            ctx.restore();
        }
    }
    
    var printLose = false;
    var funcPrintLose = function(){
        if (printLose) {
            console.log("loooooser");
        }
    }
    
    //function update() {
    //    printQualcosa = false;
    //    printBabbeo = false;
    //    hero.update();
    //    
    //    //check collision
    //    for (var i=0 ; i<tiles.length; i++) {
    //        hero.collide(tiles[i]);
    //    }
    //    
    //    for (var i=0; i<stars.length; i++){
    //        if (hero.collide(stars[i])){
    //            printQualcosa = true;
    //        }
    //    }
    //    
    //    for (var i = 0; i<enemies.length; i++) {
    //        enemies[i].update();
    //        if (hero.collide(enemies[i])) {
    //            printBabbeo = true;
    //        }
    //    }
    //}
    
    
    function showFPS(){
        ctx.font = " 20px badaboom";
        ctx.fillText(parseInt(fps) + " fps", canvas.width-90, 30);
    }
    //    ctx.fillText(fps + " fps", canvas.width - 90, 30);
    //}
    
    var beads = initScenario();
    var lastRun;
    function gameLoop(){
        if(!lastRun) {
            lastRun = new Date().getTime();
            //requestAnimFrame(snowFall);
            //return;
        }
        var delta = (new Date().getTime() - lastRun)/1000;
        lastRun = new Date().getTime();
        fps = 1/delta;
        
        
        //if (currentStateGame == STATE_PLAY_LEVEL || currentStateGame == STATE_MENU || currentStateGame == STATE_EDITOR || currentStateGame == STATE_LEVEL) {
        if (currentStateGame != GAME_OVER_FAIL && currentStateGame != GAME_OVER_SUCCESS) requestAnimFrame(gameLoop);
        //}
        
        currentStateGameFunc();
        
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        if (currentStateGame == STATE_PLAY_LEVEL || currentStateGame == STATE_MENU) {
            showFPS();
        }
        ctx.restore();
        //console.log("in gameLoop");
    }
    
    function startGame() {
        //lvlManager.selectLevel(0);  //per ora...
    
        //loading game objects
        hero = new AnimatedObject(100,100,"hero",(new Hero(heroImage))) //x:100, y:100, type: "hero" ,image: heroImage
        tiles = [];//lvlManager.loadTiles();
        stars = [];//lvlManager.loadStars();
        enemies = [];//lvlManager.loadEnemies();
        editor  = createEditorBar(switchGameState);
        //editor.active = false;
        weather = "sun";
        mode = "puzzle";

        gameLoop();
    }
    
    //----------------------------- MAIN -----------------------------
    //var mute = false;
    var buttons = document.getElementsByClassName("button");

    for (var i=0; i<buttons.length; i++) {
        buttons[i].addEventListener("mouseover", onMouseOver, false);
        buttons[i].addEventListener("mouseout", onMouseOut, false);
    
        if (buttons[i].id == "back") {
            buttons[i].onmousedown = function() {
                midLayer.offsX = 0;
                backgroundLayer.offsX = 0;
                //TOFIX!!!!!
                if (currentStateGame == STATE_EDITOR || (currentStateGame == STATE_LEVEL && gameMode == 0) || currentStateGame == GAME_HELP) {
                    setCSSProperty("menu", "class", "visibility: visible");
                }
                
                switch (currentStateGame) {            
                    case STATE_EDITOR:
                        if (document.getElementById("selectorRect"))
                            document.getElementById("selectorRect").setAttributeNS(null, "display", "none");
                        
                        if (document.getElementById("vel_enemy"))
                            document.getElementById("vel_enemy").style.display = "none";

                        switchGameState(STATE_MENU);
                        break;
                    case GAME_HELP:
                        switchGameState(STATE_MENU);
                        break;
                    case STATE_LEVEL:
                        if (gameMode == 0) {
                            document.getElementById("gameMode").style.display = "none";
                            switchGameState(STATE_MENU);
                        }

                        if (gameMode == 1 || gameMode == 2) {
                            gameMode = 0;
                            document.body.removeEventListener("keydown", translate, false);
                        } 
                        break;
                    case STATE_PLAY_LEVEL:
                        // if (previousStateGame == STATE_LEVEL && (gameMode==1 || gameMode == 2))
                        //     document.addEventListener("keydown",translate,false);
                        ctx.restore();
                        switchGameState(previousStateGame);
                        break;
                }
            }
        }

        if (buttons[i].id == "note") {

            buttons[i].onmousedown = function() {
                console.log("mah...");

                if (!mute) {
                    document.getElementById("volumeline").style.display = "block";
                    mute = true;
                    for (var i=0; i<sounds.length; i++) {
                        sounds[i].element.muted = true;
                    }
                } else {
                    document.getElementById("volumeline").style.display = "none";
                    mute = false;
                    for (var i=0; i<sounds.length; i++) {
                        sounds[i].element.muted = false;
                    }
                }
            }
        }
        
    }
    
    //var editor;
    
    //loading images and start
    //switchGameState(STATE_MENU);
    
    //var mouseMng = new mouseManager();
    //mouseMng.startListener();
    //loadImages();
    gameStateInit();
    

    //PROVE NUOVO EDITOR DI LIVELLO ---> TOFIX
    var editor;
}
