Ext.define('Haamro.view.HomeCurrencyCarousel', {
    extend: 'Ext.Carousel',
    
    xtype: 'homeCurrencyCarousel',
    
     requires: [
    	'Haamro.custom.Configurations'
    ],
    
    initialize: function() {
    	this.callParent();
    	
    	// Configure the data for this store using cache util
    	var currencyCache = Ext.create('JsonCacheUtil', {
 			refreshInterval: Configurations.getCurrencyRefreshRate(), 
 			baseName: 'currencyRate',
 			jsonIdProperty: 'RESULTS.FOREX',
    		jsonRootProperty: '',
    		proxyUrl: Configurations.getCurrencyUrl()
 		});
 		currencyCache.on({
 			jsonRefresh: function(store, data, cache, success) {
 				var	panelData = [],
 					len = Configurations.getAdjustHeight() ? 2 : 3;
 				
 				panelData.push(data[0]);
 				for(var i=1; i< data.length; i++) {
 					var currency = data[i].currency,
 						arr = currency.split(' ');
 					if (arr.length > 2) {
 						if (currency.match(/saudi.*/ig)) {
 							data[i].currency = 'Saudi Riyal';
 						} else if (currency.match(/chinese.*/ig)) {
 							data[i].currency = 'Chinese Yuan';
 						} else {
 							data[i].currency = arr[0] + " " + arr[1];
 						}
 					} 
				
 					if (((i % len) == 0) || (i == (data.length -1))) {
 						if (i == (data.length -1)) {
 							// last item
 							panelData.push(data[i]);
 						}
 						this.add({xtype: 'homeCurrencyPanel', data : {forex : panelData}});
 						panelData = [];
 					} 
 					panelData.push(data[i]);
 					//console.log("Adding data - " + panelData[0].currency + ":" + panelData[0].unit);
 				}
 			},
 			scope: this 			
 		});
 		currencyCache.refreshJsonData();
    },           
    
    config: {
        direction: 'horizontal',
        
        indicator: true
    }
 });
