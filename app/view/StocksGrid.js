Ext.define('Haamro.view.StocksGrid', {
    extend: 'Ext.ux.touch.grid.List',

    xtype: 'stocksGrid',

    requires: [
        'Ext.ux.touch.grid.feature.Feature',
        'Ext.ux.touch.grid.feature.Sorter',
        'Ext.ux.touch.grid.feature.Paging'
    ],    

    constructor : function(config) {
        this.callParent([config]);
        this.getPagingToolbar().getPager().setTitle("NepSE");
        this.getPagingToolbar().getPager().setUi("light");
    	this.setItemHeight(35);
    	this.setItemMap(
    		{minimumHeight: 35}
    	);
    },

    config: {

        page: 0,
        
        scrollable: false,

        features : [
            {
                ftype    : 'Ext.ux.touch.grid.feature.Sorter',
                launchFn : 'initialize'
            },
            {
                ftype    : 'Ext.ux.touch.grid.feature.Paging',
                launchFn : 'initialize'
            }
        ],

        columns : [
            {
                header    : 'Company',
                dataIndex : 'Name',
                style     : 'padding-left: 1em;',
                width     : '70%',
                filter    : { type : 'string' }
            },
            {
                header    : 'Price',
                dataIndex : 'ClosingPrice',
                style     : 'text-align: center;',
                width     : '15%',
                filter    : { type : 'numeric' }
            },
            {
                header    : 'Diff',
                dataIndex : 'Difference',
                cls       : 'centered-cell redgreen-cell',
                width     : '15%',
                renderer  : function (value) {
                    var cls = (value > 0) ? 'green' : 'red';

                    return '<span class="' + cls + '">' + value + '</span>';
                }
            },
        ]
    },
});