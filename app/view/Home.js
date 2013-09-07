Ext.define('Haamro.view.Home', {
    extend: 'Ext.Container',

    xtype: 'homePanel',
    
    requires: [
    	'Haamro.custom.Configurations'
    ],

    config: {
      activeItemId: 0,
    	
      title: 'Home',

      iconCls: 'home',

      cls: 'home',

      scrollable: null,
      
      //styleHtmlContent: true,
		layout:{
        	type: 'vbox',
        	pack: 'center'
    	},
            
      items: [
      	/*
      	{
        	xtype: 'panel',
        	//flex: 1,
        	html: '<div><br/><br/></div>'
      	},
      	*/
       	{
       		xtype: 'container',
       		layout: {
              type: 'hbox'
           	},
           	//flex: 78,
           	items: [
           		{
           			xtype: 'container',
			       	flex: 6,
		       		layout: {
		              type: 'vbox'
		           	},
			       	items : [
			       		{
				            xtype: 'panel',
				            html: [
				               '<img src="resources/images/haamro.png" />'
				            ].join(""),
				        }, 
				       	{
				        	xtype: 'panel',
				        	html: ((Ext.os.name).toLowerCase() == 'ios') ? '' : '<div style="height: 0.5em"><p><br/></p></div>'
				      	},
				       	{
			       			xtype: 'homeTodayPanel', 
				       	},
				       	{
				        	xtype: 'panel',
				        	//flex: 1,
				        	html: (Configurations.getAdjustHeight() ? '<div><br/></div>' :'<div><br/><br/></div>')
				      	}, 	
					]
				},
				{
					xtype: 'container',
			       	flex: 14,
		       		layout: {
		              type: 'vbox'
		           	},
			       	items : [
			       		{
			       			xtype: 'panel',
				        	//flex: 1,
				        	html: (((Ext.os.name).toLowerCase() == 'ios') && (Ext.os.is('Phone'))) ? '<div style="font-size: 0.63em"><p><br/></p><p><br/></p></div>' : ''
			       		},
				       	{
			       			xtype: 'weatherCarousel',
			       			flex: 1
				       	},
				       	{
				        	xtype: 'panel',
				        	//flex: 1,
				        	html: (Configurations.getAdjustHeight() ? '' : '<div style="font-size: 0.50em"><br/></div>')
				      	}, 
					]
				}
			]
		},
		{
       		xtype: 'container',
       		layout: {
              type: 'hbox'
           	},
           	//flex: 78,
           	items: [
           		{
           			xtype: 'container',
			       	flex: 6,
		       		layout: {
		              type: 'vbox'
		           	},
			       	items : [
				       	{
			       			xtype: 'homeFinancePanel',
				       	},
				       	{
				        	xtype: 'panel',
				        	//flex: 1,
				        	html: '<div><br/></div>'
				      	}, 	
					]
				},
				{
		            xtype: 'homeCurrencyCarousel',
		            flex: 14
				}
			]
		}
	],
       
   listeners: {
        painted: function(element) {
            this.fireEvent("homePanelPainted", element);
        }
    },
    }
});