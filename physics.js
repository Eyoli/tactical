"use strict";

function Physics2d(wholeArea) {
	this.wholeArea = wholeArea;
	this.objects = [];
	this.wrappers = [];
	this.mouseObject = new MouseLinkedPhysicalObject();
	this.targetAssociations = [];
	
	document.onmousemove = function(e){
		e = e || window.event;
		
		if(e) {
			//console.log(e.clientX + " " + e.clientY);
			//console.log(this);
			this.mouseObject.animate(e.clientX, e.clientY);
		}
		
	}.bind(this);
	
	this.addObject = function(object) {
		this.objects.push(object);
	};
	
	this.addWrapper = function(wrapper) {
		this.wrappers.push(wrapper);
	};
	
	this.remove = function(object) {
		// Suppression du wrapper
		var i = 0, found = false;
		while(i < this.wrappers.length && !found) {
			found = this.wrappers[i].physicalObject.key === object.key;
			i++;
		}
		if(i < this.wrappers.length) {
			this.wrappers.splice(i, 1);
		}
		
		// Suppression de l'objet
		i = 0;
		found = false;
		while(i < this.objects.length && !found) {
			found = this.objects[i].key === object.key;
			i++;
		}
		if(i < this.objects.length) {
			this.objects.splice(i, 1);
		}
	};
	
	this.addTargetAssociation = function(targetAssociation) {
		this.targetAssociations.push(targetAssociation);
	};
	
	this.animate = function() {
		var indexToDelete = [];
		for(var i = 0; i < this.objects.length; i++) {
			if(this.objects[i].pv && this.objects[i].pv <= 0) {
				indexToDelete.push(i);
			}
			
			this.objects[i].animate();
		}
		
		for(var i = 0; i < indexToDelete.length; i++) {
			this.objects.splice(indexToDelete[i], 1);
		}
	};
	
	this.display = function(context) {
		for(var i = 0; i < this.wrappers.length; i++) {
			this.wrappers[i].display(context);
		}
	};
	
	this.triggerActionOnTarget = function() {
		for(var i = 0; i < this.targetAssociations.length; i++) {
			this.targetAssociations[i].actionOnTarget(this);
		}
	};

	/**
	* Basic collision detection
	**/
	this.detectCollisions = function(depth) {
		for(var i = 0; i < this.objects.length; i++) {
			for(var j = i; j < this.objects.length; j++) {
				if(i !== j && this.objects[i].isCollidingWith(this.objects[j])) {
					// console.log("collision (" + i + ", " + j + ")");
					this.objects[i].onCollisionWith(this.objects[j]);
					this.objects[j].onCollisionWith(this.objects[i]);
				}
			}
		};
	};
}