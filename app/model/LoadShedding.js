Ext.define('Haamro.model.LoadShedding', {
	extend: 'Ext.data.Model',
	
	config: {

		fields: [
			{name: 'Group', type: 'string'},
		],

		hasMany: {model: 'Haamro.model.LoadSheddingSchedule', name: 'schedule', associationKey: 'Schedule'}
		
	}
});