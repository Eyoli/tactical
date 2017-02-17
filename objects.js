"use strict";

var _objectKey = 1;

function PhysicalObject(x, y, r, v, alpha) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.v = v;
	this.alpha = alpha;
	
	this.key = _objectKey.toString();
	_objectKey++;
	
	this.isCollidingWith = function(physicalObject) {
		var dx = physicalObject.x - this.x;
		var dy = physicalObject.y - this.y;
		var rayon = physicalObject.r + this.r;
		
		//console.log(dx*dx + dy*dy + " | " + rayon*rayon);
		if(dx*dx + dy*dy < rayon*rayon) {
			return true;
		}
		
		return false;
	};
	
	this.onCollisionWith = function(physicalObject) {
		/*var dx = physicalObject.x - this.x;
		var dy = physicalObject.y - this.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		this.alpha = Math.PI + Math.acos(dx / d);
		
		if(this.alpha > Math.PI) {
			this.alpha = this.alpha - 2*Math.PI;
		}
		if(this.alpha < -Math.PI) {
			this.alpha = this.alpha + 2*Math.PI;
		}*/
	};
	
	this.animate = function() {
		this.x = this.x + this.v * Math.cos(this.alpha);
		this.y = this.y + this.v * Math.sin(this.alpha);
	};
}

function MouseLinkedPhysicalObject() {
	PhysicalObject.call(this, 0, 0, 20, 0, 0);
	
	this.isCollidingWith = function(physicalObject) {
		return false;
	};
	
	this.onCollisionWith = function(physicalObject) {
	};
	
	this.animate = function(x, y) {
		this.x = x;
		this.y = y;
	};
}