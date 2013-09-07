Ext.define('Haamro.view.Paatro', {
    extend: 'Ext.Container',

    xtype: 'paatro',

    requires: [
      'Ext.ux.TouchCalendar',
      'Ext.ux.TouchCalendarView',
    ],

    config: {
    	activeItemId: 0,
    	
    	title: 'Paatro',

    	iconCls: 'paatro',

    	layout: { 
	        type: 'vbox',
	        align: 'center',
	        pack: 'center',
    	},

    	items: [
	         {
	            xtype: 'calendar',
	
	            itemId: 'paatroCalendar',
	
	            width: '100%',
	
	            flex: 10,
	
	            viewMode: 'nepali',     
	
	            value: new Date(),
	
	            viewConfig: {
	                weekStart: 0,
	            },
	
	            listeners: {
	              selectionchange: function(view, newDate, oldDate) {
	                this.getParent().fireEvent('paatroSelectionChange', this, newDate, oldDate);
	              },
	
	              periodchange: function(view, minDate, maxDate, direction) {
	                this.getParent().fireEvent('paatroPeriodChange', this, minDate, maxDate, direction);
	              },
	            },
	         },
	         {
	            xtype: 'panel',
	
	            cls: 'nepali-cal-day-detail-bg',
	
	            itemId: 'paatroDetail',
	
	            width: '100%',
	
	            flex: 1,
	
	            html: "",
	
	            listeners: {
	              painted: function(panel) {
	                this.getParent().fireEvent('paatroDetailsInit', this);
	              }
	            },
	         },
	     ],

       listeners: {
          painted: function(container) {
            this.fireEvent('paatroInitialized', this);
          }
        },
    }
});