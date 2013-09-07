Ext.define('Ext.ux.touch.grid.feature.Paging', {
    extend   : 'Ext.ux.touch.grid.feature.Abstract',

    requires : [
        'Ext.ux.touch.grid.feature.Abstract',
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.Panel'
    ],

    config : {
        events : {
            store : {
                load : 'handleGridPaint'
            }
        },

        extraCls : 'paging',

        goToButton    : {
            disabled : true,
            iconCls	 : 'arrow_down',
            iconMask : true,
        },

        backButton    : null,

        forwardButton : null,

        pager         : {
            docked : 'top',
        },

        pageListTpl : '{label}',

        goToPicker  : {
            centered      : true,
            modal         : true,
            width         : 90,
            height        : 300,
            layout        : 'fit',
            hideOnMaskTap : true
        },
        
        pickerData  : [],

        pages       : 0,
    },

    backText : 'back',

    init : function(grid) {
        var store = grid.getStore();
        if (!store.isLoading()) {
            grid.on('painted', 'handleGridPaint', this, { buffer : 50 });
        }
        // custom added for haamro
        grid.setPagingToolbar(this);
    },

    applyGoToPicker : function(config, oldConfig) {
        if (!config.hasOwnProperty('items')) {
            config.items = [
                {
                    xtype   : 'list',
                    itemTpl : this.getPageListTpl(),
                    store   : new Ext.data.Store({
                        fields : [
                            'page', 'label'
                        ]
                    }),
                    listeners : {
                        scope   : this,
                        itemtap : 'handlePageSelect'
                    }
                }
            ];
        }

        return Ext.factory(config, Ext.Panel, oldConfig);
    },

    applyPager : function(newPager, oldPager) {
        return Ext.factory(newPager, Ext.Toolbar, oldPager);
    },

    updatePager : function(newPager, oldPager) {
        var me   = this,
            grid = me.getGrid();

        if (oldPager) {
            grid.remove(oldPager);
        }

        if (newPager) {
            grid.insert(0, newPager);
        }
    },

    applyGoToButton : function(config, oldButton) {
        Ext.apply(config, {
            iconCls: 'arrow_down',
            iconMask: true,
            disabled : true,
            scope    : this,
            handler  : 'handleGoToButton'
        });

        return Ext.factory(config, Ext.Button, oldButton);
    },

    updateGoToButton : function(newButton, oldButton) {
        var me    = this,
            pager = me.getPager(),
            idx   = 2;

        if (oldButton) {
            idx = pager.getInnerItems().indexOf(oldButton);

            pager.remove(oldButton);
        }

        if (newButton) {
            pager.insert(idx, newButton);
            me.checkSpacers();
        }
    },

    checkSpacers : function() {
        var me         = this,
            pager      = this.getPager(),
            items      = pager.getInnerItems(),
            goToBtn    = me.getGoToButton(),
            idx, spacer;

        if (goToBtn) {
            idx = items.indexOf(goToBtn);
            pager.insert(idx, {
                xtype : 'spacer'
            });
        }

    },

    handleGridPaint : function(grid) {
        if (!(grid instanceof Ext.ux.touch.grid.List)) {
            grid = this.getGrid();
        }

        var me    = this,
            store = grid.getStore();

        if (store.isLoading()) {
            store.on('load', 'handleGridPaint', me, { single : true });
            return;
        }

        store.on('clear', 'handleGridPaint', me, { single : true });

        var total         = store.getTotalCount(),
            currentPage   = store.currentPage,
            pages         = Math.ceil(total / store.getPageSize()),
            backButton    = me.getBackButton(),
            forwardButton = me.getForwardButton(),
            goToButton    = me.getGoToButton();

        me.setPages(pages);
        if (backButton != null) {
            backButton   .setDisabled(currentPage === 1 || store.getCount() === 0);
        }
        if (forwardButton != null) {
            forwardButton.setDisabled(currentPage === pages || store.getCount() === 0);
        }
        if (goToButton != null) {
        	goToButton.setDisabled(false);
            //goToButton.setDisabled(pages === 0  || store.getCount() === 0);
        }
    },

    handleGoToButton : function(btn) {
        var me     = this,
            picker = me.getGoToPicker(),
            store = picker.down('list').getStore();

        store.removeAll();

        if (this.getPickerData().length == 0 ) {
            this.handleUpdatePickerData();
        } 

        store.add(this.getPickerData());

        picker.showBy(btn);
    },

    handlePageSelect : function(list, index) {
        var panel = list.up('panel'),
            store = this.getGrid().getStore(),
            page  = index + 1;

        //store.loadPage(page);
        console.log("Paging " + Ext.getClassName(this.getGrid()));
        this.getGrid().fireEvent('stocksGoToPageSelected', page);

        panel.hide();
    },

    handleUpdatePickerData: function() {
        var me     = this,
            pages  = me.getPages(),
            gridStore = this.getGrid().getStore(),
            i      = 1,
            data   = [];

        //gridStore.suspendEvents();
        for (i=1; i <= pages; i++) {
            gridStore.loadPage(i);
            var firstRowName = gridStore.first().get('Name') || "",
                lastRowName = gridStore.last().get('Name') || "" ,
                lbl;

            if ((firstRowName != "") && (lastRowName != "")) {
                lbl = firstRowName.substring(0, firstRowName.length > 3 ? 3 : firstRowName.length).toUpperCase() + " - " 
                            + lastRowName.substring(0, lastRowName.length > 3 ? 3 : lastRowName.length).toUpperCase();
            } else {
                lbl = "Page " +  i;
            }
            data.push({ page : i,  label : lbl});
        }
        gridStore.resumeEvents();
        // save locally
        this.setPickerData(data);
        
    }
});