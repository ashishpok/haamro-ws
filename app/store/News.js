Ext.define('Haamro.store.News', {
	extend: 'Ext.data.Store',

	requires: [
        'Ext.data.proxy.JsonP',
    ],

	config: {
		model: 'Haamro.model.News',

		storeId: 'newsStore',

        storeTitle: '',

		autoLoad: false,

		proxy: {
            type: 'jsonp',
            url: null,
            noCache: false,
            
            reader: {
                type: 'json',
                rootProperty: 'responseData.entries'
            }
        },
	}
});