Ext.define('Haamro.model.JsonString', {
	extend: 'Ext.data.Model',
	
	requires: [
        'Ext.data.identifier.Uuid',
    ],
	
	config: {
		identifier: 'uuid',
		
		idProperty: 'id',

		fields: [
			{name: 'id', type: 'auto'},
			{name: 'jsonData', type: 'auto'},
			{name: 'timeStamp', type: 'long'}
		]		
	}
});