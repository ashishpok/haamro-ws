Ext.define('Haamro.view.NewsMainNav', {
    extend: 'Ext.navigation.View',
    xtype: 'newsMainNav',
    
    requires: [
        'Haamro.view.NewsSources',
        'Ext.data.Store'
    ],
    
    config: {
    	activeItemId: 0,
    	
        title: 'News',
        
    	useTitleForBackButtonText: true,
    	
    	iconCls: 'star',
    	
    	items: [
                {
                    xtype: 'newsSources',
                }
            ],
            
        navigationBar: {
            ui: 'light'
        }
    }
});