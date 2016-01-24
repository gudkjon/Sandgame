// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0,
    g_oldMouseX = 0,
    g_oldMouseY = 0;

function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    g_oldMouseX = g_mouseX;
    g_oldMouseY = g_mouseY;
    var scale = entityManager._scale;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
    if(g_mouseY < lowerBorder) {
        var i;// = Math.floor(g_mouseX/2);
        var j;// = Math.floor(g_mouseY/2);
        i = entityManager._centerX - Math.floor((g_canvas.width/2-g_mouseX)/(2*scale));
        j = entityManager._centerY - Math.floor((lowerBorder/2-g_mouseY)/(2*scale));
        //console.log(i + " " + j);
        //this._centerX = this._centerX-(maxWidth/2-mouseX)/(2*this._scale);
        //j = entityManager._centerY - Math.floor((lowerBorder/4-g_mouseY/2)/(entityManager._scale));
        //j = entityManager._centerY - (entityManager._centerY - j*scale);
        var type = Menu._currentSelection.type;
        if(type === 'Eraser') {
            entityManager._deleteElement(i,j)
        }else{
           entityManager._generateElement(type,i,j);
        }
    }else{
        var i = Math.floor(g_mouseX/(g_canvas.width/Menu._menuHorizontal));
        var j = Math.floor((g_mouseY-lowerBorder)/((g_canvas.height-lowerBorder)/Menu._menuVertical));
        Menu._select(i,j);
    }
}
function handleMouse2(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
    if(g_mouseY < lowerBorder) {
        var i = Math.floor(g_mouseX/2);
        var j = Math.floor(g_mouseY/2);
        var oldi = Math.floor(g_oldMouseX/2);
        var oldj = Math.floor(g_oldMouseY/2);
        var deltaj = (j-oldj)/(i-oldi);
        var deltai = (i-oldi)/(j-oldj);
        var distanceX = Math.abs(g_mouseX - g_oldMouseX)/2;
        var distanceY = Math.abs(g_mouseY - g_oldMouseY)/2;
        var distanceSquared = distanceX*distanceX+distanceY*distanceY;
        var type = Menu._currentSelection.type;
        //bresenham line
        for(var c = 0; c*c < distanceSquared; c++) {//c < (distanceX > distanceY ? distanceX : distanceY); c++ ) {
            if(type === 'Eraser')
                entityManager._deleteElement((distanceX > distanceY ? (i+c) : (i+Math.floor(deltai*c))), (distanceX > distanceY ? (j + Math.floor(deltaj*c)) : (j+c)))
            else
                entityManager._generateElement(type, (distanceX > distanceY ? (i+c) : (i+Math.floor(deltai*c))), (distanceX > distanceY ? (j + Math.floor(deltaj*c)) : (j+c)));
        }
    }
    g_oldMouseX = g_mouseX;
    g_oldMouseY = g_mouseY;
}

function handleMouse3(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (!button) return;
    if(g_mouseY < lowerBorder) {
        var scale = entityManager._scale;                       //       deltay err x breyting
        var i;// = Math.floor(g_mouseX/2);                         //                |
        var j;// = Math.floor(g_mouseY/2);
        i = entityManager._centerX - Math.floor((g_canvas.width/2-g_mouseX)/(2*scale));
        j = entityManager._centerY - Math.floor((lowerBorder/2-g_mouseY)/(2*scale));
        //i = entityManager._centerX - (entityManager._centerX - i*scale);
        //j = entityManager._centerY - (entityManager._centerY - j*scale);                         //                |
        var oldi;// = Math.floor(g_oldMouseX/2);     //deltax err y breyting ----------------- deltax err y breyting
        var oldj;// = Math.floor(g_oldMouseY/2); 
        oldi = entityManager._centerX - Math.floor((g_canvas.width/2-g_oldMouseX)/(2*scale));
        oldj = entityManager._centerY - Math.floor((lowerBorder/2-g_oldMouseY)/(2*scale));
        //oldi = entityManager._centerX - (entityManager._centerX - oldi*scale);
        //oldj = entityManager._centerY - (entityManager._centerY - oldj*scale);                   //                |
        var deltai = Math.abs(i-oldi);
        var deltaj = Math.abs(j-oldj);                         //      deltay err x breyting
        var error = deltai-deltaj;
        var left_right = (oldi < i) ? 1 : -1;
        var up_dn = (oldj < j) ? 1 : -1;
        //error = deltaErr && deltaErr !== Infinity ? deltaErr : 0;
        var type = Menu._currentSelection.type;
        if(type === 'Eraser')
            entityManager._deleteElement(oldi, oldj);
        else
            entityManager._generateElement(type, oldi , oldj);
        while(i != oldi || j != oldj) {
            var err2 = error << 1;
            if (err2 > -deltaj) {
               error -= deltaj;
               oldi += left_right;
            }
            if (err2 < deltai) {
               error += deltai;
               oldj += up_dn;
            }
            if(type === 'Eraser')
                entityManager._deleteElement(oldi, oldj);
            else
                entityManager._generateElement(type, oldi, oldj);
        }
    }
    g_oldMouseX = g_mouseX;
    g_oldMouseY = g_mouseY;
}

function handleScroll(evt) {
    evt.preventDefault();
    var delta = Math.max(-1 , Math.min(1 , (evt.wheelDelta || -evt.detail)));
    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;
    entityManager._changeScale(delta, g_mouseX, g_mouseY);
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse3);
window.addEventListener("mousewheel", handleScroll);
window.addEventListener("DOMMouseScroll", handleScroll);
