Ext.define('Haamro.view.DisclaimerPanel', {
    extend: 'Ext.Panel',
    
    xtype: 'disclaimerPanel',
    
    requires: [
    	'Haamro.custom.Configurations'        
    ],
    
    config : {

        data: {text : Configurations.getDisclaimerText()},
        
        tpl: [
			'<div class="x-haamro-contact-spacer-block">',    
			'</div>',
			'<div class="x-haamro-contact-disclaimer-block">',    
    			'<h1>Disclaimer</h1>',
    			'<ul class="x-haamro-contact-disclaimer-list">',
    			'<li>{text}</li>',
    			'</ul>',
			'</div>'
		]
    }
});