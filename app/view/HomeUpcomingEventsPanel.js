Ext.define('Haamro.view.HomeUpcomingEventsPanel', {
    extend: 'Ext.Panel',
    
    xtype: 'homeUpcomingEventsPanel',
    
    initialize: function() {
    	this.callParent();
    	
    	var data = {
    		today : [
    			'one event', 'two event', 'three event'
    		]
    	};
    	
    	this.setData(data);
    },
    
    config : {

        data: null,
        
        tpl: [
			'<div class="x-haamro-home-events-block">',    
    			'<h1>Upcoming Days</h1>',
    			'<ul class="x-haamro-home-events-block-items">',
    			'<tpl for="today">', 
    				'<li class="event-item">{.}</li>',
    			 '</tpl>',
    			 '<li class="event-item"><br/></li>',
    			'</ul>',
			'</div>'
		]
    }
});