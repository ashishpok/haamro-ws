Ext.define('Haamro.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.util.HashMap',
        'Haamro.custom.FormatUtil',
        'Haamro.custom.JsonCacheUtil',
        'Haamro.custom.WeatherDataUtil',
        'Haamro.custom.Configurations'
    ],
    
    statics: {
        //Cache for stores and timestamps
        newsStoreCacheMap: null,
        //Indicator for initial load
        initLoadCompleted: false,
        //To show load error message only once
        loadErrorShown: false,
        //To set app in exception mode
        inExceptionMode: false,
        // Delayed Hide Mask Task
        hideMaskTask: Ext.create('Ext.util.DelayedTask'),
        //Stocks grid page number
        stocksGridCurrentPage: 1
    },

    config: {
        views: [
            //Main tabs
            'Main', 'Home', 'Contact', 'Paatro',
            // Home views
            'HomeTodayPanel', 'HomeWeatherPanel', 'HomeWeatherCarousel', 'HomeFinancePanel', 
            'HomeCurrencyPanel', 'HomeCurrencyCarousel', 'HomeUpcomingEventsPanel',
            //News views
            'NewsMainNav', 'NewsHeadlines', 'NewsSources', 'NewsHtmlPanel',
            //Stocks views
            'StocksDetailModal', 'StocksGrid', 'StocksCarousel',
            //Load Shedding views
            'LoadShedding', 'LoadSheddingPanel', 'LoadSheddingNav',
            //Contact view
            'DisclaimerPanel',
        ],

        models: ['News', 'Stocks', 'LoadShedding', 'LoadSheddingSchedule', 'JsonString'],

        stores: ['News', 'Stocks', 'StocksLocalStore', 'LoadShedding'],

        refs: {
            mainPanel: 'mainPanel',
            
            homePanel: 'homePanel',
            
            weatherCarousel: 'weatherCarousel',
            
            newsMainNav: 'newsMainNav',
            
            newsSources: 'newsSources',
            
            newsHeadlines: 'newsHeadlines',
            
            stocksCarousel: 'stocksCarousel',
            
            stocksGrid: 'stocksGrid',
            
            stocksDetailModal: 'stocksDetailModal',
            
            paatro: 'paatro',
            
            paatroDetail: 'paatro #paatroDetail',
            
            loadSheddingNav: 'loadSheddingNav',
            
            loadSheddingList: 'loadSheddingList'
        },

        control: {
            mainPanel: {
                activeItemChanged: 'onMainPanelActiveItemChanged'
            },
            
            homePanel: {
                homePanelPainted: 'onElementPainted'
            },
            
            weatherCarousel : {
            	homePanelLoaded : 'onHomePanelLoaded'
            },
            
            newsSources: {
                itemtap: 'onNewsSourceTapped',
                newsSourcePainted: 'onElementPainted'
            },
            
            newsHeadlines: {
                itemtap : 'onNewsHeadlineTapped',
                newsHeadlinesPainted : 'onElementPainted'
            },
            
            stocksGrid: {
                itemtap : 'onStocksItemTapped',
                stocksGoToPageSelected: 'onStocksGoToClicked'
            },
            
            stocksCarousel: {
                stocksCarouselPainted: 'onElementPainted'
            },
            
            stocksDetailModal: {
                stocksDetailModalHidden : 'onStocksDetailModalHidden'
            },
            
            paatro: {
                paatroSelectionChange: 'onPaatroSelectionChange',
                paatroPeriodChange: 'onPaatroPeriodChange',
                paatroDetailsInit: 'onPaatroDetailsInit',
                paatroInitialized: 'onElementPainted',
            },
            
            loadSheddingNav : {
                loadSheddingNavPainted: 'onElementPainted'
            },
            
            loadSheddingList: {
                itemtap: 'onLoadSheddingGroupTapped'
            }
        },
        
        routes: {
        	':tabPanelClass' : 'onTabPanelRouteChange'
        }

    },

    init: function() {   	
        this.loadLocalStocksStorage(true);
        //Reset show load error flag
        this.setLoadErrorShownFlag(false);
        // Reset exception mode flag
        this.setExceptionMode(false);
        //Initialize cache
        if (this.getCache() != null) {
            this.getCache().clear();
        } else {
            this.setCache(new Ext.util.HashMap());
        }
        this.getCache().replace("ShownLoadingIndicatorFlag", new Object());
    },

    launch: function() {
    	this.getApplication().redirectTo(this.getRouteName(this.getHomePanel()));
    },
    
    getCache: function() {
        return Haamro.controller.Main.newsStoreCacheMap;
    },

    setCache: function(map) {
        Haamro.controller.Main.newsStoreCacheMap = map;
    },

    getLoadErrorShownFlag: function() {
        return Haamro.controller.Main.loadErrorShown;
    },

    setLoadErrorShownFlag: function(flag) {
        Haamro.controller.Main.loadErrorShown = flag;
    },

    getInitLoadCompleted: function() {
        return Haamro.controller.Main.initLoadCompleted;
    },

    setInitLoadCompleted: function(flag) {
        Haamro.controller.Main.initLoadCompleted = flag;
    },

    getExceptionMode: function() {
        return Haamro.controller.Main.inExceptionMode;
    },

    setExceptionMode: function(flag) {
        Haamro.controller.Main.inExceptionMode = flag;
    },

    getNewsStore: function() {
        return Ext.StoreMgr.get('newsStore');
    },

    getHideMaskTask: function() {
        return Haamro.controller.Main.hideMaskTask;
    },

    getStocksGridCurrentPage: function() {
        return Haamro.controller.Main.stocksGridCurrentPage;
    },

    setStocksGridCurrentPage: function(pageNum) {
        Haamro.controller.Main.stocksGridCurrentPage = pageNum;
    },

    onNewsSourceTapped: function(list, index, element, record) {
        //Ext.Logger.info('newsSourceTapped event received: ' + record.get('id') + ":" + record.get('title'));
        this.showLoadingMask();
        // Set flag for regular mode
        this.setExceptionMode(false);
        var newsStore = this.getNewsStore();
        // Add load even listener
        newsStore.on({
            load: 'handleNewsFeedLoaded',
            scope: this,
        });
        var newsFeedUrl = Configurations.getNewsBaseUrl();
        newsStore.getProxy().setUrl(newsFeedUrl + record.get('id'));
        newsStore.setStoreTitle(record.get('title'));
        newsStore.getProxy().on({
            exception: 'handleNewsFeedException',
            scope: this,
        });
        newsStore.load();
    },

    onNewsHeadlineTapped: function(list, index, element, record) {
        //Ext.Logger.info('newsHeadlinesTapped event received: ' + record.get('link'));
        // Handle OS types
        var osName = (Ext.os.name).toLowerCase();
        if (osName == "android") {
        	try {
        		//var osVersion = window.device.version;
        		//var osVersionNum = parseInt(osVersion, 10);
        		//if (osVersionNum < 4) {
        		//	Ext.Msg.alert('Device Version', 'Device version is ' + osVersion + " : " + osVersionNum, Ext.emptyFn);
        			// use default inappbrowser for version less than 4
        		//	window.open(record.get('link'), '_blank', 'location=yes');
        		//} else {
        			// use customized child browser with gradient toolbar for versions 4+
        			window.plugins.childBrowser.showWebPage(record.get('link'), { showLocationBar: true });
        		//}
        	} catch (ex) {
        		Ext.Msg.alert('Exception', ex, Ext.emptyFn);
        	}
        } else if (osName == "windows") {
             var newsHtmlPanel = Ext.create('Haamro.view.NewsHtmlPanel',
                {
                    title: record.get('title')
                }
            );
            newsHtmlPanel.setHtml("<embed src=\"" + record.get('link') + "\" height=\"100%\" width=\"100%\" />");
            list.up('navigationview').push(newsHtmlPanel);
        } else if (osName == "ios") {
        	window.open(record.get('link'), '_blank', 'location=no');
        }
    },

    getStocksRemoteStore: function() {
        return Ext.StoreMgr.get('stocksStore');
    },

    getStocksLocalStore: function() {
        return Ext.StoreMgr.get('stocksLocalStore');
    },

    onElementPainted: function(element) {
    	if (this.getInitLoadCompleted()) {
        	this.hideLoadingMask();
       }
    },

	onHomePanelLoaded: function() {
		this.setInitLoadCompleted(true);
        this.hideLoadingMask();
    },
    
    loadLocalStocksStorage: function(isInit) {
        var stocksJsonPStore = this.getStocksRemoteStore();
        var stocksLocalStore = this.getStocksLocalStore();
        
        // check if localStorage data, load from remote otherwise
        if ((isInit) || ((stocksLocalStore.getCount()) == 0)) {
            stocksJsonPStore.on({
                load: 'onRemoteStocksStoreLoad',
                scope: this
            });
            stocksJsonPStore.getProxy().on({
                exception: 'handleStocksLoadException',
                scope: this,
            });
            stocksJsonPStore.load();
        }
    },

    onRemoteStocksStoreLoad: function(store, records, successful) {
    	if (!successful) {
    		//Ext.Logger.info("Remote store load failed, will return from local store");
    		return;
    	}
    	//Ext.Logger.info("onRemoteStocksStoreLoad: successful");
        var stocksJsonPStore = this.getStocksRemoteStore();
        stocksJsonPStore.sort('Name');
        var stocksLocalStore = this.getStocksLocalStore();
        // update picker list once new data is loaded in store
        var stocksCarousel = this.getStocksCarousel(), storeSize = stocksJsonPStore.getCount(), 
        	count = 0, pageSize = Configurations.getStocksPageSize(), loop = 1, pickerData = [], 
        	gridStore, firstCompany, lastCompany;
        // remove all current items
        stocksCarousel.removeAll(true, true);
        // show indicator
        stocksCarousel.setIndicator(true);
        // clear local data if load is successful
        stocksLocalStore.getProxy().clear();
        //loop through each data item and add to localStorage and stores for each items of carousel
        stocksJsonPStore.each(function(item){
            stocksLocalStore.add(item);
            if ((count % pageSize) == 0) {
	        	gridStore = Ext.create("Ext.data.Store", {
				    model: 'Haamro.model.Stocks'
				});
				stocksCarousel.add({xtype : 'stocksGrid', page: i, store: gridStore});
				gridStore.setStoreId('stocks-gridstore-' + loop++);
				// get value for picker data
				firstCompany = item.get('Name');
			} 
			gridStore.add(item);
			count++;
			if ((storeSize == count) || ((count % pageSize) == 0)) {
				var lastCompany = item.get('Name'),
					pageNum = pickerData.length, 
					lbl = this.getPickerItem(firstCompany, lastCompany, pageNum);
				pickerData.push({ page : pageNum,  label : lbl});
			}
			
        }, this);
        // synchronize and load the local store again
        stocksLocalStore.sync();
        stocksLocalStore.load();
		for (var i=0; i < pickerData.length; i++) {
        	var stocksGrid = stocksCarousel.getInnerItems()[i];
        	// update picker data 
        	stocksGrid.getPagingToolbar().setPickerData(pickerData);
        	stocksGrid.getPagingToolbar().getGoToPicker().setHeight(Math.min(48*pickerData.length, 432));
        }
    },

    handleStocksLoadException: function() {
    	//Ext.Logger.warn("Handling remote load exception")
        var stocksLocalStore = this.getStocksLocalStore(),
        	stocksCarousel = this.getStocksCarousel();
        // load and sort the store first
        stocksLocalStore.load();
        stocksLocalStore.sort('Name');
        //Ext.Logger.info("Trying with local store with size " + stocksLocalStore.getCount());
        
        var storeSize = stocksLocalStore.getCount(), count = 0, pageSize = Configurations.getStocksPageSize(), 
        	loop = 1, pickerData = [], gridStore, firstCompany, lastCompany;
        
        // remove all current items
        stocksCarousel.removeAll(true, true);        
        // show indicator
        stocksCarousel.setIndicator(true);
        //loop through each data item and add to localStorage and stores for each items of carousel
        stocksLocalStore.each(function(item){
            if ((count % pageSize) == 0) {
	        	gridStore = Ext.create("Ext.data.Store", {
				    model: 'Haamro.model.Stocks'
				});
				stocksCarousel.add({xtype : 'stocksGrid', page: i, store: gridStore});
				gridStore.setStoreId('stocks-gridstore-' + loop++);
				// get value for picker data
				firstCompany = item.get('Name');
			}
			gridStore.add(item);
        	count++;
        	if ((storeSize == count) || ((count % pageSize) == 0)) {
				var lastCompany = item.get('Name'),
					pageNum = pickerData.length, 
					lbl = this.getPickerItem(firstCompany, lastCompany, pageNum);
				pickerData.push({ page : pageNum,  label : lbl});
			}
        }, this);        
        //Ext.Logger.info("Loaded from local store : " + stocksLocalStore.getTotalCount() + " : " + stocksLocalStore.getCount());
        
        // update picker data 
		for (var i=0; i < pickerData.length; i++) {
        	var stocksGrid = stocksCarousel.getInnerItems()[i];
        	stocksGrid.getPagingToolbar().setPickerData(pickerData);
        }
        
        // show indicator
        stocksCarousel.setIndicator(true);
    },
    
 	getPickerItem: function(firstRowName, lastRowName, pageNum) {
    	if ((firstRowName != "") && (lastRowName != "")) {
            //lbl = firstRowName.substring(0, firstRowName.length > 3 ? 3 : firstRowName.length).toUpperCase() + " - " 
            //            + lastRowName.substring(0, lastRowName.length > 3 ? 3 : lastRowName.length).toUpperCase();
            lbl = firstRowName.substring(0, 1).toUpperCase() + " - " + lastRowName.substring(0, 1).toUpperCase();
        } else {
            lbl = "Page " +  pageNum;
        }
        return lbl;
    },

    getPickerData: function(gridStore, pages) {
        var i      = 1,
            data   = [];

		return data;
		
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

        return data;
        
    },

    onStocksItemTapped: function(list, index, element, record) {
        // create a modal window to show stocks details
        var stocksDetailModal = Ext.Viewport.add(
            {
                xtype: 'stocksDetailModal', 
                
                gridRef: list
            }
        );

        // Set content of the modal window
        stocksDetailModal.setRecord(record);
        stocksDetailModal.getItems().get('stocksDetailModalToolbar').setTitle(record.get('Name'));
        stocksDetailModal.buildStocksDetailContent();

        // show the modal window
        stocksDetailModal.show();
    },

    onStocksDetailModalHidden: function(panel, grid) {
    	// Clear list selection
    	if (grid != null) {
    		setTimeout(function() {
    			grid.deselectAll();
    		}, 500);
    		
    	} else {
    		this.getStocksGrid().deselectAll();
    	}
    },

    onStocksGoToClicked: function(pageNum) {
        // Items index start with 0 and store's index starts with 1
        this.getStocksCarousel().setActiveItem(pageNum-1);
        this.hideLoadingMask();
    },

    onStocksGridPageLoaded: function(store, data) {
        this.hideLoadingMask();
    },

    showLoadingMask: function(container) {
        //Ext.Logger.warn("Showing loading mask");
        // Avoid loading mask stay on app forever
        this.getHideMaskTask().cancel();
        this.getHideMaskTask().delay(4000, this.hideLoadingMask, this);
        this.getMainPanel().setMasked(true);
    },

    hideLoadingMask: function() {
        //Ext.Logger.warn("Hide loading mask");
        this.getMainPanel().setMasked(false);
        this.getHideMaskTask().cancel();
    },

    handleNewsFeedLoaded: function(store, records, successful, operation) {
        //Ext.Logger.verbose("Received news feed loaded event: " + store.getProxy().getUrl() + "; successful: " + successful);
        if (!this.getExceptionMode() && successful) {
            var data = store.getData();
            //Ext.Logger.info("Feed load, not in exception mode; datasize: " + data.length);
            if(data.length > 0) {
                //Ext.Logger.verbose("First data: " + data.first().get('link'));
            }
            // Save the store in cache
            this.getCache().replace(store.getProxy().getUrl() + + "_title", store.getStoreTitle());
            this.getCache().replace(store.getProxy().getUrl() + "_data" , store.getData().clone());
            // Also clear flag to show error again
            this.setLoadErrorShownFlag(false);
            // Push the view 
            this.pushNewsHeadlinesView(store);
        }
    },

    handleNewsFeedException: function(proxy, response, operation, eOpts) {
        //Ext.Logger.warn("Handling exception event: " + proxy.getUrl());
        // Set in exception mode
        this.setExceptionMode(true);
        var newsStore = this.getNewsStore();
        this.hideLoadingMask();
        if (!this.getLoadErrorShownFlag()) {
            Ext.Msg.alert('Network Error', 'Failed to load data...', Ext.emptyFn);
            this.setLoadErrorShownFlag(true);
        }
        var cachedStoreTitle = this.getCache().get(proxy.getUrl() + "_title");
        var cachedData = this.getCache().get(proxy.getUrl() + "_data");
        if (cachedData != null && cachedData.length > 0) {
            this.showLoadingMask();
            /*
            Ext.Logger.verbose("Loading from cached store, size: " + cachedData.length + "; title: " + cachedStoreTitle
            		+ "\n\tfirst data: " + cachedData.first().get('link')
            		+ "\n\tlast data: " + cachedData.last().get('link'));
            */
            newsStore.removeAll(true);
            this.populateDataInStore(newsStore, cachedData);
            this.pushNewsHeadlinesView(newsStore);
        } else {
            Ext.Msg.alert('Sorry!!!', 'Network access error, no local data...', Ext.emptyFn);
        }
    },

    pushNewsHeadlinesView: function(store) {
        try {
            //Ext.Logger.info("Push headlines view : " + store.getStoreTitle() + "; dataSize: " + store.getData().length);
            // Push the right view now
            var newsHeadlines = Ext.create('Haamro.view.NewsHeadlines', 
                { title: store.getStoreTitle() }
            );
            newsHeadlines.setStore(store);
            this.getNewsMainNav().push(newsHeadlines);
        } catch(ex) {
            //Ext.Logger.warn("Error updating headline panel view " + ex);
        } finally {
            // Hide loading indicator
            this.hideLoadingMask();
        }
    },

    populateDataInStore: function(store, data) {
        if ((data != null) && (Ext.getClassName(data) == 'Ext.util.Collection')) {
            data.each(function(item){
                store.add(item);
            });
        }
    },

    onPaatroSelectionChange: function(view, newDate, oldDate) {
       this.getPaatroDetail().setHtml(this.buildDetailsContent(newDate, true));
    },

    onPaatroPeriodChange: function(view, minDate, maxDate, direction) {
        this.getPaatroDetail().setHtml(this.buildDetailsContent(new Date(), false));
    },

    onPaatroDetailsInit: function(panel) {
        this.getPaatroDetail().setHtml(this.buildDetailsContent(new Date(), true));
    },

    buildDetailsContent: function(date, fillContent) {
        var html = ['<div class="nepali-cal-day-detail"><p>'];
        var nepaliVals = NepaliCalendarUtil.getNepaliMonthValuesInUTC(date),
            firstParva = NepaliCalendarUtil.getFirstParva(date),
            secondParva = NepaliCalendarUtil.getSecondParva(date),
            isHoliday = NepaliCalendarUtil.isHoliday(date),
            isWeekend = NepaliCalendarUtil.isWeekend(date),
            tithi = NepaliCalendarUtil.getNepaliTithi(date);

        if (fillContent) {
        
            html.push(NepaliCalendarUtil.convertToNepaliNumber(nepaliVals.year) + " साल " 
                    + nepaliVals.monthName + " " 
                    + NepaliCalendarUtil.convertToNepaliNumber(nepaliVals.nepaliDate) + " गते<br/>");

            var comma = false;
            if (tithi != "") {
                html.push(tithi);
                comma = true;
            }
            if (firstParva != "") {
                html.push(comma ? ", " + firstParva : firstParva);
                comma = true;
            }
            if (secondParva != "") {
                html.push(comma ? ", " + secondParva : secondParva);
                comma = true;
            }
            // nothing for now
            //if (isWeekend || isHoliday) {
            //    html.push(comma ? "" : "");
            //}
        }
        
        html.push('</p></div>');
        return (html.join(''))
    },

    onLoadSheddingGroupTapped: function (list, index, element, record) {
        var loadSheddingPanel = Ext.create('Haamro.view.LoadSheddingPanel',
            {
                title: 'Group ' + record.get('Group')
            }
        );
        var schedRecords = record.schedule().getRange();
        loadSheddingPanel.setData(this.collectData(schedRecords));
        list.up('loadSheddingNav').push(loadSheddingPanel);
    },

    collectData: function(records) {
        var data = [];

        Ext.each(records, function(record, index){
            data.push(record.data);
        }, this);

        return data;
    },
    
    /*
     * Routing related methods
     */
    getRouteName: function(clazz) {
    	return (clazz.getActiveItemId() != null ? 'tabpanel-' + clazz.getActiveItemId() : 
    		Ext.getClassName(clazz).replace(/\./g, ''));
    },
    
    extractIdFromRoute: function(route) {
    	var arr = route.split('-');
    	return arr.length == 2 ?  arr[1] : null;
    },
    
    onMainPanelActiveItemChanged: function(tabpanel, value, oldValue) {
        this.getApplication().redirectTo(this.getRouteName(value));
        if (!value.isXType('mainContactForm')) {
        	if ((this.getCache().get("ShownLoadingIndicatorFlag"))[value.getActiveItemId()] == null) {
        		this.showLoadingMask(tabpanel);
        		(this.getCache().get("ShownLoadingIndicatorFlag"))[value.getActiveItemId()] = "ShownOnce";
        		//Ext.Logger.verbose("Caching load mask now..." + value.getActiveItemId());
        	} else {
        		//Ext.Logger.verbose("Skipping load mask now..." + (this.getCache().get("ShownLoadingIndicatorFlag"))[value.getActiveItemId()]);
        	}
        }
    },

    onStocksPanelActive: function(tabpanel, value, oldValue) {
        //Ext.Logger.info("Panel active item changed to " + Ext.getClassName(value));
        this.showLoadingMask(tabpanel);
    },
    
    onTabPanelRouteChange: function(route) {
    	//Ext.Logger.info("New view from route - " +  route);
    	if(this.extractIdFromRoute(route) != null) {
    		var newId = parseInt(this.extractIdFromRoute(route)),
    			activeItem = this.getMainPanel().getActiveItem().getActiveItemId();
    		if((activeItem != null) && (activeItem != newId)) {
    			this.getMainPanel().setActiveItem(newId);
    		}
    	} else {
	    	//Ext.Logger.warn("Navigation route could not be extracted");
    	}
    }
});
