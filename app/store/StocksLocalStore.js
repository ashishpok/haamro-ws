Ext.define('Haamro.store.StocksLocalStore', {
	extend: 'Ext.data.Store',

	requires: [
        'Ext.data.proxy.LocalStorage',
    ],

	config: {
		
		model: 'Haamro.model.Stocks',

		storeId: 'stocksLocalStore',
        
		autoLoad: false,
		
		//autoSync: true,

        sorters: 'Name',

		
		proxy: {
            type: 'localstorage',

            id: 'stocksLocalStore',
        },
        
    }
});