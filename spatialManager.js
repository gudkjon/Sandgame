/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    // TODO: YOUR STUFF HERE!
    this._entities[spatialID] = {
        entity : entity,
        posX : pos.posX,
        posY : pos.posY,
        radius : entity.getRadius(),
    };
    //console.log(this._entities[spatialID].gridI);
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    // TODO: YOUR STUFF HERE!
    delete this._entities[spatialID];

},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
    for(var ID in this._entities) {
        //console.log(ID);
        var e = this._entities[ID];
        var distance = util.wrappedDistSq(posX, posY, e.posX, e.posY, g_canvas.width, g_canvas.height);
        if(distance < (radius + e.radius)*(radius + e.radius)) {
            return e.entity;
        }
    }
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
