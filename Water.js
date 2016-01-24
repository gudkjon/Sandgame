// ====
// WATER
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Water(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    //spatialManager.register(this);
    
/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Water.prototype = new Flowing();
Water.prototype.Color = "Blue";

Water.prototype.checkForFire = function(dirX, dirY) {
	var locX = this.cx + dirX;
	if(locX < 0 || locX >= g_canvas.width/2) return;
	if(entityManager._map[locX][this.cy+dirY] instanceof Fire ) {
		entityManager._map[locX][this.cy+dirY].kill();
	}
};
Water.prototype.consume = function() {
	entityManager._generatePlant({
		cx : this.cx,
		cy : this.cy
	});
	this.cx = -1;
	this.kill();
}


