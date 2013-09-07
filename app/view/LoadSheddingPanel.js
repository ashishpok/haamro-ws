Ext.define('Haamro.view.LoadSheddingPanel', {
    extend: 'Ext.Panel',
    
    xtype: 'loadSheddingPanel',

    config : {
        scrollable: true,
        
        styleHtmlContent: true,

        data: null,

        tpl: [
    		'<tpl for=".">', 
                '<tpl if="xindex % 2 != 0">',
                     '<div class="row">',
                '</tpl>',
                    '<tpl if="(xindex % 2 != 0) && (xindex == xcount)">',
                        '<div class="span3"></div>',
                    '</tpl>',
                        '<div class="span6">',
                			'<div class="x-haamro-load-shedding-block">',    
            	    			'<h1>{Day}</h1>',
            	    			'<ul class="x-haamro-load-shedding-block-items">',
            	    			'<tpl for="TimeSlots">',
            	    				'<li class="with-seperator">{.}</li>',
            	    			'</tpl>',
            	    			'<li />',
            	    			'</ul>',
                			'</div>',
                        '</div>',
                    '<tpl if="(xindex % 2 != 0) && (xindex == xcount)">',
                        '<div class="span3"></div>',
                    '</tpl>',
                '<tpl if="xindex % 2 != 0">', 
                    '</div>',
                '</tpl>', 
			'</tpl>'
        ]

    }
});