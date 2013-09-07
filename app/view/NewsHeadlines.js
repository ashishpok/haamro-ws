Ext.define('Haamro.view.NewsHeadlines', {
    extend: 'Ext.dataview.List',
    xtype: 'newsHeadlines',
    
    config: {
        itemTpl: '<h2>{title}</h2><h6>{posted}</h6><p>{description}</p>',

        listeners: {
            painted: function(list) {
                this.fireEvent('newsHeadlinesPainted', this);
            },
            show: function(list) {
                // Clear all selections when list shows up again
                setTimeout(function() {
                    list.deselectAll();
                    },500
                );
            }
	    },
    },
});