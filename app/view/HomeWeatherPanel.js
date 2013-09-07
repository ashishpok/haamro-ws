Ext.define('Haamro.view.HomeWeatherPanel', {
    extend: 'Ext.Panel',
    
    xtype: 'homeWeatherPanel',
    
    requires: [
    	'Ext.ux.TouchCalendarNepaliUtil'
    ],
    
    config : {
    	
    	data: null,
        
        tpl: [
			'<div class="x-haamro-weather-block">',
				'<h1>{city}</h1>',
				'<div class="x-haamro-weather-day">',
					'<ul class ="x-haamro-weather-day-list">',
						'<li class="today">',
					      '<img src="{latest.weatherIcon}">',
					      '<div class="x-haamro-weather-detail-block">',
						      	'<table class="x-haamro-weather-detail">',
							        '<thead><th colspan="4"><b>At {latest.obv_time} {latest.format}</b><p>{latest.weatherDesc}</p></th></thead>',
							        '<tbody>',
							            '<tr><td>Temp</td><td>Humid</td><td>Wind</td><td>Precip</td></tr>',
							            '<tr><td><b>{latest.tempC}<sup>°C</sup></b>|{latest.tempF}<sup>°F</sup></td><td>{latest.humidity}%</td><td>{latest.wind}kph</td><td>{latest.precipMM}mm</td></tr>',
							    	'</tbody>',
							    '</table>', 
						    '</div>',
					    '</li>',
						    
					 	'<tpl for="weather">',     
						 	'<li',
						 		'<tpl if="isToday">',
						 			' class="today"',
						 		'</tpl>',
					 		 '>',
						      '<img src="{weatherIcon}">',
						      '<div class="x-haamro-weather-detail-block">',
							      	'<table class="x-haamro-weather-detail">',
								        '<thead><th colspan="3">{nepaliMonth} {nepaliDate}<p>{weatherDesc}</p></th></thead>',
								        '<tbody>',
								            '<tr><td>High</td><td>Low</td><td>Precip</td></tr>',
								            '<tr><td><b>{tempMaxC}<sup>°C</sup></b>|{tempMaxF}<sup>°F</sup></td><td><b>{tempMinC}<sup>°C</sup></b>|{tempMinF}<sup>°F</sup></td><td>{precipMM}mm</td></tr>',
								    	'</tbody>',
								    '</table>', 
							    '</div>',
						    '</li>',
				        '</tpl>',
					'</ul>',
	            '</div>',
			'</div>',
		]
    }
});