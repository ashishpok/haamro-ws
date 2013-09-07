Ext.define('Haamro.custom.WeatherDataUtil', {
	
	extend: 'Ext.Evented',
	
	alternateClassName: 'WeatherDataUtil',

	requires: [
        'Ext.data.reader.Json',
        'Haamro.custom.JsonCacheUtil',
        'Haamro.custom.Configurations'
    ],

    initialize: function() {
    	this.callParent();
    	
    	// Get cities to get weather data and load weather data for them
    	if (Configurations.getWeatherUrls().getCount() > 0) {
    		this.setWeatherCities(Configurations.getWeatherUrls().getKeys());
    	}
    	
    },

	config: {
		
		initCount: 0,
		
		weatherData: new Object(),
		
		weatherCities: []
		
	},
	
	populateData: function() {
		var urlMap = Configurations.getWeatherUrls(),
			cities = this.getWeatherCities(); 
		
		if ((this.getInitCount()+1) > cities.length) {
			//console.log("Populated all data, " + this.getWeatherData()[cities[0]] + "; returning...");
			this.fireEvent('weatherDataLoad', this.getWeatherData(), this.getWeatherCities());
			return;
		}
		
		var count = this.getInitCount();
		
		var weatherCache = Ext.create('JsonCacheUtil', {
 			refreshInterval: Configurations.getWeatherRefreshRate(),
 			baseName: cities[count].toLowerCase() + 'Weather',
 			jsonIdProperty: 'data',
    		jsonRootProperty: '',
    		proxyUrl: urlMap.get(cities[count])
 		});
    	weatherCache.on({
 			jsonRefresh: function(store, data, cache, success) {
 				//console.log("WEATHER DATA - " + cache + ":" + success);
 				this.getWeatherData()[cities[count]] = data;
 				//console.log("WEATHER DATA - " + Ext.encode((this.getWeatherData()[cities[count]]).weather[0].weatherIconUrl));
 				//console.log("WEATHER DATA LOADED - " + cities[count]);
 				this.setInitCount(count + 1);
 				this.populateData();
 			},
 			scope: this 			
 		});
    	weatherCache.refreshJsonData();
	}
});