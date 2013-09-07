Ext.define('Haamro.custom.JsonCacheUtil', {
	
	extend: 'Ext.Evented',
	
	alternateClassName: 'JsonCacheUtil',

	requires: [
        'Ext.data.reader.Json',
        'Ext.data.proxy.JsonP',
        'Haamro.custom.Configurations',
        'Haamro.custom.LocalStorage'
    ],
    
    constructor: function(config) {
    	this.callParent([config]);
    },
    
    initialize: function() {
    	this.callParent();
    	
    	var me = this,
    		baseName = this.getBaseName(),
    		modelName = 'Haamro.model.' + baseName + 'Model',
    		remoteStoreId = baseName + 'Online',
    		localStoreId = baseName + 'Offline',
    		jsonIdProperty = this.getJsonIdProperty(),
    		jsonRootProperty = this.getJsonRootProperty(),
    		proxyUrl = this.getProxyUrl();
    	
    	// make the refresh rate in minutes
    	me.setRefreshInterval(me.getRefreshInterval() * 60 *1000);
    	
    	// set json id property
    	me.setJsonIdProperty(jsonIdProperty);

		// create a model to load json data
    	Ext.define(modelName, {
    		extend : 'Ext.data.Model',
    		config: {
    			fields: [
					{name: jsonIdProperty, type: 'auto'}
				]
    		},
    	});
    	var registered = Ext.ModelManager.isRegistered(modelName);
    	if (!registered) {
    		throw new Error("Model not registered - " + modelName);
    	}    	
    	var model = Ext.ModelManager.getModel(modelName);
    	me.setRemoteStoreModel(model);
    	
    	// create remote store
    	var remoteStore = Ext.create('Ext.data.Store', {
			storeId: remoteStoreId,
			model: modelName,
			autoLoad: false,
	        proxy: {
	        	type: Configurations.getProxyType(),
	            url: proxyUrl,
	            reader: {
	                type: 'json',
	                idProperty: jsonIdProperty,
	                rootProperty: jsonRootProperty
	            }
	        }
    	});
    	me.setRemoteStore(remoteStore);
    	
    	// create local store
    	var localStore = Ext.create('Ext.data.Store', {
			storeId: localStoreId,
			model: 'Haamro.model.JsonString',
			autoLoad: false,
	        proxy: {
	        	type: 'customLocalstorage',
	        	id: localStoreId
	        }
    	});
    	localStore.load({
		    callback: function(records, operation, success) {
		        //console.log("Json Store loaded records " + records.length + ":" + success);
		   	}
		});
    	me.setLocalStore(localStore);
    },

	config: {
        refreshInterval: 1*60*1000, //in minutes
        
        baseName: 'baseJsonCache',
        
        proxyUrl: '',
        
        jsonRootProperty: '',
        
        jsonIdProperty: '',
        
        remoteStoreModel: null,
        
        remoteStore: null,
        
        localStore: null
	},
	
	populateRemoteData: function() {
		this.getRemoteStore().on ({
			load: 'handleRemoteStoreLoad',
			scope: this
		});
		this.getRemoteStore().load();
		this.getTimeStamp();
	},
	
	handleRemoteStoreLoad: function(remoteStore, records, successful) {
		if (!successful) {
			this.fireEvent('jsonRefresh', this, this.getJsonData(), true, false);
			return;
		}
		
		var item  = remoteStore.first(),
			localStore = this.getLocalStore(); 
        
        // synchronize local data with remote data
        if ((item != null) && (item.get(this.getJsonIdProperty()) != null)) {
        	// clear local data if load is successful
        	localStore.getProxy().clear();
        	localStore.add({
        		jsonData: item.get(this.getJsonIdProperty()),
        		timeStamp : this.getTimeStamp()
        	});
        	// synchronize and load the local store again
	        localStore.sync();
	        localStore.load({
			    callback: function(records, operation, success) {
			        this.fireEvent('jsonRefresh', this, records[0].get('jsonData'), false, true);
			   	},
			   	scope: this
			}); 
        }                                      
	},
	
	refreshJsonData: function() {
		var localStore = this.getLocalStore(),
			item = localStore.first();
			
		if ((item != null) && (item.get('jsonData') != null) 
				 && (((new Date()).getTime() - item.get('timeStamp')) < this.getRefreshInterval())) {
			this.fireEvent('jsonRefresh', this, item.get('jsonData'), true, true);
		} else {
			this.populateRemoteData();
		}
	},
	
	getJsonData: function() {
		var localStore = this.getLocalStore(),
			item = localStore.first();
			
		return (item != null) ? item.get('jsonData') : null;
	},
	
	getTimeStamp: function() {
		var timeNow = new Date(),
			midnight = Ext.Date.clearTime(timeNow, true),
			mins = Ext.Date.diff(midnight, timeNow, Ext.Date.MINUTE),
			minsToAdd = Math.floor(((mins*60000)/this.getRefreshInterval())) * (this.getRefreshInterval() / 60000);
		
		return(Ext.Date.add(midnight, Ext.Date.MINUTE, minsToAdd).getTime());
		//console.log("Minutes difference is : " + mins + ":" + minsToAdd + ":" + ret);
	}
});