"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    //spatialManager.register(this);

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};
Player.prototype = new Entity();
Player.prototype.radius = 2;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.skin = "pink";
Player.prototype.shirt = "yellow";
Player.prototype.shoes = "brown";
Player.prototype.step = false;
Player.prototype.goLeft = 'A'.charCodeAt(0);
Player.prototype.goRight = 'D'.charCodeAt(0);
Player.prototype.goUp = 'W'.charCodeAt(0);
Player.prototype.goDown = 'S'.charCodeAt(0);
Player.prototype.render = function(ctx) {
	ctx.beginPath();
    var old = ctx.fillStyle;
    var scale = entityManager._scale;
    ctx.fillStyle = this.shirt;
    //ctx.arc(this.cx*2, this.cy*2, this.radius, 0, 2 * Math.PI, false);
    var drawPos = util.scaledPos(this.cx, this.cy);
    ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    ctx.fill();
    ctx.fillStyle = this.skin;
    drawPos = util.scaledPos(this.cx, this.cy-1);
    ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    //ctx.fillRect((this.cx)*2-1,(this.cy-1)*2-1,2,2);
    drawPos = util.scaledPos(this.cx-1, this.cy);
    ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    //ctx.fillRect((this.cx-1)*2-1,this.cy*2-1,2,2);
    drawPos = util.scaledPos(this.cx+1, this.cy);
    ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    //ctx.fillRect((this.cx+1)*2-1,this.cy*2-1,2,2);
    ctx.fill();
    ctx.fillStyle = this.shoes;
    var step = this.step ? 1 : 0;
    if(this.step) {
    	drawPos = util.scaledPos(this.cx-step, this.cy+1);
    	ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    	drawPos = util.scaledPos(this.cx+step, this.cy+1);
    	ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    }else{
    	drawPos = util.scaledPos(this.cx, this.cy-1);
    	ctx.fillRect(drawPos.cx-1*scale,drawPos.cy-1*scale,2*scale,2*scale);
    }
    //ctx.fillRect((this.cx-step)*2-1,(this.cy+1)*2-1,2,2);
    //ctx.fillRect((this.cx+step)*2-1,(this.cy+1)*2-1,2,2);
    ctx.fill();
    ctx.fillStyle = old;
};
Player.prototype.eliminate = function() {
	for(var i = -1; i < 2; i += 2) {
        entityManager._map[this.cx][this.cy+i] = null;
        entityManager._map[this.cx+i][this.cy] = null;    
        for(var j = -1; j < 2; j += 2) {
            entityManager._map[this.cx+i][this.cy+j] = null;     
        }
    }
};
Player.prototype.map = function(entity) {
	for(var i = -1; i < 2; i += 2) {
        entityManager._map[this.cx][this.cy+i] = entity;
        entityManager._map[this.cx+i][this.cy] = entity;    
        for(var j = -1; j < 2; j += 2) {
            entityManager._map[this.cx+i][this.cy+j] = entity;     
        }
    }
    entityManager._map[this.cx][this.cy] = entity;
};
Player.prototype.update = function(du) {
	var tempPosX = this.cx;
	var tempPosY = this.cy;
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    this.map(null);     

	if(!entityManager._map[tempPosX][tempPosY+this.radius/2+1] 
	   && !entityManager._map[tempPosX+this.radius/2][tempPosY+this.radius/2+1] 
	   && !entityManager._map[tempPosX-this.radius/2][tempPosY+this.radius/2+1]) {
		this.velY += 1;
	}else{
		this.velY = 0;
		if(keys[this.goUp]) {
			this.velY -= 5;
		}
	}
	du = du < 1 ? 1 : du;
	//this.velY *= Math.floor(du);
	if(keys[this.goLeft]) {
		this.velX  = -Math.floor(du);
	}
	if(keys[this.goRight]) {
		this.velX = Math.floor(du);
	}
	//tempPosY += this.velY;//*Math.floor(du);
	var iter = this.velY < 0 ? -1 : 1;
	for(var i = 0; i < Math.abs(this.velY); i++) {
		if(entityManager._map[tempPosX][tempPosY+(this.radius/2+1)*iter] 
	   || entityManager._map[tempPosX+this.radius/2][tempPosY+(this.radius/2+1)*iter] 
	   || entityManager._map[tempPosX-this.radius/2][tempPosY+(this.radius/2+1)*iter]){
			this.velY = 0
			break;
		}
		tempPosY += iter;
	}
	iter = this.velX < 0 ? -1 : 1
	for(var i = 0; i < Math.abs(this.velX); i++) {
		if(tempPosX+(this.radius/2+1)*iter < 0 || tempPosX+(this.radius/2+1)*iter >= g_canvas.width/2)
			return entityManager.KILL_ME_NOW;
		if(entityManager._map[tempPosX+(this.radius/2+1)*iter][tempPosY] 
	   || entityManager._map[tempPosX+(this.radius/2+1)*iter][tempPosY+this.radius/2] 
	   || entityManager._map[tempPosX+(this.radius/2+1)*iter][tempPosY-this.radius/2]){
			//this.velX = 0
			break;
	   }
		tempPosX += iter;
	}
	this.velX = 0;
	if(this.cx != tempPosX) this.step = !this.step;
	this.cx = tempPosX;
	this.cy = tempPosY;
	if(this.cy > lowerBorder/2-1) {
		return entityManager.KILL_ME_NOW
	}
    this.map(this);

};
