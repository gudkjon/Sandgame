// ====
// QUESTIONMARK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Questionmark(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Questionmark.prototype = new Entity();
Questionmark.prototype.Color = "Purple";
Questionmark.prototype.radius = 1;
Questionmark.prototype.update = function(du) {
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
	if(!entityManager._map[this.cx][this.cy-1]) {
		entityManager._map[this.cx][this.cy] = null;
		this.cy -= 1;
	}else if(this.cx + 1 < 300 && !entityManager._map[this.cx+1][this.cy-1]) {
		entityManager._map[this.cx][this.cy] = null;
		this.cx += 1;
		this.cy -= 1;
	}else if(this.cx - 1 >= 0 && !entityManager._map[this.cx-1][this.cy-1]) {
		entityManager._map[this.cx][this.cy] = null;
		this.cx -= 1;
		this.cy -= 1;
	}
	if(this.cy < 0) {
		return entityManager.KILL_ME_NOW;
	}
	entityManager._map[this.cx][this.cy] = this;
	
}

