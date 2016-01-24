// ====
// SALT
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Salt(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    //spatialManager.register(this);
    

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Salt.prototype = new Stacking();
Salt.prototype.Color = "White";

