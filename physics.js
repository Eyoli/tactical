"use strict";

function Physics2d(wholeArea) {
	this.wholeArea = wholeArea;
	this.objects = [];
	this.wrappers = [];
	this.mouseObject = new PhysicalObject(0, 0, 20);
	this.associations = [];
	
	document.onmousemove = function(e){
		e = e || window.event;
		
		if(e) {
			//console.log(e.clientX + " " + e.clientY);
			//console.log(this);
			this.mouseObject.setPosition(e.clientX, e.clientY);
		}
		
	}.bind(this);
	
	this.addObject = function(object) {
		this.objects.push(object);
	};
	
	this.addWrapper = function(wrapper) {
		this.wrappers.push(wrapper);
	};
	
	this.addTargetAssociation = function(targetAssociation) {
		this.associations.push(targetAssociation);
	};
	
	this.removeLinkedElements = function(object) {
		console.log("destroying object " + + object.key); 
		
		// Suppression des wrappers liés à l'objet
		var i = 0;
		while(i < this.wrappers.length) {
			if(this.wrappers[i].physicalObject.key === object.key) {
				this.wrappers.splice(i, 1);
			} else {
				i++;
			}
		}
		
		// Supression des associations liées à l'objet
		i = 0;
		while(i < this.associations.length) {
			if(this.associations[i].object.key === object.key || (this.associations[i].target && this.associations[i].target.key === object.key)) {
				this.associations.splice(i, 1);
			} else {
				i++;
			}
		}
	};

	this.animate = function() {
		for(var i = 0; i < this.objects.length; i++) {
			this.objects[i].animate();
		}
	};
	
	this.display = function(context) {
		for(var i = 0; i < this.wrappers.length; i++) {
			this.wrappers[i].display(context);
		}
	};
	
	this.triggerActionOnTarget = function() {
		for(var i = 0; i < this.associations.length; i++) {
			this.associations[i].actionOnTarget(this);
		}
	};
	
	this.removeDestroyedObjects = function() {
		var i = 0;
		while(i < this.objects.length) {
			if(this.objects[i].destroyed) {
				this.removeLinkedElements(this.objects[i]);
				this.objects.splice(i, 1);
			} else {
				i++;
			}
		}
	};

	/**
	* Basic collision detection. Could be improved, this is way too slow with a lot of objects...
	**/
	this.detectCollisions = function(depth) {
		for(var i = 0; i < this.objects.length; i++) {
			for(var j = i + 1; j < this.objects.length; j++) {
				if(this.objects[i].isCollidingWith(this.objects[j])) {
					console.log("collision between object " + this.objects[i].key + " and object " + this.objects[j].key);
					this.objects[i].onCollisionWith(this.objects[j]);
					this.objects[j].onCollisionWith(this.objects[i]);
				}
			}
		};
	};
}