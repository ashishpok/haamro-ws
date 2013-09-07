Ext.define('Haamro.view.StocksCarousel', {
    extend: 'Ext.Carousel',
    
    xtype: 'stocksCarousel',

    constructor : function(config) {
        this.callParent([config]);
    },

    initialize: function() {
    	this.callParent();
        this.setIndicator(false);
    },

    config: {
    	activeItemId: 0,
    	
    	title: 'Stocks',

        iconCls: 'stocks',

        direction: 'horizontal',

        // Add one item so we can grab default vals like sstore etc.
       	items: [
    	],

        listeners: {
            painted: function(carousel) {
                this.fireEvent('stocksCarouselPainted', this);
            }
        }

    }
	
	/*
    onDragEnd: function(e) {
                if (!this.isDragging) {
            return;
        }

        this.onDrag(e);

        this.isDragging = false;

        var now = Ext.Date.now(),
            itemLength = this.itemLength,
            threshold = itemLength / 2,
            offset = this.offset,
            activeIndex = this.getActiveIndex(),
            maxIndex = this.getMaxItemIndex(),
            animationDirection = 0,
            flickDistance = offset - this.flickStartOffset,
            flickDuration = now - this.flickStartTime,
            indicator = this.getIndicator(),
            velocity;

        if (flickDuration > 0 && Math.abs(flickDistance) >= 10) {
            velocity = flickDistance / flickDuration;

            if (Math.abs(velocity) >= 1) {
                if (velocity < 0 && activeIndex < maxIndex) {
                    animationDirection = -1;
                    this.fireEvent('dragEnd', this);
                }
                else if (velocity > 0 && activeIndex > 0) {
                    animationDirection = 1;
                    this.fireEvent('dragEnd', this);
                }
                
            }
        }

        if (animationDirection === 0) {
            if (activeIndex < maxIndex && offset < -threshold) {
                animationDirection = -1;
            }
            else if (activeIndex > 0 && offset > threshold) {
                animationDirection = 1;
            }
        }

        if (indicator) {
            indicator.setActiveIndex(activeIndex - animationDirection);
        }

        this.animationDirection = animationDirection;

        this.setOffsetAnimated(animationDirection * itemLength);
        
    }
    */
 });
