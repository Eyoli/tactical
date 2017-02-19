"use strict";

var _objectKey = 1;

function PhysicalObject(x_0, y_0, r_0, v_0, alpha_0) {
	this.x = x_0;
	this.y = y_0;
	this.r = r_0;
	this.v = v_0;
	this.alpha = alpha_0;
	
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

function DestructibleObject(x_0, y_0, r_0, v_0, alpha_0, pvMax) {
	PhysicalObject.call(this, x_0, y_0, r_0, v_0, alpha_0);
	
	this.pv = pvMax;
	this.pvMax = pvMax;
	this.side = 0;
	
	this.getHP = function() {
		return this.pv;
	}
	
	this.damage = function(damage) {
		this.pv = Math.max(0, this.pv - damage);
	}
	
	this.setSide = function(side) {
		this.side = side;
	}
	
	this.onCollisionWith = function(physicalObject) {
		if(this.pv > 0 && physicalObject.pv && physicalObject.side !== this.side) {
			physicalObject.damage(10);
		}
	}
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