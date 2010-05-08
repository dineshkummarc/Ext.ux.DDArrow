/*
 * Ext.ux.DDArrow
 *
 * Copyright (c) 2010 Florian Cargoët (http://fcargoet.evolix.net/webdev/extjs/ext-ux-ddarrow/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * TODO :
 *  - use viewport size instead of 2000, 2000 for the raphael canvas
 *  - change arrow color/shape in notifyOver if drop allowed/not allowed
 *  - test on TreePanel
 */

Ext.ns('Ext.ux');

Ext.ux.DDArrow = function(arrowConfig){
    Ext.apply(this.arrowConfig, arrowConfig);
};

Ext.ux.DDArrow.prototype = {
    //default arrow config
    arrowConfig : {
        arrowWidth : 2,
        arrowStyle : {
            'stroke-width' : 1,
            'fill'       : 'black'
        }
    },
    init : function(component){
        component.on('render', this.setupDD, this, {single : true});
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
        //apply config
        Ext.apply(dragZone, this.arrowConfig);

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
                this.raphaelCanvas = Raphael(0,0,2000,2000); //could be better...
                //apply body.no-cursor (cursor : none) to hide the cursor
                //cursor:pointer is nice too
            },
            /*
            * onDrag is called on mousemove
            * it clears the canvas and draw the arrow again
            */
            onDrag : function(e){
                this.raphaelCanvas.clear();
                this.arrow = this.raphaelCanvas.arrow(
                    this.arrowStart.x,
                    this.arrowStart.y,
                    e.xy[0],
                    e.xy[1],
                    this.arrowWidth,
                    this.arrowStyle
                );
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
};

//Raphael plugin
Raphael.fn.arrow = function (x1, y1, x2, y2, width, style) {
    var angle = Math.atan2(x1 - x2, y2 - y1),
        dist  = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    width = width || 4;
    angle = (angle / (2 * Math.PI)) * 360;
    var arrowPath = new Raphael.fn.arrow.Path()
        .start(x1, y1 - width/2)
        .move(dist - 2 * width, 0)
        .move(0, -width)
        .move(2 * width, 1.5 * width)
        .move(-2 * width, 1.5 * width)
        .move(0, -width)
        //.move(-dist + 2 * width, 0) //not pixel perfect
        .moveTo(x1, y1 + width/2)
        .end();
    var arrow = this.path(arrowPath).rotate((90 + angle), x1, y1);
    //style
    for(prop in style){
        if(style.hasOwnProperty(prop)){
            arrow.attr(prop, style[prop]);
        }
    }
    return arrow;
};
/*
 * path string builder
 */
Raphael.fn.arrow.Path = function(){
    this.path = [];
    return this;
}
Raphael.fn.arrow.Path.prototype = {
    start : function(x, y){
        this.path.push("M " + x + "," + y);
        return this;
    },
    move : function(dx, dy){
        this.path.push("l " + dx + "," + dy);
        return this;
    },
    moveTo : function(x, y){
        this.path.push("L " + x + "," + y);
        return this;
    },
    end : function(){
        this.path.push("z");
        return this.path.join(" ");
    },
    toString : function(){
        return this.path.join(" ");
    }
};