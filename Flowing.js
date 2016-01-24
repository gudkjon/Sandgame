Flowing.prototype = new Entity();
function Flowing() {

};
Flowing.prototype.checkForFire = function(dirX, dirY){

};
Flowing.prototype.update = function(du) {
	//spatialManager.unregister(this);
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
	var tempX = this.cx;
	var tempY = this.cy;
	for(var i = 0; i < du; i++) {
		if(this.checkForFire(0,1) || !entityManager._map[this.cx][this.cy+1]) {
			entityManager._map[this.cx][this.cy] = null;
			this.cy += 1;
		}else if(this.cx + 1 < 300 && !entityManager._map[this.cx+1][this.cy]) {
			entityManager._map[this.cx][this.cy] = null;
			this.cx += 1;
		}else if(this.cx - 1 >= 0 && !entityManager._map[this.cx-1][this.cy]) {
			entityManager._map[this.cx][this.cy] = null;
			this.cx -= 1;
		}
	}	
	if(this.cy > lowerBorder/2) {
		return entityManager.KILL_ME_NOW;
	}
	//spatialManager.register(this);
	entityManager._map[this.cx][this.cy] = this;
};