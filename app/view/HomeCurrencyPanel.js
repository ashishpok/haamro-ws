Ext.define('Haamro.view.HomeCurrencyPanel', {
    extend: 'Ext.Panel',
    
    xtype: 'homeCurrencyPanel',
    
    config : {
    	
    	data: null,
        
        tpl: [
			'<div class="x-haamro-home-forex-block">',    
    			'<h1>Currency</h1>',
    			'<table class="x-haamro-forex-detail">',
			        '<colgroup>',
	                    '<col class="x-haamro-forex-col1" />',
	                    '<col class="x-haamro-forex-col2" />',
	                    '<col class="x-haamro-forex-col3" />',
	                    '<col class="x-haamro-forex-col4" />',
	                '</colgroup>',
	                '<tbody>',
	                	'<tr class="first-row"><td>Currency</td><td>Unit</td><td>Buying</td><td>Selling</td></tr>',
	                	'<tpl for="forex">',
	                    	'<tr><td>{currency}</td><td>{unit]}</td><td>{buying}</td><td>{selling}</td></tr>',
	                    '</tpl>',
	                '</tbody>',
			    '</table>', 
			'</div>'
		]
    }
});