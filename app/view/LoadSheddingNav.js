Ext.define('Haamro.view.LoadSheddingNav', {
    extend: 'Ext.navigation.View',
    
    xtype: 'loadSheddingNav',
    
    requires: [
        'Haamro.view.LoadShedding',
        'Ext.data.Store'
    ],
    
    config: {
    	activeItemId: 0,
    	
        title: 'Schedule',

    	//useTitleForBackButtonText: true,
    	defaultBackButtonText: 'Groups',

    	iconCls: 'loadshedding',
    	
    	items: [
                {
                    xtype: 'loadSheddingList'
                }
            ],
            
        navigationBar: {
            ui: 'light'
        },

        listeners: {
            painted: function(element) {
                this.fireEvent("loadSheddingNavPainted", element);
            }
        },
    }
});