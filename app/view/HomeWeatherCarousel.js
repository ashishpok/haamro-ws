Ext.define('Haamro.view.HomeWeatherCarousel', {
    extend: 'Ext.Carousel',
    
    xtype: 'weatherCarousel',
    
    requires: [
       'Haamro.custom.WeatherDataUtil',
       'Ext.ux.TouchCalendarNepaliUtil'
    ],
    
    initialize: function() {
    	this.callParent();
    	var weatherDataUtil = Ext.create('Haamro.custom.WeatherDataUtil');
    	weatherDataUtil.on({
    		weatherDataLoad: function(weatherData, cities) {
 				var items = [];
 				
 				try {
	 				for(var i=0; i < cities.length; i++) {
	 					// format data for home panel
	 					var data = new Object(),
	 						weather = weatherData[cities[i]].weather,
	 						latest = weatherData[cities[i]].current_condition[0],
	 						showToday = true;
	 						//obv_date = Ext.Date.parse(weather[0].date, 'Y-m-d'), // observation date will be of the first day of weather report
	 						//obv_nep_date = NepaliCalendarUtil.getNepaliMonthValuesInUTC(obv_date);
	 						
	 					
	 					data.city = cities[i];
	 					data.latest = new Object();
	 					data.weather = [];
	 					
	 					// update latest conditions
	 					try {
	 						var obv_time = Ext.Date.parse(latest.observation_time, 'h:i A');
	 						obv_time = Ext.Date.add(obv_time, Ext.Date.MINUTE, 345);
	 						if (obv_time.getHours() > 12) {
	 							showToday = false;
	 						}
	 						data.latest.obv_time = Ext.Date.format(obv_time, 'h:i A'); // 5:45 ahead of UTC
	 						data.latest.format = 'local time';
	 						
	 					} catch (ex) {
	 						data.latest.obv_time = latest.observation_time;
	 						data.latest.format = 'UTC time';
	 					}
	 					data.latest.precipMM = latest.precipMM;
						data.latest.tempC = latest.temp_C;
						data.latest.tempF = latest.temp_F;
						data.latest.humidity = latest.humidity;
						data.latest.wind = latest.windspeedKmph;
						data.latest.weatherCode = latest.weatherCode;
						data.latest.weatherDesc = latest.weatherDesc[0].value;
						//data.latest.date = obv_date;
	 					//data.latest.nepaliMonth = obv_nep_date.monthName;
	 					//data.latest.nepaliDate = NepaliCalendarUtil.convertToNepaliNumber(obv_nep_date.nepaliDate);
	 						
						var iconUrl =  latest.weatherIconUrl[0].value,
							parsed = iconUrl.split('/'),
							icon = parsed[parsed.length - 1];
						data.latest.weatherIcon = 'resources/images/' + icon;
	 					
	 					// update 3 day conditions
	 					for (var j=0; j < weather.length; j++) {
							if ((j==0) && !showToday) {
								continue;
							} else if (showToday && (j== (weather.length - 1))) {
								continue;
							}
	 						
	 						var item = new Object(),
	 							date = Ext.Date.parse(weather[j].date, 'Y-m-d'),
	 							nepaliDate = NepaliCalendarUtil.getNepaliMonthValuesInUTC(date);
	 						
	 						//item.isToday = Ext.Date.diff(date, new Date(), Ext.Date.DAY) == 0;
	 						item.isToday = false;
	 						item.date = date;
	 						item.nepaliMonth = nepaliDate.monthName;
	 						item.nepaliDate = NepaliCalendarUtil.convertToNepaliNumber(nepaliDate.nepaliDate);
	 						item.precipMM = weather[j].precipMM;
	 						item.tempMaxC = weather[j].tempMaxC;
	 						item.tempMaxF = weather[j].tempMaxF;
	 						item.tempMinC = weather[j].tempMinC;
	 						item.tempMinF = weather[j].tempMinF;
	 						item.weatherCode = weather[j].weatherCode;
	 						item.weatherDesc = weather[j].weatherDesc[0].value;
	 						
	 						var iconUrl =  weather[j].weatherIconUrl[0].value,
	 							parsed = iconUrl.split('/'),
	 							icon = parsed[parsed.length - 1];
	 						item.weatherIcon = 'resources/images/' + icon;
	 						
	 						data.weather.push(item);
	 						//console.log("DATA - " + data.city.toUpperCase() + ":"+ item.weatherIcon + ":" + item.weatherDesc + ":" + item.nepaliMonth + ":" + item.nepaliDate);
	 					}
	 					
	 					this.add({xtype: 'homeWeatherPanel', data: data});
	 				}
 				} catch (ex) {
 					// ignore 
 				}
 				this.fireEvent("homePanelLoaded");
 			},
 			scope: this 			
 		});
    	weatherDataUtil.populateData();
    	
    	// Fire this even so home page doesn't get stuck in loading
    	var me = this;
    	setTimeout(function() {
			me.fireEvent("homePanelLoaded");
		}, 10000);
    },           
    
    config: {
        direction: 'horizontal',
        
        indicator: true
    }
 });
