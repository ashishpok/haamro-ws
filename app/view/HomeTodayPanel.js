Ext.define('Haamro.view.HomeTodayPanel', {
    extend: 'Ext.Panel',
    
    xtype: 'homeTodayPanel',
    
    requires: [
    	'Ext.ux.TouchCalendarNepaliUtil'
    ],
    
    initialize: function() {
    	this.callParent();
    	
    	var data = {
    		today : new Date()
    	};
    	
    	this.setData(data);
    },
    
    config : {

        data: null,
        
        tpl: [
			'<div class="x-haamro-home-din-block">',    
    			'<h1>{[NepaliCalendarUtil.getNepaliMonthValuesInUTC(values.today).monthName]}</h1>',
    			'<ul class="x-haamro-home-day-block-items">',
	    			'<li class="header-item">{[Ext.Date.format(values.today, "M")]} {[Ext.Date.format(values.today, "j")]}, {[Ext.Date.format(values.today, "D")]}</li>',
	    			'<li class="with-seperator">{[NepaliCalendarUtil.convertToNepaliNumber(NepaliCalendarUtil.getNepaliMonthValuesInUTC(values.today).nepaliDate)]}</li>',
	    			'<li class="footer-item-1">{[NepaliCalendarUtil.getNepaliTithi(values.today)]}</li>',
	    			'<li class="footer-item-2">{[NepaliCalendarUtil.getFooterItem2(values.today)]}</li>',
    			'</ul>',
			'</div>'
		]
    }
});