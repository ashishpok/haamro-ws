Ext.define('Haamro.store.Stocks', {
	extend: 'Ext.data.Store',

	requires: [
        'Ext.data.proxy.JsonP',
        'Haamro.custom.Configurations'
    ],

	config: {
		model: 'Haamro.model.Stocks',

		storeId: 'stocksStore',
        
		autoLoad: false,

        
		proxy: {
			
			type: 'jsonp',
			
            url: Configurations.getStocksUrl(),

            noCache: false,
            
            reader: {
                type: 'json',
                rootProperty: 'responseData.entries'
            }
        },
	}
});