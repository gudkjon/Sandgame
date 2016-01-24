/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {
// "PRIVATE" DATA

_map : new Array(g_canvas.width/2),
_wall : [],
_sand   : [],
_water : [],
_salt   : [],
_oil : [],
_fire : [],
_plant : [],
_spout : [],
_cera : [],
_questionmark : [],
_players : [],
_penSize : 0,
_centerX : g_canvas.width/4,
_centerY : lowerBorder/4,
_scale : 1,
_startX : 0,
_startY : 0,

// "PRIVATE" METHODS

_changePenSize : function() {
    this._penSize++;
    this._penSize %= 10;
},

_changeScale : function(delta, mouseX, mouseY) {
    var maxWidth = g_canvas.width;
    var maxCols = maxWidth/2;
    var maxHeight = lowerBorder;
    var maxRows = maxHeight/2;
    var minCenterX = maxCols/(((this._scale+delta)*2)||2);
    var minCenterY = maxRows/(((this._scale+delta)*2)||2);
    var maxCenterX = maxCols-minCenterX;
    var maxCenterY = maxRows-minCenterY;
    this._centerX = this._centerX-(maxWidth/2-mouseX)/(2*this._scale);
    this._centerY = this._centerY-(maxHeight/2-mouseY)/(2*this._scale);
    this._centerX = Math.min(this._centerX, maxCenterX);
    this._centerY = Math.min(this._centerY, maxCenterY);
    this._centerX = Math.max(this._centerX, minCenterX);
    this._centerY = Math.max(this._centerY, minCenterY);
    this._centerX = Math.floor(this._centerX);
    this._centerY = Math.floor(this._centerY);
    this._scale += delta;
    this._scale = this._scale || 1;
    this._scale = this._scale > 9 ? 9 : this._scale; 
    console.log("\n mx " + mouseX + "\n my " + mouseY + "\n cx " + this._centerX + "\n cy " + this._centerY + "\n sc " + this._scale);
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._wall, this._cera, this._plant, this._salt, 
                        this._oil, this._water, this._fire, this._players,
                        this._spout, this._sand, this._questionmark];
    //console.log(this._map.length);
    for (var i = this._map.length - 1; i >= 0; i--) {
        this._map[i] = new Array(lowerBorder/2);
        for(var j = this._map[i].length-1; j >= 0; j--) {
            this._map[i][j] = null;
        }
    };
},

_outOfBounds : function(cx, cy) {
    return cx < 0 || cx >= g_canvas.width/2 || cy < 0 || cy >= lowerBorder/2;
},

_makeBottomBorder : function() {
    for(var i = 0; i < g_canvas.width/2; i++) {
        this._generateWall({
            cx : i,
            cy : lowerBorder/2-1
        });
    }
},
_generateElement : function(type, cx, cy) {
    if(this._outOfBounds(cx,cy)) return;
    if(type === '???') type = "Questionmark";
    for(var i = -(this._penSize); i <= this._penSize; i++) {
        for(var j = 0; j <= this._penSize-Math.abs(i); j++) {
            window["entityManager"]["_generate"+type]({
                cx : cx+i,
                cy : cy+j
            });
            window["entityManager"]["_generate"+type]({
                cx : cx+i,
                cy : cy-j
            });        
        }
    }
    
},


_deleteElement : function(cx,cy) {
    if(this._outOfBounds(cx,cy)) return;
    //console.log("deleting "+cx+" "+cy);
    for(var i = -(this._penSize); i <= this._penSize; i++) {
        var gridCol = this._map[cx+i];        
        for(var j = 0; j <= this._penSize-Math.abs(i); j++) {
            if(gridCol[cy+j])
                gridCol[cy+j].kill();
            if(gridCol[cy-j]) 
                gridCol[cy-j].kill();
        }
    }
},
_generatePlayer : function(descr) {
    console.log("generating: " + descr.cx);
    for(var i = -1; i < 2; i++) {
        if(this._map[descr.cx][descr.cy+i]) {
            return;
        }
        if(this._map[descr.cx+i][descr.cy]) {
           return;
        }
        for(var j = -1; j < 2; j++) {
            if(this._map[descr.cx+i][descr.cy+j]) {
                return;
            }
        }
    }
    var e = new Player(descr);
    this._players.push(e);
    for(var i = -1; i < 2; i += 2) {
        this._map[descr.cx][descr.cy+i] = e;
        this._map[descr.cx+i][descr.cy] = e;    
        for(var j = -1; j < 2; j += 2) {
            this._map[descr.cx+i][descr.cy+j] = e;     
        }
    }
    this._map[descr.cx][descr.cy] = e;

},
_generateWall : function(descr) {
    if(this._map[descr.cx][descr.cy])
        return;
    var e = new Wall(descr);
    this._wall.push(e);
    this._map[descr.cx][descr.cy] = e;
},
_generateSand : function(descr) {
    
    //console.log(this._sand.length);
    if(descr){
        if(this._map[descr.cx][descr.cy])
            return;
        var e = new Sand(descr);
        this._sand.push(e);
        this._map[descr.cx][descr.cy] = e;
    }else{
        var randSandX = Math.floor(g_canvas.width/5/2 + Math.random()*15*(Math.random() < 0.5 ? -1 : 1));
        if(this._map[randSandX][0])
            return;
        var e = new Sand({
            cx : randSandX,
            cy : 0
        });
        this._sand.push(e);
        this._map[randSandX][0] = e;
    }
},

_generateWater : function(descr) {
    if(descr){
        if(this._map[descr.cx][descr.cy])
            return;
        var e = new Water(descr);
        this._water.push(e);
        this._map[descr.cx][descr.cy] = e;
    }else{
        var randWaterX = Math.floor(g_canvas.width/5 + Math.random()*15*(Math.random() < 0.5 ? -1 : 1));
        if(this._map[randWaterX][0])
            return;
        var e = new Water({
            cx : randWaterX,
            cy : 0
        });
        this._water.push(e);
        this._map[randWaterX][0] = e;
    }
},
_generateSalt : function(descr) {
    if(descr){
        if(this._map[descr.cx][descr.cy])
            return;
        var e = new Salt(descr);
        this._salt.push(e);
        this._map[descr.cx][descr.cy] = e;
    }else{
        var randSaltX = Math.floor(g_canvas.width/5*3/2 + Math.random()*15*(Math.random() < 0.5 ? -1 : 1));
        if(this._map[randSaltX][0])
            return;
        var e = new Salt({
            cx : randSaltX,
            cy : 0
        });
        this._salt.push(e);
        this._map[randSaltX][0] = e;
    }
},

_generateOil : function(descr) {
    if(descr){
        if(this._map[descr.cx][descr.cy])
            return;
        var e = new Oil(descr);
        this._oil.push(e);
        this._map[descr.cx][descr.cy] = e;
    }else{
        var randOilX = Math.floor(g_canvas.width/5*4/2 + Math.random()*15*(Math.random() < 0.5 ? -1 : 1));
        if(this._map[randOilX][0])
            return;
        var e = new Oil({
            cx : randOilX,
            cy : 0
        });
        this._oil.push(e);
        this._map[randOilX][0] = e;
    }
},
_generateFire : function(descr) {
    if(this._map[descr.cx][descr.cy]) {
        if(!this._map[descr.cx][descr.cy].canSetFire()) return;
        this._map[descr.cx][descr.cy].cx = -1;
        this._map[descr.cx][descr.cy].kill();
    }
    var e = new Fire(descr);
    this._fire.unshift(e);
    this._map[descr.cx][descr.cy] = e;
},

_generatePlant : function(descr) {
    if(this._map[descr.cx][descr.cy]) {
        if(!(this._map[descr.cx][descr.cy] instanceof Water)) return;
        this._map[descr.cx][descr.cy].cx = -1;
        this._map[descr.cx][descr.cy].kill();
    }
    var e = new Plant(descr);
    this._plant.unshift(e);
    this._map[descr.cx][descr.cy] = e;
},
_generateSpout : function(descr) {
    if(this._map[descr.cx][descr.cy])
        return;
    var e = new Spout(descr);
    this._spout.push(e);
    this._map[descr.cx][descr.cy] = e;
},

_generateCera : function(descr) {
    if(this._map[descr.cx][descr.cy])
        return;
    var e = new Cera(descr);
    this._cera.push(e);
    this._map[descr.cx][descr.cy] = e;
},
_generateQuestionmark : function(descr) {
    if(this._map[descr.cx][descr.cy])
        return;
    var e = new Questionmark(descr);
    this._questionmark.push(e);
    this._map[descr.cx][descr.cy] = e;
},

init : function() {
    //this._generateRocks();
    //this._generateShip();
    //this._generateSand(null);
},

numlevels : 2,
save : function() {
    var levels = document.getElementById('levels');
    var level = document.createElement('p');
    //level.className = "level"+(++this.numlevels);
    level.setAttribute("id", "level"+this.numlevels++);
    //this.selectedLevel = this.numLevels-1;
    this.changeSelectedLevel();
    var result = "";
    var elementcounter = 0;
    for(var i = 0; i < g_canvas.width/2; i++) {
        var column = this._map[i];
        for(var j = 0; j < lowerBorder/2; j++) {
            var element = column[j];
            if(!element/* || element instanceof Player*/) result += "0 ";
            else{
                elementcounter++;
                if(element instanceof Cera) result += "1 ";
                else if(element instanceof Player) result += "2 ";
                else if(element instanceof Water) result += "3 ";
                else if(element instanceof Wall) result += "4 ";
                else if(element instanceof Spout) result += "5 ";
                else if(element instanceof Sand) result += "6 ";
                else if(element instanceof Salt) result += "7 ";
                else if(element instanceof Questionmark) result += "8 ";
                else if(element instanceof Fire) result += "9 ";
                else if(element instanceof Oil) result += "10 ";
                else if(element instanceof Plant) result += "11 ";
            }
        }
    }
    console.log(elementcounter);
    elementcounter = 0;
    levels.appendChild(level)
    level.innerHTML = result;
},
selectedLevel : 1,
changeSelectedLevel : function() {
    this.selectedLevel += 1;
    this.selectedLevel %= this.numlevels;
    if(this.selectedLevel === 0) {
        this.selectedLevel++;
    }
},
load : function() {
    this._penSize = 0;
    var level = document.getElementById('level'+this.selectedLevel);
    var levelContent = level.innerHTML;
    var levelArr = levelContent.split(" ");
    var levelIter = 0;
    for(var i = 0; i < this._categories.length; i++) {
        this._categories[i].length = 0;
    }
    for(var i = 0; i < g_canvas.width/2; i++) {
        for(var j = 0; j < lowerBorder/2; j++) {
            var element = levelArr[levelIter++];
            this._map[i][j] = null;
            if(element === "0") continue;
            else{
                switch(element) {
                    case "1" : 
                        element = "Cera"; 
                        break;
                    case "2":
                        element = "Player";
                        break;
                    case "3" : 
                        element = "Water"; 
                        break;
                    case "4":
                        element = "Wall";
                        break;
                    case "5" : 
                        element = "Spout"; 
                        break;
                    case "6":
                        element = "Sand";
                        break;
                    case "7" : 
                        element = "Salt"; 
                        break;
                    case "8":
                        element = "Questionmark";
                        break;
                    case "9" : 
                        element = "Fire"; 
                        break;
                    case "10":
                        element = "Oil";
                        break;
                    case "11" : 
                        element = "Plant"; 
                        break;
                }
                this._generateElement(element,i,j); 
            }
        }
    }
},

update: function(du) {
    for (var c = 2; c < this._categories.length; ++c) {
        var aCategory = this._categories[c];
        var i = 0;
        while (i < aCategory.length) {
            var status = aCategory[i].update(du);
            if (status === this.KILL_ME_NOW || aCategory[i]._isDeadNow) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                var cx = aCategory[i].cx;
                var cy = aCategory[i].cy;
                if(cx > 0){
                    if(aCategory[i] instanceof Player) aCategory[i].eliminate();
                    //this._map[cx][cy] = null;
                }
                aCategory.splice(i,1);  
            }else{
                ++i;
            }
        }
    }
},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
            //console.log(aCategory[i]._isDeadNow);
            if(aCategory[i]._isDeadNow) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                var cx = aCategory[i].cx;
                var cy = aCategory[i].cy;
                if(cx > 0){
                    if(aCategory[i] instanceof Player) aCategory[i].eliminate();
                    //this._map[cx][cy] = null;
                }
                aCategory.splice(i,1);  
                i--;
            }
            //debug.text(".", debugX + i * 10, debugY);

        }
        this.renderDrawLoc(ctx);
        debugY += 10;
    }
},

renderDrawLoc : function(ctx) {
    var cx = this._centerX - Math.floor((g_canvas.width/2-g_mouseX)/(2*this._scale));
    var cy = this._centerY - Math.floor((lowerBorder/2-g_mouseY)/(2*this._scale));
    var maxwidthX = g_canvas.width/2;
    var maxwidthY = lowerBorder/2;
    var startx = this._centerX - (maxwidthX/(this._scale*2));
    var starty = this._centerY - (maxwidthY/(this._scale*2));
    var drawX;
    var drawY;
    var drawY2;
    var scale = this._scale;
    
    var old = ctx.fillStyle;
    ctx.strokeStyle = "gray";
    for(var i = -(this._penSize); i <= this._penSize; i++) {
        for(var j = 0; j <= this._penSize-Math.abs(i); j++) {
            drawX = (cx+i - startx)*2*scale;
            drawY = (cy+j - starty)*2*scale;
            drawY2 = (cy-j - starty)*2*scale;
            ctx.beginPath();
            ctx.strokeRect(drawX-1*scale, drawY-1*scale,2*scale,2*scale);
            ctx.strokeRect(drawX-1*scale, drawY2-1*scale,2*scale,2*scale);
            ctx.stroke();        
        }
    }
    ctx.fillStyle = old;
}

};


// Some deferred setup which needs the object to have been created first

entityManager.deferredSetup();
