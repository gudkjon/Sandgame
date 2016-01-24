// ====
// PLANT
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Plant(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Plant.prototype = new Entity();
Plant.prototype.Color = "Green";
Plant.prototype.radius = 1;
Plant.prototype.consumeTicker = 2;
Plant.prototype.hasConsumed = false;
Plant.prototype.update = function(du) {
	if(this.cx < 0) return entityManager.KILL_ME_NOW;
	var direction = Math.random();
	if(direction < 0.33  && this.cy-1 >= 0 && entityManager._map[this.cx][this.cy-1] && entityManager._map[this.cx][this.cy-1] instanceof Water && !this.hasConsumed) {
		entityManager._map[this.cx][this.cy-1].consume();
		this.hasConsumed = true;
	}else
	if( direction < 0.66 && this.cx - 1 >= 0 && entityManager._map[this.cx-1][this.cy-1] && entityManager._map[this.cx-1][this.cy-1] instanceof Water && !this.hasConsumed) {
		entityManager._map[this.cx-1][this.cy-1].consume();
		this.hasConsumed = true;
	}else
	if(this.cx + 1 < 250 && entityManager._map[this.cx+1][this.cy-1] && entityManager._map[this.cx+1][this.cy-1] instanceof Water && !this.hasConsumed) {
		entityManager._map[this.cx+1][this.cy-1].consume();
		this.hasConsumed = true;
	}
	this.consumeTicker += du;
	this.consumeTicker %= 100;
	if(this.consumeTicker <= du) this.hasConsumed = false;
};
Plant.prototype.canSetFire = function(du) {
	return true;
};
Plant.prototype.setFire = function(du) {
	entityManager._generateFire({
		cx : this.cx,
		cy : this.cy
	});
	this.cx = -1;
	this.kill();
};


