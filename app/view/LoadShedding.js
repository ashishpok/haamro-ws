Ext.define('Haamro.view.LoadShedding', {
    extend: 'Ext.dataview.List',
    xtype: 'loadSheddingList',
    
    config: {
        title: 'Load Shedding Schedule',
        //itemTpl: '<img src="{image}" alt={title}><h2>{title}</h2>',
        //itemTpl:'<div class="x-haamro-loadshedding-list"><h2>Group {Group}</h2></div>',
        itemTpl: '<h2>Group {Group}</h2>',
        
        store: 'loadSheddingStore',
        
        cls: 'x-haamro-loadshedding-list',
        
        /*
        itemHeight: '35',

		itemMap: {
			minimumHeight: 35
		},
		*/
        
        listeners: {
            show: function(list) {
                // Clear all selections after list shows up again
                setTimeout(function() {
                    list.deselectAll();
                    },500
                );
            }
        }
    },
});