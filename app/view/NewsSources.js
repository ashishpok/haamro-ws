Ext.define('Haamro.view.NewsSources', {
    extend: 'Ext.dataview.List',

    xtype: 'newsSources',

    requires: [
        'Haamro.view.NewsSourcesListItem'
    ],
    
    config: {
        title: 'Sources',

        ui: 'haamro',

        defaultType  : 'sourcesListItem',

        useComponents: true,
        
        data: [
            //{ image: 'resources/images/ekantipur.png', title: 'ई-कान्तिपुर', lang: '(नेपाली)', id : 1 },
            { image: 'resources/images/ekantipur-nepali.png', title: 'ई-कान्तिपुर', lang: '', id : 1 },
            { image: 'resources/images/ekantipur-eng.png', title: 'eKantipur', lang: '', id: 2 },
            { image: 'resources/images/himalayan.png', title: 'The Himalayan Times', lang: '', id: 3 },
            { image: 'resources/images/nagariknews.png', title: 'नागरिक न्युज', lang: '', id: 4 },
            { image: 'resources/images/nepalnews.png', title: 'Nepalnews', lang: '', id: 5 },
            { image: 'resources/images/myrepublica.png', title: 'Republica', lang: '', id: 6 },
            { image: 'resources/images/sourya.png', title: 'सौर्य दैनिक', lang: '', id: 7 },
            { image: 'resources/images/rajdhani.png', title: 'राजधानी', lang: '', id: 8 },
            { image: 'resources/images/nayapatrika.png', title: 'नया पत्रीका', lang: '', id: 9 },
        ],

        listeners: {
            painted: function(list) {
                //console.log(Ext.Date.format(new Date(), 'H:i:s u') + " : SOURCES PAINTED");
                //var items = this.container.getScrollable().getScroller().getTranslatable().getItems();
                //console.log("NEWS SOURCES, total items : " + items.length + " ; class :" + Ext.getClassName(items[2]));   
                this.fireEvent('newsSourcePainted', this);
            },
            show: function(list) {
                // Clear all selections after list shows up again
                setTimeout(function() {
                    list.deselectAll();
                    },500
                );
            }
        }
    },

});