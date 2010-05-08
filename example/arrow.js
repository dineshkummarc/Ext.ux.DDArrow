
Ext.onReady(function(){

    var books = {
        records : [{
            title  : "Ext JS in Action",
            author : "Jesus D. Garcia, Jr."
        },{
            title  : "Learning Ext JS",
            author : "Shea Frederick, Colin Ramsay, Steve “Cutter” Blades"
        },{
            title  : "Ext JS Projects with Gears",
            author : "Frank Zammetti"
        },{
            title  : "Ext JS 3.0 Cookbook",
            author : "Jorge Ramon"
        }]
    };

    var fields = [
        'title',
        'author'
    ];

    var arrowPlugin = new Ext.ux.DDArrow({
        arrowWidth  : 5,
        arrowStyle : {//ugly arrow
            'fill'         : 'yellow',
            'stroke'       : 'green',
            'stroke-width' : 2
        }
    });

    var leftGrid = new Ext.grid.GridPanel({
        ddGroup : 'rightGridDDGroup',
        store   : new Ext.data.JsonStore({
            fields : fields,
            data   : books,
            root   : 'records'
        }),
        columns : [{
            header    : "Title",
            width     : 120,
            sortable  : true,
            dataIndex : 'title'
        },{
            header    : "Author(s)",
            width     : 280,
            sortable  : true,
            dataIndex : 'author'
        }],
        enableDragDrop : true,
        stripeRows     : true,
        viewConfig : {
            forceFit : true
        },
        plugins : [arrowPlugin]
    });

    var rightGrid = new Ext.grid.GridPanel({
        ddGroup : 'leftGridDDGroup',
        store   : new Ext.data.JsonStore({
            fields : fields,
            root   : 'records'
        }),
        columns : [{
            header    : "Title",
            width     : 120,
            sortable  : true,
            dataIndex : 'title'
        },{
            header    : "Author(s)",
            width     : 280,
            sortable  : true,
            dataIndex : 'author'
        }],
        enableDragDrop : true,
        stripeRows     : true,
        viewConfig : {
            forceFit : true
        },
        plugins : [arrowPlugin]
    });

    new Ext.Panel({
        renderTo : Ext.getBody(),
        title    : "ExtJS Books",
        width    : 800,
        height   : 300,
        layout   : {
            type  : 'hbox',
            align : 'stretch'
        },
        defaults : {
            flex : 1
        },
        items : [
            leftGrid,
            rightGrid
        ]
    });

    //Based on extjs example
    
    /****
    * Setup Drop Targets
    ***/
    // This will make sure we only drop to the  view scroller element
    var leftGridDropTargetEl =  leftGrid.getView().scroller.dom;
    var leftGridDropTarget = new Ext.dd.DropTarget(leftGridDropTargetEl, {
            ddGroup    : 'leftGridDDGroup',
            notifyDrop : function(ddSource, e, data){
                    var records =  ddSource.dragData.selections;
                    Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                    leftGrid.store.add(records);
                    leftGrid.store.sort('title', 'ASC');
                    return true
            }
    });

    // This will make sure we only drop to the view scroller element
    var rightGridDropTargetEl = rightGrid.getView().scroller.dom;
    var rightGridDropTarget = new Ext.dd.DropTarget(rightGridDropTargetEl, {
            ddGroup    : 'rightGridDDGroup',
            notifyDrop : function(ddSource, e, data){
                    var records =  ddSource.dragData.selections;
                    Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                    rightGrid.store.add(records);
                    rightGrid.store.sort('title', 'ASC');
                    return true
            }
    });

});

