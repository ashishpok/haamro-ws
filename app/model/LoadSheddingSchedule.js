Ext.define('Haamro.model.LoadSheddingSchedule', {

	extend: 'Ext.data.Model',
	
	config: {

		fields: [
			{name: 'Day', type: 'string'},
			{name: 'Time', type: 'string'},
			{name: 'TimeSlots', 
				convert: function(value, record) {
					var slots = [];
					if (record.get('Time') != null) {
						slots = (record.get('Time').trim()).split(",");

						if ((slots != null) && (slots.length > 0)) {
							for (var i=0; i< slots.length; i++) {
								var times = slots[i].split("-");
								// Create from - data
								if ((times != null) && (times.length == 2)) {
									try {
										var start = Ext.Date.format(Ext.Date.parse(times[0].trim(), 'H:i'), 'h:i A');
										var end = Ext.Date.format(Ext.Date.parse(times[1].trim(), 'H:i'), 'h:i A');
										if ((start != null) && (end != null)) {
											slots[i] = start + " to " + end;
										}
									} catch (ex) {
										//ignore
									}
								}
							}
						}
					}
					return slots;
				},
			}
		],
	}
});