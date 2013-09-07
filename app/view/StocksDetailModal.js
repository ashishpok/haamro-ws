Ext.define('Haamro.view.StocksDetailModal', {
    extend: 'Ext.Panel',

    xtype: 'stocksDetailModal',
    
    requires: ['Haamro.custom.ModalAction'],
    
    config: {
    
      modal: true,

      hideOnMaskTap: true,

      centered: true,

      width: Ext.os.deviceType == 'Phone' ? 300 : 400,

      height: Ext.os.deviceType == 'Phone' ? 350 : 380,

      styleHtmlContent: true,

      scrollable: null,
      
      gridRef: null,

      showAnimation: {
          type: 'popIn',
          duration: 250,
          easing: 'ease-out'
      },
      
      hideAnimation: {
          type: 'popOut',
          duration: 250,
          easing: 'ease-out'
      },

      // Custom Param
      record: null,

      items: [
	        {
	          docked: 'top',
	          xtype: 'toolbar',
	          title: 'Title',
	          ui: 'light',
	          itemId: 'stocksDetailModalToolbar',
	        }
      	],
      	
      	plugins: [
  	        {
  	            xclass: 'Haamro.custom.ModalAction',
  	        }
  	    ],
    },

    hide: function(animation) {
        var me = this;
        this.fireEvent('stocksDetailModalHidden', me, this.getGridRef());
        me.callParent();
    },

    buildStocksDetailContent: function() {
      var record = this.getRecord();
      if (record != null) {
        var diff = record.get('Difference');
        var htmlContent = '<div>' +
            '<table class="x-haamro-stocks-detail">' +
                '<colgroup>' +
                    '<col class="x-haamro-stocks-col1" />' +
                    '<col class="x-haamro-stocks-col2" />' +
                '</colgroup>' +
                '<tbody>' +
                    '<tr><td>Code</td><td>' + record.get('Code') + '</td></tr>' +
                    '<tr><td>Transactions</td><td>' + record.get('TransactionNo') + '</td></tr>' +
                    '<tr><td>Total Share</td><td>' + record.get('TotalShare') + '</td></tr>' +
                    '<tr><td>Amount</td><td>' + Haamro.custom.FormatUtil.formatNepCurrency(record.get('Amount'), true) + '</td></tr>' +                   
                    '<tr><td>Minimum Price</td><td>' + Haamro.custom.FormatUtil.formatNepCurrency(record.get('MinPrice'), true) + '</td></tr>' +
                    '<tr><td>Maximum Price</td><td>' + Haamro.custom.FormatUtil.formatNepCurrency(record.get('MaxPrice'), true) + '</td></tr>' +
                    '<tr><td>Closing Price</td><td>' + Haamro.custom.FormatUtil.formatNepCurrency(record.get('ClosingPrice'), true) + '</td></tr>' +
                    '<tr><td>Previous Closing</td><td>' + Haamro.custom.FormatUtil.formatNepCurrency(record.get('PrevClosing'), true) + '</td></tr>' +
                    '<tr><td>Difference</td>' + ( diff>=0 ? "<td class=\"green-cell\">" : "<td class=\"red-cell\">") + Haamro.custom.FormatUtil.formatNepCurrency(diff, true) + '</td></tr>' +
                '</tbody>' +
            '</table>' +
            '</div>';
        this.setHtml(htmlContent);
      } else {
        this.setHtml("");
      }
    },
});