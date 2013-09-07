Ext.define('Haamro.view.NewsSourcesListItem', {
    extend: 'Ext.dataview.component.ListItem',
    
    xtype : 'sourcesListItem',
    
    requires: [
        'Ext.Img',
        'Ext.Spacer'
    ],

    config: {

        spacerStart: {
            xtype: 'spacer',
            cls: 'x-list-item-body x-haamro-li-spacer',
        },

        image: {
            width: 230,
            border: 11,
            cls: [
                'image',
                'x-list-item-body x-haamro-li-image',
            ],
        },

        title: {
            width: 30,
            cls: [
                'title',
                'x-list-item-body x-haamro-li-title',
            ],
        },

        spacerEnd: {
            xtype: 'spacer',
            cls: 'x-list-item-body x-haamro-li-spacer',
        },

        dataMap: {

            getImage: {
                setSrc: 'image',
            },

            getTitle: {
                setHtml: 'lang',
            },

        },

        layout: {
            type: 'hbox',
        }
    },

    applyTitle: function(config) {
        return Ext.factory(config, Ext.Component, this.getTitle());
    },

    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    applyImage: function(config) {
        return Ext.factory(config, Ext.Img, this.getImage());
    },

    updateImage: function(newImage, oldImage) {
        if (newImage) {
            this.add(newImage);
        }
        if (oldImage) {
            this.remove(oldImage);
        }
    },

    applySpacerStart: function(config) {
        return Ext.factory(config, Ext.Spacer, this.getSpacerStart());
    },

    updateSpacerStart: function(newSpacer, oldSpacer) {
        if (newSpacer) {
            this.add(newSpacer);
        }
        if (oldSpacer) {
            this.remove(oldSpacer);
        }
    },

    applySpacerEnd: function(config) {
        return Ext.factory(config, Ext.Spacer, this.getSpacerEnd());
    },

    updateSpacerEnd: function(newSpacer, oldSpacer) {
        if (newSpacer) {
            this.add(newSpacer);
        }
        if (oldSpacer) {
            this.remove(oldSpacer);
        }
    },
});
