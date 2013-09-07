Ext.define('Ext.ux.TouchCalendarNepaliUtil', {
    
    singleton: true,

    alternateClassName: 'NepaliCalendarUtil',

    requires: [
        'Ext.Date',
        'Ext.util.HashMap'
    ],

    constructor: function(config) {
         this.initConfig(config);
         this.populateNepaliCalData();
    },



    config: {
    	
    	nepaliMonths : ['बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'],

        nepaliWeekDays: ['सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि', 'आइत'],

        nepaliTithiStr : [
            'औंसी', 'प्रतिपदा', 'द्वितीया', 'तृतिया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी',
            'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
        ],

        nepaliNumbers : ['०','१', '२', '३', '४', '५', '६', '७', '८', '९'],

        nepaliCalData: null,

        recentLookup: null,
        
        loadingData : false,
        
        remoteDataMap: new Ext.util.HashMap(),
    },

    getNepaliDayOfWeek: function(date) {
        var day = Ext.Date.format(date, "N");
        return this.getNepaliWeekDays()[day-1];
    },

    getNepaliDate: function(date) {
        var nepVals = this.getNepaliMonthValuesInUTC(date);
        if (nepVals != null) {
            return this.convertToNepaliNumber(nepVals.nepaliDate);
        }
        return "";
    },

    getNepaliTithi: function(date) {
        var nepVals = this.getNepaliMonthValuesInUTC(date);
        if (nepVals != null) {
            var nepaliDate = nepVals.nepaliDate,
                nepaliMonth = nepVals.month,
                nepaliYear = nepVals.year,
                tithiMap = this.getNepaliCalData()[nepaliYear + ""].tithi;
                 
            if ((tithiMap != undefined) && ((tithiMap[nepaliMonth + ""]) != undefined))  {
                if (((tithiMap[nepaliMonth + ""][parseInt(nepaliDate) - 1]) != undefined)) {
                    return this.getNepaliTithiStr()[tithiMap[nepaliMonth + ""][parseInt(nepaliDate) - 1]];
                }
            }
        }
        return "";
    },

    getFirstParva: function(date) {
        var nepVals = this.getNepaliMonthValuesInUTC(date);
        if (nepVals != null) {
            var nepaliDate = nepVals.nepaliDate,
                nepaliMonth = nepVals.month,
                nepaliYear = nepVals.year,
                parvaMap = this.getNepaliCalData()[nepaliYear + ""].parva;
            
            /*     
            if ((parvaMap != undefined) && ((parvaMap[nepaliMonth + ""]) != undefined) && ((parvaMap[nepaliMonth + ""][nepaliDate + ""]) != undefined))  {
                return parvaMap[nepaliMonth + ""][nepaliDate][0];
            }
            */
              
            if ((parvaMap != undefined) && ((parvaMap[nepaliMonth + "-" + nepaliDate]) != undefined))  {
                return parvaMap[nepaliMonth + "-" + nepaliDate][1];
            }
        }
        return "";
    },

    getSecondParva: function(date) {
        var nepVals = this.getNepaliMonthValuesInUTC(date);
        if (nepVals != null) {
            var nepaliDate = nepVals.nepaliDate,
                nepaliMonth = nepVals.month,
                nepaliYear = nepVals.year,
                parvaMap = this.getNepaliCalData()[nepaliYear + ""].parva;
            
            /*     
            if ((parvaMap != undefined) && ((parvaMap[nepaliMonth + ""]) != undefined) && ((parvaMap[nepaliMonth + ""][nepaliDate + ""]) != undefined))  {
                return parvaMap[nepaliMonth + ""][nepaliDate][1];
            }
            */
            
            if ((parvaMap != undefined) && ((parvaMap[nepaliMonth + "-" + nepaliDate]) != undefined))  {
                return (parvaMap[nepaliMonth + "-" + nepaliDate][2] != undefined ? parvaMap[nepaliMonth + "-" + nepaliDate][2] : "");
            }
        }
        return "";
    },

    isHoliday: function(date) {
        var nepVals = this.getNepaliMonthValuesInUTC(date);
        if (nepVals != null) {
            var nepaliDate = nepVals.nepaliDate,
                nepaliMonth = nepVals.month,
                nepaliYear = nepVals.year,
                parvaMap = this.getNepaliCalData()[nepaliYear + ""].parva;
            
            /*     
            if ((parvaMap != undefined) && ((parvaMap[nepaliMonth + ""]) != undefined) && ((parvaMap[nepaliMonth + ""][nepaliDate + ""]) != undefined))  {
                return (parvaMap[nepaliMonth + ""][nepaliDate + ""][2] == "true");
            }
            */
           
           if ((parvaMap != undefined) && ((parvaMap[nepaliMonth + "-" + nepaliDate]) != undefined))  {
           		return (parvaMap[nepaliMonth + "-" + nepaliDate][0]);
            }
        }
        return false;
    },

    isWeekend: function(date) {
        var day = Ext.Date.format(date, "N");
        return (day == 6);
    },

    getNepaliMonthValuesInUTC: function (date) {
        // Return if date matches the one in cache
        if (this.getRecentLookup() != null) {
            var cachedDate = this.getRecentLookup().date;
            if (Ext.Date.diff(cachedDate, Ext.Date.clearTime(date), Ext.Date.DAY) == 0) {
                return this.getRecentLookup().nepaliVals;
            }
        }

        // Get UTC year and add 57 to it to calculate nepali year based on first day of year for this date
        var year = parseInt(Ext.Date.format(date, 'Y')) + 57;
        // TBD - have to assume one year data exists
        if (Ext.Date.diff(this.getNepaliCalData()[year + ""].utcYrStartDate, Ext.Date.clearTime(date), Ext.Date.DAY) < 0) {
            // Date is 56 years ahead instead of 57
            year--;
        }
        
        // Load data from remote if needed, send bogus data for now, will be refreshed once right data is loaded
        if (this.getNepaliCalData()[year + ""] == null) {
        	if (!this.getLoadingData() && (this.getRemoteDataMap().get(year+"") == null)) {
        		this.getRemoteDataMap().replace(year+"", "tried_loading");
        		this.fetchDataFromStorage(year);
        		Ext.Msg.alert('Ooopss !!!', 'Data for year [' + year + '] needs to be updated. If you are not connected to internet, please launch app once again when you are connected...', Ext.emptyFn);
        	}
        } else {
        	if (((this.getNepaliCalData()[year + ""].parva == null) || (this.getNepaliCalData()[year + ""].tithi == null)) && (this.getRemoteDataMap().get(year+"") == null) && !this.getLoadingData()) {
            	this.getRemoteDataMap().replace(year+"", "tried_loading");
            	this.fetchDataFromStorage(year);
            	//Ext.Msg.alert('Data Unavailable !!!', 'Detailed data of days for year [' + year + '] will be updated in background if available...', Ext.emptyFn);
            }
	        var nepaliMonthsDays = this.getNepaliCalData()[year + ""].days,
	            nepaliMonths = this.getNepaliMonths(),
	            nepaliYear = year,
	            utcYrStartDate = this.getNepaliCalData()[year + ""].utcYrStartDate,
	            // TODO - Verify +1 code
	            diff = Ext.Date.diff(utcYrStartDate, Ext.Date.clearTime(date), Ext.Date.DAY) + 1;
	
	        if (diff > 0 && diff < 369) {
	            var month = 1,
	                advCounter = 0,
	                prevCounter = 0;
	            
	            // Figure out which Nepali month date falls in
	            for (i=0; i<12; i++) {
	                advCounter += nepaliMonthsDays[i];
	                if (advCounter >= diff) {
	                    break;
	                } else {
	                    month++;
	                    prevCounter += nepaliMonthsDays[i];
	                }
	            }
	
	            // Calculate start and end of that nepali month
	            var startDate = Ext.Date.add(utcYrStartDate, Ext.Date.DAY, prevCounter),
	                endDate = Ext.Date.add(utcYrStartDate, Ext.Date.DAY, advCounter > 0 ? advCounter - 1 : advCounter),
	                // TODO - Verify +1 code
	                nepaliDate = Ext.Date.diff(startDate, Ext.Date.clearTime(date), Ext.Date.DAY) + 1;
	
	            //console.log(Ext.Date.format(startDate, "Y-m-d") + " : " + Ext.Date.format(date, "Y-m-d") + " : " + nepaliDate);
	
	            var nepaliVals = {
	                startDate: startDate,
	                endDate: endDate,
	                nepaliDate: nepaliDate,
	                month: month,
	                monthName: nepaliMonths[month-1],
	                year: nepaliYear,
	                days: nepaliMonthsDays[month-1],
	            };
	
	            //Cache and return value
	            this.setRecentLookup({date: Ext.Date.clearTime(date), nepaliVals: nepaliVals});
	
	            return nepaliVals;
	        } 
        }
        Ext.Logger.warn("Date calculation error");
        var bogusData = this.getNepaliMonthValuesInUTC(Ext.Date.parse("2013-04-15", "Y-m-d"));
        bogusData.year = year;
        return bogusData;
    },

    convertToNepaliNumber: function(num) {
        if (isNaN(num)) {
            return "";
        } else {
            var numStr = (num + "").trim();
            var numNep = "";
            for (var i = 0; i < numStr.length; i++) {
                numNep += "" + this.getNepaliNumbers()[parseInt(numStr.charAt(i))];
            }
            return numNep;
        }
    },
    
    getFooterItem2: function(date) {
    	var nepaliVals = NepaliCalendarUtil.getNepaliMonthValuesInUTC(date),
            firstParva = NepaliCalendarUtil.getFirstParva(date),
            secondParva = NepaliCalendarUtil.getSecondParva(date),
            isHoliday = NepaliCalendarUtil.isHoliday(date),
            isWeekend = NepaliCalendarUtil.isWeekend(date),
            comma = false,
            str = "";
		
        if (firstParva != "") {
            str = firstParva;
            comma = true;
        }
        if (secondParva != "") {
            str += comma ? ", " + secondParva : secondParva;
        }
        if (str == "") {
        	str = '<br/>'
        }
        return str;
   },

    fetchDataFromStorage: function(year) {
    	if (this.getLoadingData()) {
    		return;
    	}
    	
    	this.setLoadingData(true);
    	
    	var yearData = Ext.create('JsonCacheUtil', {
 			refreshInterval: 11*30*24*60, //Configurations.getCalendarRefreshRate(),
 			baseName: 'calendarYear' + year + 'Data',
 			jsonIdProperty: 'data',
    		jsonRootProperty: '',
    		proxyUrl: 'resources/images/' + year + '.json' //Configurations.getCalendarDataBaseUrl() + year + '.json'
 		});
    	yearData.on({
 			jsonRefresh: function(store, data, cache, success) {
 				if (this.getNepaliCalData()[year] == null) {
 					this.getNepaliCalData()[year] = new Object();
 				}
 				// populate year's data if available
 				if (data != null) {
	 				if (data.days != null) {
						this.getNepaliCalData()[year].days = data.days;
					}
					if (data.utcYrStartDate != null) {
						this.getNepaliCalData()[year].utcYrStartDate = data.utcYrStartDate;
					}
					if (data.parva != null) {
						this.getNepaliCalData()[year].parva = data.parva;
					}
					if (data.tithi != null) {
						this.getNepaliCalData()[year].tithi = data.tithi;
					}
 				}
				this.setLoadingData(false);
 			},
 			scope: this 			
 		});
    	yearData.refreshJsonData();
    },
    
    populateNepaliCalData: function() {
        var nepaliCalData = 
            {
                2060: {
                    // Number of days in every month
                    days: [31,31,32,32,31,30,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2003-04-14", "Y-m-d"),       
                },
                
                2061: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,29,30,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2004-04-13", "Y-m-d"),       
                },

                2062: {
                    // Number of days in every month
                    days: [30,32,31,32,31,31,29,30,29,30,29,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2005-04-14", "Y-m-d"),       
                },

                2063: {
                    // Number of days in every month
                    days: [31,31,32,31,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2006-04-14", "Y-m-d"),       
                },

                2064: {
                    // Number of days in every month
                    days: [31,31,32,32,31,30,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2007-04-14", "Y-m-d"),       
                },

                2065: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,29,30,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2008-04-13", "Y-m-d"),       
                },

                2066: {
                    // Number of days in every month
                    days: [31,31,31,32,31,31,29,30,30,29,29,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2009-04-14", "Y-m-d"),       
                },

                2067: {
                    // Number of days in every month
                    days: [31,31,32,31,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2010-04-14", "Y-m-d"),       
                },

                2068: {
                    // Number of days in every month
                    days: [31,31,32,32,31,30,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2011-04-14", "Y-m-d"),       
                },

                2069: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,29,30,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2012-04-13", "Y-m-d"),       
                },

                2070: {
                    // Number of days in every month
                    days: [31,31,31,32,31,31,29,30,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2013-04-14", "Y-m-d"),
                    
                    // Parva based on month and day - first parva, second parva and isHoliday 
                    parva: {	
					   "1-1": [true,"नयाँ वर्ष"],
					   "1-5": [false,"चैते दशैं"],
					   "1-6": [true,"राम नवमी"],
					   "1-9": [false,"एकादशी ब्रत"],
					   "1-10": [false,"महाबिर जयन्ती","भौम प्रदोष"],
					   "1-11": [true,"लोकतन्त्र दिवस"],
					   "1-12": [false,"हनुमान जयन्ती","पूर्णिमा ब्रत"],
					   "1-16": [false,"सकस्ट चतुर्थी"],
					   "1-18": [true,"श्रमिक दिवश"],
					   "1-20": [false,"प्रेस दिवस"],
					   "1-24": [false,"समाजसुधार दिवस"],
					   "1-26": [false,"आमाको मुख हेर्ने"],
					   "1-29": [false,"पर्शुराम जयन्ती"],
					   "1-30": [false,"अक्षय तृतीया"],
					   "1-31": [false,"मङ्गल चतुर्थी"],
					   "2-1": [false,"शंकराचार्य जयन्ती"],
					   "2-2": [false,"रामानुजार्य जयन्ती"],
					   "2-3": [false,"दुरसंचार दिवस"],
					   "2-5": [false,"सिता जयन्ती"],
					   "2-7": [false,"मोहनी एकादशी"],
					   "2-9": [false,"नृसिंह जयन्ती"],
					   "2-10": [false,"कुर्म जयन्ती"],
					   "2-11": [true,"बुद्द जयन्ती","चण्डी पुर्णिमा"],
					   "2-15": [true,"गणतन्त्र दिवस"],
					   "2-17": [false,"ध्रुमपान रहित दिवस"],
					   "2-18": [false,"गोरखकाली पुजा"],
					   "2-21": [false,"अपर एकादशी"],
					   "2-22": [false,"वाताबरण दिवस"],
					   "2-23": [false,"सिठीचहे पुजा"],
					   "2-31": [false,"सिठी नख:"],
					   "3-1": [false,"आषाढ संग्रान्ति","कुमार यात्रा"],
					   "3-4": [false,"रामेश्वर पुजा","गंगा पुजा"],
					   "3-6": [false,"सरणार्थी दिवस"],
					   "3-7": [false,"संगीत दिवस"],
					   "3-9": [false,"गंडू पूजा","मन्वादी"],
					   "3-11": [false,"भूमि पूजा"],
					   "3-15": [false,"दहि चिउरा खाने दिन"],
					   "3-16": [false,"गोरखकाली पुजा"],
					   "3-19": [false,"योगिनी एकादशी"],
					   "3-22": [false,"दिल्लापुन्ही"],
					   "3-24": [false,"सोमबारे औसी"],
					   "3-29": [false,"भानु जयन्ती"],
					   "3-31": [false,"सुर्य पूजा"],
					   "4-1": [false,"साउने संक्रान्ति","भिमाष्ठमी व्रत"],
					   "4-4": [false,"हरिशयनी एकादशी"],
					   "4-7": [false,"गुरु पूर्णिमा","गुरुब्यास पूजा"],
					   "4-12": [false,"जनसंख्या दिवस"],
					   "4-15": [false,"गोरखकाली पूजा","खिर खाने दिन"],
					   "4-18": [false,"कामीका एकादशी"],
					   "4-21": [false,"गठामुग","घण्टाकर्ण"],
					   "4-22": [false,"दर्शश्राद्धम"],
					   "4-25": [false,"आदिबासी दिवस","बराह जयन्ती"],
					   "4-28": [false,"युवा दिवस","कल्की जयन्ती"],
					   "4-30": [false,"गोरखकाली पुजा","यलपन्चदान"],
					   "5-1": [false,"भाद्र संग्रान्ति","थारु गुरिया पर्ब"],
					   "5-5": [false,"जनै पुर्णिमा","रक्षाबन्धन"],
					   "5-6": [true,"गाईजात्रा"],
					   "5-12": [true,"श्रीकृष्ण जन्माष्टमी","गौरा पर्ब"],
					   "5-13": [false,"हिले जात्रा","श्रीकृष्ण रथयात्रा"],
					   "5-16": [false,"अजा एकादशी"],
					   "5-17": [false,"सोम प्रदोष"],
					   "5-20": [false,"बाबुको मुख हेर्ने", "कुशे औसी"],
					   "5-22": [true,"दर खाने"],
					   "5-23": [false,"तिज ब्रत"],
					   "5-24": [false,"गणेश चतुर्थी"],
					   "5-25": [false,"ऋषी पंचमी"],
					   "5-28": [false,"गोरखकाली पूजा","अदु:ख नवमी"],
					   "5-29": [false,"बाल दिवस"],
					   "6-1": [false,"बिस्वकर्मा पूजा","असोज संग्रान्ति"],
					   "6-2": [true,"ईन्द्रजात्रा"],
					   "6-4": [false,"श्रोह्रश्राद्ध शुरु","पंचलीभुजा"],
					   "6-5": [false,"शान्ती दिवस"],
					   "6-11": [false,"जितिया पर्ब","पर्यटन दिवस"],
					   "6-18": [false,"दर्शाश्रद्धाम"],
					   "6-19": [true,"घटस्थापना","नवरात्र प्रारम्भ"],
					   "6-24": [false,"हुलाक दिवस"],
					   "6-25": [true,"फूलपाती"],
					   "6-26": [true,"महाअष्टमी"],
					   "6-27": [true,"महानवमी"],
					   "6-28": [true,"बिजया दशमी"],
					   "6-29": [true,"पापाङ्कुशा एकादशी","सामीण महिला दिवस"],
					   "6-30": [false,"खाद्य दिवस"],
					   "7-1": [true,"कोजाग्रत पुर्णिमा"," कार्तिक संग्रान्ति"],
					   "7-7": [false,"राष्ट्रसंघ दिवस"],
					   "7-10": [false,"गोरखकाली पूजा"],
					   "7-15": [false,"काग तिहार","यमपंचकराम्भ"],
					   "7-16": [false,"कुकुर तिहार"],
					   "7-17": [true,"लक्ष्मी पूजा","लक्ष्मीप्रसाद देबकोटा जयन्ती"],
					   "7-18": [true,"गोबर्धन पूजा","मह: पूजा","नेपाल सम्बत् 1134 प्रारम्भ"],
					   "7-19": [true,"भाई टिका"],
					   "7-23": [true,"छट पर्ब"],
					   "7-25": [false,"फाल्गुनान्द जयन्ती","सत्ययुगादी"],
					   "7-28": [false,"मधुमेह दिवस"],
					   "8-1": [true,"मार्ग संङक्रान्ती"],
					   "8-2": [false,"विद्यार्थी दिवस","गुरु नानक जयन्ती"],
					   "8-5": [false,"बाल अधिकार दिवस"],
					   "8-10": [false,"कालभैरव पूजा"],
					   "8-16": [false,"एड्स दिवस"],
					   "8-17": [false,"बालाचतुर्दसी","दशश्रद्धम"],
					   "8-18": [false,"अपांग दिवस"],
					   "8-20": [false,"स्वंसेवक दिवस"],
					   "8-22": [false,"बिबाह पंचमी","सिता बिबाह"],
					   "8-25": [false,"गोरखकाली पूजा"],
					   "8-26": [false,"पर्वत दिवस"],
					   "8-27": [false,"इन्द्रायणी जात्रा"],
					   "9-1": [false,"दात्तत्रती जयन्ती"],
					   "9-2": [true,"योमरी पुन्हि","किराँत पर्व","उधौली पूजा"],
					   "9-10": [true,"क्रिसमास डे"],
					   "9-15": [true,"तमुल्होछार पर्ब"],
					   "9-17": [false,"2014 प्रारम्भ"],
					   "9-18": [false,"तोल ल्होछार"],
					   "9-24": [false,"गोरखकाली पूजा"],
					   "9-27": [false,"पृथ्वी जयन्ती"],
					   "9-30": [false,"विश्व योग दिवस"],
					   "10-1": [true,"माघे संक्रान्ती","श्रीस्वस्थानी ब्रतारम्भ"],
					   "10-2": [false,"आर्य दिवस"],
					   "10-10": [false,"गोरखकाली पूजा"],
					   "10-16": [true,"शहीद दिवस"],
					   "10-17": [true,"ल्होसार पर्व","वल्लभ जयन्ती"],
					   "10-19": [false,"सिमसार दिवस"],
					   "10-21": [false,"श्रीपंचमी","सरस्वती पूजा"],
					   "10-24": [false,"भिस्मस्टमी ब्रत","गोरखकाली पूजा"],
					   "10-28": [false,"भिष्म द्वदासी"],
					   "11-2": [false,"भ्यालेन्टाईन डे","श्रीस्वस्थानी ब्रतसमाप्ती"],
					   "11-7": [true,"प्रजातन्त्र दिवस"],
					   "11-10": [false,"गोरखकाली पूजा"],
					   "11-15": [true,"महाशिवरात्री","सैनिक दिवस"],
					   "11-17": [false,"द्वापरयुगादी","दर्शश्राद्धम्"],
					   "11-18": [true,"ग्याल्पो लोसार"],
					   "11-24": [false,"नारी दिवस"],
					   "11-25": [false,"गोरखकाली पूजा"," चियोत्थान"],
					   "12-1": [false,"चैत्र संग्क्रान्ति"],
					   "12-2": [true,"फागुपूर्णीमा"],
					   "12-3": [false,"तराई होली"],
					   "12-5": [false,"मत्येंद्रनाथ रथयात्रा"],
					   "12-8": [false,"पानी दिवस"],
					   "12-16": [true,"घोडे जात्रा"],
					   "12-21": [false,"श्रीपूजा"],
					   "12-24": [false,"चैते दशैं","स्वास्थ्य दिवस"],
					   "12-25": [true,"राम नवमी"],
					   "12-30": [false,"महावीर जयन्ती"]
					},
					/*
                    parva: {
						1 : {
							1: ['नवबर्ष', '', 'true'],
							5: ["चैते दशैं ", "", 'false'],
							6: ['रामनवमी', '', 'true'],
							9: ["कामदा एकादशी", "", 'false'],
    						10: ["महाबिर जयन्ती", "", 'false'],
    						11: ["लोकतन्त्र दिवस ", "", 'true'],
    						12: ["हनुमान जयन्ती", "पूर्णिमा ब्रत", 'false'],
    						16: ["चतुर्थी ब्रत ", "", , 'false'],
    						18: ["श्रमिक दिवश", "", 'true'],
    						20: ["प्रेस दिवस", "", 'false'],
    						24: ["समाजसुधार दिवस", "", 'false'],
    						26: ["आमाको मुख हेर्ने दिन", "", 'false'],
    						29: ["पर्शुराम जयन्ती ", "", 'false'],
    						30: ["अक्षय तृतीया ", "", 'false'],
    						31: ["चतुर्थी ब्रत", "", 'false'],
						},
						2 : {
							11: ['बुद्धजयन्ती', 'चण्डी पुर्णिमा', 'true'],
							15: ['बुद्धजयन्ती', 'गणतन्त्र दिवस', 'true']
						},
                        5 : {
                            5: ['जनैपूर्णिमा', 'गाईजात्रा', 'true'],
                            12 :['श्रीकृष्ण जन्माष्टमी', 'गौरा पर्व', 'true'],
                            22: ["दर खाने ", "", 'true']
                        },
						6 : {
                            2: ['इन्द्रजात्रा', '', 'true'],
                            19 :['घटस्थापना', '', 'true'],
                            25 :['फूलपाती', '', 'true'],
    						26: ["महाअष्टमी", '', 'true'],
    						27: ["महानवमी ", '', 'true'],
    						28: ["बिजया दशमी ", '', 'true'],
    						29: ["पापाङ्कुशा एकादशी", "", 'true'],
                        },
						7 : {
                            17: ['लक्ष्मीपजा', '', 'true'],
                            18 :['गोवर्द्धन पूजा', '', 'true'],
                            19 :['भाइटीका', '', 'true'],
                            23 :['छठ', '', 'true']
                        },
						10 : {
                            1: ['माघे सङ्क्रान्ति', '', 'true']
                        },
						11 : {
							7: ["प्रजातन्त्र दिवस ", "", 'true'],
                            15: ['महाशिवरात्री', '', 'true']
                        },
						12 : {
                            2: ['फागुपूर्णिमा', '', 'true'],
                            16: ["घोडे जात्रा ", '', 'true'],
                            25: ["राम नवमी ", '', 'true']
                       }
                    },
                    */

                    // Tithi numbers based on month
                    tithi: {
						1 : [4,5,6,7,8,9,10,10,11,12,14,15,1,2,3,4,5,6,7,8,9,11,12,13,14,0,1,1,2,3,4],
                        2 : [5,6,7,8,9,10,11,12,13,14,15,1,2,4,5,6,7,8,9,10,11,12,13,14,0,1,2,3,4,5,6],
						3 : [6,7,8,10,11,12,13,14,15,1,2,3,4,5,7,8,9,10,11,12,12,13,14,0,1,2,3,4,5,6,7],
						4 : [8,9,10,11,12,14,15,1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,1,2,3,4,5,6,7,8,9,10],
						5 : [11,12,13,14,15,1,3,4,5,6,7,8,9,9,10,11,12,13,14,0,1,2,3,4,5,6,7,8,10,11,12],
						6 : [13,14,15,1,2,3,4,5,6,7,8,9,10,11,12,13,14,14,0,2,3,4,5,6,7,8,9,10,11,12,13],
						7 : [15,1,2,3,3,4,5,6,7,8,9,10,11,12,13,14,0,1,2,3,4,5,6,8,9,10,11,12,13],
						8 : [14,15,1,2,3,4,5,6,7,7,8,9,10,11,12,13,14,1,2,3,4,5,6,7,8,9,10,11,12,13],
						9 : [14,15,1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,1,2,3,4,6,7,8,9,10,11,12,13,14],
						10 : [14,15,1,2,3,4,5,6,7,8,9,10,11,12,13,0,1,2,3,4,5,6,7,8,9,10,11,12,13],
						11 : [14,15,1,1,2,3,4,5,6,7,9,10,11,12,13,14,0,1,2,3,4,5,6,7,8,9,10,11,12,13],
						12 : [14,15,1,2,3,4,5,6,7,8,9,10,11,12,14,0,1,2,3,4,5,6,7,8,9,10,10,12,12,13]
                    },

                },

                2071: {
                    // Number of days in every month
                    days: [31,31,32,31,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2014-04-14", "Y-m-d"),       
                },

                2072: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2015-04-14", "Y-m-d"),       
                },

                2073: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,29,30,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2016-04-13", "Y-m-d"),       
                },

                2074: {
                    // Number of days in every month
                    days: [31,31,31,32,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2017-04-14", "Y-m-d"),       
                },

                2075: {
                    // Number of days in every month
                    days: [31,31,32,31,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2018-04-14", "Y-m-d"),       
                },

                2076: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2019-04-14", "Y-m-d"),       
                },

                2077: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,30,29,31],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2020-04-13", "Y-m-d"),       
                },

                2078: {
                    // Number of days in every month
                    days: [31,31,31,32,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2021-04-11", "Y-m-d"),       
                },

                2079: {
                    // Number of days in every month
                    days: [31,31,32,31,31,31,30,29,30,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2022-04-14", "Y-m-d"),       
                },

                2080: {
                    // Number of days in every month
                    days: [31,32,31,32,31,30,30,30,29,29,30,30],

                    // Start date of the year
                    utcYrStartDate: Ext.Date.parse("2023-04-14", "Y-m-d"),       
                },
            };

        this.setNepaliCalData(nepaliCalData);
    }, 
});