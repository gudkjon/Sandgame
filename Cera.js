// ====
// CERA
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Cera(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Cera.prototype = new Entity();
Cera.prototype.Color = "SaddleBrown";
Cera.prototype.radius = 1;
Cera.prototype.canSetFire = function() {
	return true;
}
Cera.prototype.setFire = function() {
	entityManager._generateFire({
		cx : this.cx,
		cy : this.cy
	});
	this.cx = -1;
	this.kill();
}

