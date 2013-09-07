Ext.define('Haamro.custom.Configurations', {

    singleton: true,
	
	alternateClassName: 'Configurations',
	
	requires: [
	    'Ext.util.HashMap'   
	],
    
    constructor: function(config) {
        this.initConfig(config);
        
    	this.setWeatherUrls(new Ext.util.HashMap());
    	var map = this.getWeatherUrls();
    	
    	/* Remote URL */
		/* */
    	map.replace('Kathmandu', 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=v9c7zdn5uqgd2qveb7yby4s2&q=Kathmandu,Nepal&num_of_days=3&format=json');
    	map.replace('Pokhara', 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=v9c7zdn5uqgd2qveb7yby4s2&q=Pokhara,Nepal&num_of_days=3&format=json');
    	map.replace('Biratnagar', 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=v9c7zdn5uqgd2qveb7yby4s2&q=Biratnagar,Nepal&num_of_days=3&format=json');
    	map.replace('Dhankuta', 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=v9c7zdn5uqgd2qveb7yby4s2&q=Dhankuta,Nepal&num_of_days=3&format=json');
    	map.replace('Birendranagar', 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=v9c7zdn5uqgd2qveb7yby4s2&q=Surkhet,Nepal&num_of_days=3&format=json');
    	map.replace('Dipayal', 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=v9c7zdn5uqgd2qveb7yby4s2&q=Doti,Nepal&num_of_days=3&format=json');  	
    	
    	/* Local URLs for offline testing */
    	/*
    	map.replace('Kathmandu', 'resources/images/kathmandu.json');
    	map.replace('Pokhara', 'resources/images/pokhara.json');
    	map.replace('Biratnagar', 'resources/images/biratnagar.json');
    	map.replace('Dhankuta', 'resources/images/dhankuta.json');
    	map.replace('Birendranagar', 'resources/images/birendranagar.json');
    	map.replace('Dipayal', 'resources/images/dipayal.json');
    	*/
    	
    	// no have more than 15 rows in stocks grid to support portrait layout
    	//this.setStocksPageSize(Math.min(Math.floor((Ext.Viewport.getWindowHeight() - (47*3)) / 37), 15)); 
    	var height = window.innerHeight;
    	this.setStocksPageSize(Math.min(Math.floor((height - (47*3)) / 37), 15)); 
    	this.setAdjustHeight(height < 500)
    },
   
    config: {
    	
    	/*
    	 * generic configuration parameters
    	 */
    	//stocksPageSize: Ext.os.is('Phone') ? 8 : 12,
    	stocksPageSize: 9,
    	
    	adjustHeight: false, // smaller height phones (ie iPhone 4 etc)
    	
    	weatherUrls : null,
    	
    	newsBaseUrl: 'http://rss.haamro.com/json.php?id=',
    	
    	// refresh rate in minutes
    	weatherRefreshRate: 3*60, // 3 hrs to get latest weather report
    	
    	loadSheddingRefreshRate: 6*60, // 6 hrs
    	
    	currencyRefreshRate: 6*60, // 6 hrs
    	
    	financeRefreshRate: 6*60, // 6 hrs
    	
    	calendarRefreshRate: 11*30*24*60, // ~ 11 months
    	/*
    	 * local urls 
    	 */
    	//proxyType: 'ajax',
    	
    	//loadSheddingUrl: 'resources/images/load-shedding.json',
    	
    	//stocksUrl: 'resources/images/stocks.json',
    	
    	feedbackUrl: 'feedback',
    	
    	//currencyUrl: 'resources/images/currency.json',
    	
    	calendarDataBaseUrl: 'resources/images/',
    	
    	/*
    	 * remote urls
    	 */
    	
   		proxyType: 'jsonp',
    	
    	loadSheddingUrl: 'http://rss.haamro.com/loadshedding.php',
    	
    	stocksUrl: 'http://rss.haamro.com/stock.php',
    	
    	currencyUrl: 'http://rss.haamro.com/forex.php',
    	
    	financeUrl: 'http://rss.haamro.com/goldsilver.php',
    		
    	/*
    	 * other static texts
    	 */
    	disclaimerText: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><br/>' +
    		'<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p><br/>' +
    		'<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p><br/>',
    }
   
});