Ext.define('Haamro.store.LoadShedding', {
	extend: 'Ext.data.Store',

	requires: [
        'Ext.data.reader.Json',
        'Haamro.custom.JsonCacheUtil',
        'Haamro.custom.Configurations'
    ],
    
    initialize: function() {
    	this.callParent();
    	
    	// Configure the data for this store using cache util
    	var jsonCache = Ext.create('JsonCacheUtil', {
 			refreshInterval: Configurations.getLoadSheddingRefreshRate(), 
 			baseName: 'loadShedding',
 			jsonIdProperty: 'RESULTS',
    		jsonRootProperty: '',
    		proxyUrl: Configurations.getLoadSheddingUrl()
 		});
 		jsonCache.on({
 			jsonRefresh: function(store, data, cache, success) {
 				this.setData(data.NLS);
 			},
 			scope: this 			
 		});
 		jsonCache.refreshJsonData();
    },

	config: {
		model: 'Haamro.model.LoadShedding',

		storeId: 'loadSheddingStore',

		autoLoad: false,
	}
});