// ====
// FIRE
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Fire(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Fire.prototype = new Entity();
Fire.prototype.Color = "Red";
Fire.prototype.Colors = ["Red","Orange","Yellow"];
Fire.prototype.ColorIt = 0;
Fire.prototype.radius = 1;
Fire.prototype.Lifetime = 3;
Fire.prototype.update = function(du) {
	this.ColorIt++;
	this.ColorIt %= 3;
	this.Color = this.Colors[this.ColorIt];
	if(this.Lifetime < 0) return entityManager.KILL_ME_NOW;
	for(var i = -1; i <= 1; i+=2) {
		if(entityManager._map[this.cx][this.cy+j] && entityManager._map[this.cx][this.cy+j].canSetFire()) {
			entityManager._map[this.cx][this.cy+j].setFire();
		}
		if(entityManager._map[this.cx+i][this.cy] && entityManager._map[this.cx+i][this.cy].canSetFire()) {
			entityManager._map[this.cx+i][this.cy].setFire();
		}
		for(var j = -1; j <= 1; j += 2) {
			if(entityManager._map[this.cx+i][this.cy+j] && entityManager._map[this.cx+i][this.cy+j].canSetFire()) {
				entityManager._map[this.cx+i][this.cy+j].setFire();
			}
		}
	}
	this.Lifetime -= du/SECS_TO_NOMINALS;
}


