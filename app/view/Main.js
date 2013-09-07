Ext.define('Haamro.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'mainPanel',
    
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],

	initialize: function() {
		this.callParent();
		
		if (Ext.os.is('Phone')) {
			var barItems = this.getTabBar().getInnerItems();
			for (var i=0; i < barItems.length; i++) {
				barItems[i].addCls('x-haamro-tabbar');
			}
		}
	},
	
    config: {
        tabBarPosition: 'bottom',

        masked: {
            xtype: 'loadmask',
        },

        items: [
            {
                xtype: 'homePanel',
                activeItemId: 0
            },
            {
                xtype: 'newsMainNav',
                activeItemId: 1
            },
            {
                xtype: 'stocksCarousel',
                activeItemId: 2
            },
            {
                xtype: 'paatro',
                activeItemId: 3               
            },
            {
                xtype: 'loadSheddingNav',
                activeItemId: 4
            },
            {
                xtype: 'mainContactForm',
                activeItemId: 5
            },
        ],

        listeners: {
            activeitemchange: function(tabpanel, value, oldValue) {
            	this.fireEvent('activeItemChanged', tabpanel, value, oldValue);
            },
        }
    }
}); 