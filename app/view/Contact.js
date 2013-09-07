Ext.define('Haamro.view.Contact', {
    extend: 'Ext.form.Panel',
    xtype: 'mainContactForm',
    
    requires: [
		'Ext.form.FieldSet',
		'Ext.field.Email',
		'Haamro.custom.Configurations'
    ],

    config: {
    	activeItemId: 0,
    	
    	title: 'Info',

    	iconCls: 'info',
    	
    	url: Configurations.getFeedbackUrl(),
    	
    	scrollable: {
    	    direction: 'vertical',
    	    directionLock: true
    	},
    	
    	items: [
		    {
		    	xtype: 'container',
	       		layout: {
	              type: 'hbox'
	       		},
	       		items: [
	         		{
				        xtype: 'spacer',
		       		},
		       		{
				    	xtype: 'fieldset',
						width: '75%',
						title: 'Send feedback:',
						instructions: '(Help us improve and expand "Haamro Network" !!!)',
						
						items: [
						    {
							xtype: 'textfield',
							name: 'name',
							label: 'Name'
						    },
						    {
							xtype: 'textfield',
							name: 'email',
							label: 'Email'
						    },
						    {
							xtype: 'textareafield',
							name: 'message',
							label: 'Text'
						    }
						]
			      	},
		       		{
				        xtype: 'spacer'
		       		}
	         	]
		    },
		    {
		    	xtype: 'container',
	       		layout: {
	              type: 'hbox'
	       		},
	       		items: [
	         		{
				        xtype: 'spacer',
		       		},
		       		{
		       			xtype: 'button',
						width: '25%',
						text: 'Send',
						ui: 'confirm',
						handler: function() {
						    this.up('mainContactForm').submit({
						    	success: function(form, result) {
						    		 Ext.Msg.alert('Thank You', 'Your feedback is received...', Ext.emptyFn);
						    	},
						    	failure: function(form, result) {
						    		
    								Ext.Msg.alert('Device Height', 'Viewport height is ' + Ext.Viewport.getWindowHeight() + ":" 
    										+ window.innerHeight + ":" + screen.height, Ext.emptyFn);
						    		//Ext.Msg.alert('Error', 'Unable to submit feedback, please make sure you have internet connectivity...', Ext.emptyFn);
						    	}
						    });
						}
			      	},
		       		{
				        xtype: 'spacer'
		       		}
	         	]
		    },
		    {
		    	xtype: 'container',
	       		layout: {
	              type: 'hbox'
	       		},
	       		items: [
	         		{
				        xtype: 'spacer'
		       		},
		       		{
		       			xtype: 'disclaimerPanel',
		       			width: '90%'
			      	},
		       		{
				        xtype: 'spacer'
		       		}
	         	]
		    }
    	]
    }
});