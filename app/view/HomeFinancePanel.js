Ext.define('Haamro.view.HomeFinancePanel', {
    extend: 'Ext.Panel',
    
    xtype: 'homeFinancePanel',
    
    requires: [
    	'Haamro.custom.FormatUtil',
    	'Haamro.custom.Configurations'
    ],
    
    initialize: function() {
    	this.callParent();
    	
    	// Configure the data for this store using cache util
    	var financeCache = Ext.create('JsonCacheUtil', {
 			refreshInterval: Configurations.getFinanceRefreshRate(), 
 			baseName: 'financeData',
 			jsonIdProperty: 'RESULTS.GOLDSILVER',
    		jsonRootProperty: '',
    		proxyUrl: Configurations.getFinanceUrl()
 		});
 		financeCache.on({
 			jsonRefresh: function(store, data, cache, success) {
 				var panelData = [];
 				// add data in proper structure
 				
 				// first gold data - nepali text is causing line height to be bigger in iOS 
 				var item = new Object();
 				if (Configurations.getAdjustHeight()) {
 					item.name = 'Gold';
 				} else {
 					item.name = 'सुन';
 				}
 				item.rate = FormatUtil.formatNepCurrency(data[0].HallmarkGold, false);
 				panelData.push(item);
 				
 				// another gold data -- push only for longer screens
 				if (!Configurations.getAdjustHeight()) {
	 				item = new Object();
	 				item.name = 'तेजाबी सुन';
	 				item.rate = FormatUtil.formatNepCurrency(data[0].TejabiGold, false);
	 				panelData.push(item);
 				}
 				
 				// insert silver data
 				item = new Object();
 				if (Configurations.getAdjustHeight()) {
 					item.name = 'Silver';
 				} else {
 					item.name = 'चाँदी';
 				}
 				//item.name = 'Sil';
 				item.rate = FormatUtil.formatNepCurrency(data[0].Silver, false);
 				panelData.push(item);
 				
 				this.setData({finance :panelData});
 			},
 			scope: this 			
 		});
 		financeCache.refreshJsonData();
    },
    
    config : {

        data: null,
        
        //
        tpl: [
			'<div class="x-haamro-home-finance-block">',    
    			'<h1>Finance</h1>',
    			'<table class="x-haamro-finance-detail">',
	                '<tbody>',
	                	'<tr class="first-row"><td></td><td>10gms</td></tr>',
	                	'<tpl for="finance">',
	                		'<tr><td>{name}</td><td>{rate}</td></tr>',
	                	'</tpl>',
	                	'<tpl if="!Configurations.getAdjustHeight()">',
	                		'<tr class="last-row"><td></td><td><br/></td></tr>',
	                	'</tpl>',
	                '</tbody>',
	            '</table>',
			'</div>'
		]
		
		
    	/*
    	 '<tr><td>सुन</td><td>{gold}</td></tr>',
    	'<tr><td>सुन 2</td><td>{gold2}</td></tr>',
        '<tr><td>चाँदी</td><td>{silver}</td></tr>',
        '<tr><td><br/></td><td></td></tr>',
        */
    }
});