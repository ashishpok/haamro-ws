Ext.define('Haamro.model.Stocks', {
	extend: 'Ext.data.Model',

	requires: [
        'Ext.data.identifier.Uuid',
    ],
	
	config: {
		identifier: 'uuid',
		
		idProperty: 'id',

		fields: [
			{name: 'id', type: 'auto'},
			{name: 'Code', type: 'string'},
			{name: 'Name', type: 'string'},
			{name: 'TransactionNo', type: 'int'},
			{name: 'MaxPrice', type: 'int'},
			{name: 'MinPrice', type: 'int'},
			{name: 'ClosingPrice', type: 'int',
				convert: function(value, record) {
					return Haamro.custom.FormatUtil.formatNepCurrency(value, false);
				},
				sortType: function(value) {
					var retVal = (value + "").replace(/,/g, "");
					return parseInt(retVal);
				}
			},
			{name: 'TotalShare', type: 'int'},
			{name: 'Amount', type: 'int'},
			{name: 'PrevClosing', type: 'int'},
			{name: 'Difference', type: 'int'},
		],

		proxy: {
            type: 'localstorage',
            id: 'stocksLocalStore'
        },
	}
});