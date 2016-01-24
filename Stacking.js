Stacking.prototype = new Entity();
function Stacking() {

};
Stacking.prototype.update = function(du) {
	//spatialManager.unregister(this);	
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
	for(var i = 0; i < du; i++){
		if(!entityManager._map[this.cx][this.cy+1]) {
			entityManager._map[this.cx][this.cy] = null;
			this.cy += 1;
		}else if(this.cx + 1 < 300 && !entityManager._map[this.cx+1][this.cy+1] && !entityManager._map[this.cx+1][this.cy]) {
			entityManager._map[this.cx][this.cy] = null;
			this.cx += 1;
			this.cy += 1;
		}else if(this.cx - 1 >= 0 && !entityManager._map[this.cx-1][this.cy+1]  && !entityManager._map[this.cx-1][this.cy]) {
			entityManager._map[this.cx][this.cy] = null;
			this.cx -= 1;
			this.cy += 1;
		}
	}
	if(this.cy >= lowerBorder/2) {
		return entityManager.KILL_ME_NOW;
	}
	entityManager._map[this.cx][this.cy] = this;
	//spatialManager.register(this);
};