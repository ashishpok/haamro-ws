Ext.define('Haamro.model.News', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'id', type: 'string'},
			{name: 'title', type: 'string'},
			{name: 'link', type: 'string'},
			{name: 'content', type: 'string'},
			{name: 'description', type: 'string',
				convert: function(value, record) {
					if (Ext.os.is.Phone && (value != null) && (value.length > 80)) {
						return (value.substring(0, 100) + '...');
					} else {
						return value;
					}
				}
			},
			{name: 'posted', type: 'string'}
		]
	}
});