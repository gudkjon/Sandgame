"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/

var Menu = {
    _menuHorizontal : 4,
    _menuVertical : 6,
    _menuItems : [],
    _currentSelection : {
        type : "Wall",
        i : 0,
        j : 0
    },
    _updateSelection : function(i,j) {
        this._currentSelection = {
            type : this._menuItems[i][j].type,
            i : i,
            j : j
        };
    },
    _setup : function() {
        for (var i = this._menuHorizontal - 1; i >= 0; i--) {
            this._menuItems[i] = [];
        };
        this._menuItems[0][0] = {
            type : "Wall",
            call : function() {
                Menu._updateSelection(0,0);
            }
        };
        this._menuItems[0][1] = {
            type : "Fire",
            call : function() {
                Menu._updateSelection(0,1);
            }
        };
        this._menuItems[0][2] = {
            type : "Water",
            call : function() {
                Menu._updateSelection(0,2);
            }
        };
        this._menuItems[0][3] = {
            type : "Plant",
            call : function() {
                Menu._updateSelection(0,3);
            }
        };
        this._menuItems[0][4] = {
            type : "Sand",
            call : function() {
                Menu._updateSelection(0,4);
            }
        };
        this._menuItems[0][5] = {
            type : "Spout",
            call : function() {
                Menu._updateSelection(0,5);
            }
        };
        this._menuItems[1][0] = {
            type : "Cera",
            call : function() {
                Menu._updateSelection(1,0);
            }
        };
        this._menuItems[1][1] = {
            type : "???",
            call : function() {
                Menu._updateSelection(1,1);
            }
        };
        this._menuItems[1][2] = {
            type : "Oil",
            call : function() {
                Menu._updateSelection(1,2);
            }
        };
        this._menuItems[1][3] = {
            type : "Eraser",
            call : function() {
                Menu._updateSelection(1,3);
            }
        };
        this._menuItems[1][4] = {
            type : "Salt",
            call : function() {
                Menu._updateSelection(1,4);
            }
        };
        this._menuItems[1][5] = {
            type : "Pen Size",
            call : function() {
                entityManager._changePenSize();
            }
        };
        this._menuItems[2][0] = {
            type : "Time-Speed",
            call : function() {
                return;
            }
        };
        this._menuItems[2][1] = {
            type : "SandFlow",
            call : function() {
                g_spewSand = !g_spewSand;
            }
        };
        this._menuItems[2][2] = {
            type : "WaterFlow",
            call : function() {
                g_spewWater = !g_spewWater;
            }
        };
        this._menuItems[2][3] = {
            type : "SaltFlow",
            call : function() {
                g_spewSalt = !g_spewSalt;
            }
        };
        this._menuItems[2][4] = {
            type : "OilFlow",
            call : function() {
                g_spewOil = !g_spewOil;
            }
        }; 
        this._menuItems[2][5] = {
            type : "Namekuji",
            call : function() {
                return;
            }
        };
        this._menuItems[3][0] = {
            type : "Save",
            call : function() {
                entityManager.save();
            }
        };
        this._menuItems[3][1] = {
            type : "Load",
            call : function() {
                entityManager.load();
            }
        };
        this._menuItems[3][2] = {
            type : "Player",
            call : function() {
                Menu._updateSelection(3,2);
            }
        };
        this._menuItems[3][3] = {
            type : "Bottom-Border",
            call : function() {
                entityManager._makeBottomBorder();
                return;
            }
        };
        this._menuItems[3][4] = {
            type : "unassigned",
            call : function() {
                return;
            }
        };
        this._menuItems[3][5] = {
            type : "unassigned",
            call : function() {
                return;   
            }
        };

    },
    _select : function(i , j) {
        //console.log(i + " " + j);
        this._menuItems[i][j].call();
        /*
        if(i === 1 && j === 5) {
            //console.log("penSize");
            entityManager._changePenSize(); 
            return;
        }
        this._currentSelection = {
            type : this._menuItems[i][j],
            i : i,
            j : j
        }*/
    },
    render : function(ctx) {
        util.fillBox(ctx, 0, lowerBorder, g_canvas.width, g_canvas.height/6, "gray");
        var halfWidth = ctx.canvas.width/(this._menuHorizontal*2);
        var halfHeight = (ctx.canvas.height-lowerBorder)/(this._menuVertical*2);
        var old = ctx.fillStyle;
        ctx.textAlign = 'center';
        for (var i = 0; i < this._menuItems.length; ++i) {
            var aCategory = this._menuItems[i];
            for (var j = 0; j < aCategory.length; ++j) {
                var menuItem = aCategory[j].type;
                if(menuItem === "Pen Size") menuItem += ": " + (entityManager._penSize+1);
                ctx.strokeStyle = "Blue";
                ctx.strokeRect(i*halfWidth*2,j*halfHeight*2+lowerBorder,halfWidth*2,halfHeight*2);
                ctx.stroke();
                ctx.fillStyle = "black";
                ctx.fillText(menuItem,i*halfWidth*2+halfWidth,lowerBorder+j*halfHeight*2+halfHeight);
            }
        }
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(this._currentSelection.i*halfWidth*2,this._currentSelection.j*halfHeight*2+lowerBorder,halfWidth*2,halfHeight*2);
        ctx.stroke();
        ctx.fillStyle = old;
    }
};
Menu._setup();

