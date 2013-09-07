Ext.define('Haamro.custom.ModalAction', {
	
	extend: 'Ext.Component',
	
	constructor: function(config){
       this.callParent([config]);
    },

    config: {
    	
    	position: 'tr',
    	
    	xOffset: 2,
    	
    	yOffset: -6,
    	
    	baseClass: 'x-panel-action-icon',
    	
    	iconClass: 'x-panel-action-icon-close',
    	
    	iconPressedClass: 'x-panel-action-icon-pressed',
    	
    	actionMethod: ['hide'],
    },
    
    init: function(parent){
        // cache the reference to parent for later
        this.parent = parent;
        
        // Make it an array if it isn't so we know what we're dealing with
        if (!Ext.isArray(this.getActionMethod())) {
            this.setActionMethod([this.getActionMethod()]);
        }
        
        parent.on({
            show: this.onParentShow,
            destroy: this.onParentDestroy,
            resize: this.onParentResize,
            scope: this
        });
    },
    
    /**
     * Create the iconEl when panel is shown
     * @param {Object} component
     */
    onParentShow: function(component){
        if (!this.iconEl) {
			
			// Create the Icon Element
            this.iconEl = component.element.createChild({
                cls: this.getBaseClass() + ' ' + this.getIconClass()
            });
			
			// Cache the element's Width and Height for use later
			this.iconDimensionX = this.iconEl.getWidth();
    		this.iconDimensionY = this.iconEl.getHeight();
            
            // Reposition the Icon
            this.positionIcon();
            
            // Attach Tap events to Icon
            this.iconEl.on({
                touchstart: this.onIconTapStart,
				touchend: this.onIconTap,
                scope: this
            });
        }
    },
    
    onIconTapStart: function(){
        this.iconEl.addCls(this.getIconPressedClass());
    },
    
    onParentResize: function(component, adjWidth, adjHeight, rawWidth, rawHeight){
        this.positionIcon();
    },
    
    onParentDestroy: function(){
        this.parent.removeListener('show', this.onParentShow, this);
        this.parent.removeListener('resize', this.onParentResize, this);
		this.iconEl.removeListener('touchstart', this.onIconTapStart, this);
        this.iconEl.removeListener('touchend', this.onIconTap, this);
    },
    
    onIconTap: function(){
        this.iconEl.removeCls(this.getIconPressedClass());
        
        for (var i = 0; i < this.getActionMethod().length; i++) {
            this.doCallbackCall(this.getActionMethod()[i]);
        }
    },
    
    doCallbackCall: function(method){
        if (Ext.isFunction(method)) {
            method();
        }
        else {
            this.parent[method]();
        }
    },
    
    positionIcon: function(){
        var characters = this.getPosition().split('');
        
        var top = 0;
        var left = 0;
        
        if (characters.length >= 2) {
            var posY = characters[0].toLowerCase();
            var posX = characters[1].toLowerCase();
                       
            // Figure out Y position
            switch (posY) {
                case 't':
                    top = -1 * (this.iconDimensionY / 2);
                    break;
                    
                case 'b':
                    top = this.parent.getHeight() - (this.iconDimensionY / 2);
                    break;
                    
                case 'c':
                    top = (this.parent.getHeight() / 2) - (this.iconDimensionY / 2);
                    break
            }
            
            // Figure out X position
            switch (posX) {
                case 'l':
                    left = -1 * (this.iconDimensionX / 2);
                    break;
                    
                case 'r':
                    left = this.parent.getWidth() - (this.iconDimensionX / 2);
                    break;
                    
                case 'c':
                    left = (this.parent.getWidth() / 2) - (this.iconDimensionX / 2);
                    break
            }
            
            // Set the Element with the new positions, adding custom x and y offsets
            this.iconEl.setLeft(left + this.getXOffset());
            this.iconEl.setTop(top + this.getYOffset());
            
        }
    }
});
