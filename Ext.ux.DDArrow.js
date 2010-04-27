/*
 * Ext.ux.DDArrow
 *
 * Copyright (c) 2010 Florian Cargoët (http://fcargoet.evolix.net/webdev/extjs/ext-ux-ddarrow/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * TODO :
 *  - use viewport size instead of 2000, 2000 for the raphael canvas
 *  - add more styleable attributes
 *  - change arrow color/shape in notifyOver if drop allowed/not allowed
 *  - test on TreePanel
 */

Ext.ns('Ext.ux');

Ext.ux.DDArrow = function(arrowStyle){
    //overrides default arrow style
    Ext.apply(this.arrowStyle, arrowStyle);
};

Ext.ux.DDArrow.prototype = {
    //default arrow style
    arrowStyle : {
        strokeWidth : 1,
        arrowWidth  : 4,
        color       : 'black'
    },
    init : function(component){
        component.on('render', this.setupDD, this);
    },
    getDragZone : function(component){
        if(component.dragZone){ //should work on TreePanels, not tested yet
            return component.dragZone;
        }
        if(component instanceof Ext.grid.GridPanel){
            return component.getView().dragZone;
        }
    },
    setupDD : function(component){
        var dragZone = this.getDragZone(component);
        //apply style
        Ext.apply(dragZone, this.arrowStyle);

        Ext.apply(dragZone,{
            /*
            * onInitDrag calls onStartDrag excepted in GridDragZone
            * let's patch it
            */
            onInitDrag : function(x,y){
                var data = this.dragData;
                this.ddel.innerHTML = this.grid.getDragDropText();
                this.proxy.update(this.ddel);
                // fire start drag?
                //i would say yes ;-)
                this.onStartDrag(x,y);
            },
            /*
            * onStartDrag is called when you initiate the drag action
            * it stores the mouse coordinates and create the SVG canvas
            */
            onStartDrag : function(x, y){
                this.arrowStart = {x:x, y:y};
                this.raphaelCanvas = new Raphael(0,0,2000,2000); //could be better...
                //apply body.no-cursor (cursor : none) to hide the cursor
                //cursor:pointer is nice too
            },
            /*
            * onDrag is called on mousemove
            * it clears the canvas and draw the arrow again
            */
            onDrag : function(e){
                this.raphaelCanvas.clear();
                var arrow = this.raphaelCanvas.arrow(this.arrowStart.x, this.arrowStart.y, e.xy[0], e.xy[1], this.arrowWidth, this.strokeWidth, this.color);
            },
            /*
            * onEndDrag is called when you drop whatever you were dragging
            * it removes the SVG canvas from the document
            */
            onEndDrag : function(){
                this.raphaelCanvas.remove();
                delete this.raphaelCanvas;
            }
        });
    }
}

//Raphael plugin
//original here : http://taitems.tumblr.com/post/549973287/drawing-arrows-in-raphaeljs
//additions : strokeWidth & color params
Raphael.fn.arrow = function (x1, y1, x2, y2, size, strokeWidth, color) {
    var angle = Math.atan2(x1 - x2, y2 - y1);
    angle = (angle / (2 * Math.PI)) * 360;

    var arrowPath = this.path("M" + x2 + " " + y2 + " L" + (x2 - size) + " " + (y2 - size) + " L" + (x2 - size) + " " + (y2 + size) + " L" + x2 + " " + y2 ).rotate((90 + angle), x2, y2);
    var linePath = this.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);

    //styles
    arrowPath
        .attr('fill',   color || 'black')
        .attr('stroke', color || 'black');
    linePath
        .attr('stroke-width', strokeWidth || 1)
        .attr('stroke', color || 'black')
        .attr('color',  color || 'black');
    return [linePath,arrowPath];
};
