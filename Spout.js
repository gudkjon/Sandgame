// ====
// SPOUT
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Spout(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Spout.prototype = new Entity();
Spout.prototype.Color = "Cyan";
Spout.prototype.radius = 1;
Spout.prototype.spoutCounter = 0;
Spout.prototype.update = function(du) {
	//this.spoutCounter++;
	//this.spoutCounter %= 10;
	if(Math.random() < 0.1) {
		entityManager._generateWater({
			cx : this.cx,
			cy : this.cy+1
		});
	}
}


