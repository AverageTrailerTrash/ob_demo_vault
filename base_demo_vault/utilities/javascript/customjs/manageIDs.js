	class manageIDs {
	//  this class implements the core functionality and structure of my vault
	
	// function structure:
	// // vital notices, debug, description, dependencies, errors, vars, behavior, debug, return.
	
	// function naming convention:
	// // any function that relies on another plugin's API should have its initials as its suffix:
	// // // DV = Dataview, MM = Metadata Menu
	// // that's only required if the function doesn't already mention the API by name.
	
	// variable naming convention:
	// // likewise, any var with a unique value type derived from a plugin API should have its initials,
	// // to help minimize confused actions -- like accidentally trying to "read" a dataview file lol.
	
	// using console:
	// // console.debug for code logic, console.info for user-driven activities,
	// // console.log for notes, console.warn for possible issues (not throwable).
	
	// // // // // TO DO:::: find settings files by tag, implement oop conventions
	
	abcTest(){
		// my function!
		return "abc";
	} 
	
	
	//////////////////////// GETTING STUFF ///////////////////////////
	
	// Static Variables //
	
	getDefaultPathBase(key){
		// returns the requested static path value of base folder; these are vital to operation
		var keyValue = "";
		switch(key){
			case "utilities": keyValue = "utilities"; break;
			case "javascript": keyValue = "utilities/javascript"; break;
			case "customJS": keyValue = "utilities/javascript/customjs"; break;
			case "settings": keyValue = "utilities/settings"; break;
			case "categories_settings": keyValue = "utilities/settings/categories"; break;
			case "templates": keyValue = "utilities/templates"; break;
			case "temporary": keyValue = "utilities/temporary"; break;
			case "indexes": keyValue = "utilities/indexes"; break;
			case "categories_indexes": keyValue = "utilities/indexes/categories"; break;
			case "data": keyValue = "utilities/data"; break;
			case "classes": keyValue = "utilities/data/classes"; break;
			case "cabinet": keyValue = "cabinet"; break;
			case "categories_templates": keyValue = "utilities/templates/categories"; break;
			default: throw new Error("Incorrect key provided for retrieving base structure defaults! src: getDefaultPathBase"); break;
		}
		console.debug("getDefaultPathBase is returning: ",keyValue);
		return keyValue;
	}
	
	// Accessing Dataview Files //
	
	async getDataviewFile(path){
		// This is probably the MOST EFFICIENT option, please use it if you know the full path.
		console.debug("getDataviewFile(" + path + ") was called.");
		// This returns the dataview version of a file using its path or file name.
		const dv = DataviewAPI;
		if (path == null) { throw new Error("No path or name provided! src: getDataviewFile"); }
		var dvFile = await dv.page(path);
		if (dvFile == null) { throw new Error("Failed to retrieve dataview-type file! Path may be invalid. src: getDataviewFile"); }
		console.debug("getDataviewFile is returning: ",dvFile);
		return dvFile;
	}
	
	async getDataviewPages(source){
		const dv = DataviewAPI;
		console.log("getDataviewPages(" + source + ") was called.");
		// This functions returns dataview pages for further querying. Source (FROM) is optional but increase efficiency.
		// Non-tag source strings will be wrapped in quotes, none of that is needed on the end of other functions.
		if (source == null) { 
			console.warn("No source was provided to locate dataview-type file! The search may be slower as a result. src: getDataviewPages");
			source = "";
		} else {
			if (source.charAt(0) != "#") {
				source = this.wrapStringInQuotesDV(source);
			}
		}
		var dvFiles = await dv.pages(source);
		console.debug("getDataviewPages is returning: ",dvFiles);
		return dvFiles;
	}
	
	async getDataviewFileByID(identifier, source){
		// source is OPTIONAL but makes function MORE EFFICIENT
		// NOTE: string will be wrapped in quotes by getDataviewPages!
		// RETURNS A SINGLE FILE, THE FIRST MATCH -- IDS SHOULD BE UNIQUE.
		console.log("getDataviewFileByID(" + identifier + "," + source + ") was called.");
		// This function gets the dataview version of a file associated with an ID and folder path (OR OTHER "FROM" QUERY)
		const dv = DataviewAPI;
		if (identifier == null) { throw new Error("No ID was provided to locate dataview-type file! src: getDataviewFileByID");}
		if (source == null) { 
			console.warn("No source was provided to locate dataview-type file! The search may be slower as a result. src: getDataviewFileByID");
			source = "";
		}
		var dvFiles = await this.getDataviewPages(source);
		var dvFile = await dvFiles.where(f => f.id == identifier)[0];
		if (dvFile == null) { throw new Error("Failed to retrieve dataview-type file! Source or ID may be invalid. src: getDataviewFileByID"); }
		console.debug("getDataviewFileByID is returning: ",dvFile);
		return dvFile; 
	}  
	
	async getDataviewFileKeys2D(targetFileDV){
		console.debug("getDataviewFileKeys2D(", targetFileDV, ") was called.");
		// this returns only the frontmatter keys of the file as a 2D array, allowing you to check the number of them etc.
		// this is helpful when you're trying to get multiple keys at once and don't want to keep querying the file
		if (targetFileDV == null) { throw new Error("No dataview file provided to get the frontmatter keys from! src: getDataviewFileKeys2D"); }
		var frontmatterKeys = await targetFileDV.file.frontmatter;
		console.log("here's the frontmatter ", frontmatterKeys);
		var dvFileKeys = await Object.entries(frontmatterKeys);
		if (dvFileKeys == null) { throw new Error("Failed to retrieve keys of dataview-type file! src: getDataviewFileKeys2D"); }
		console.debug("getDataviewFileKeys2D is returning: ",dvFileKeys);
		return dvFileKeys;
	}
	
	async getDataviewFileKeys1D(targetFileDV){
		console.debug("getDataviewFileKeys1D(", targetFileDV, ") was called.");
		// this returns only the frontmatter keys of the file as a 1D array, allowing you to check the number of them etc.
		// this is helpful when you're trying to get multiple keys at once and don't want to keep querying the file
		if (targetFileDV == null) { throw new Error("No dataview file provided to get the frontmatter keys from! src: getDataviewFileKeys1D"); }
		var dvFileKeys = await getDataviewFileKeys2D.flat();
		if (dvFileKeys == null) { throw new Error("Failed to retrieve keys of dataview-type file! src: getDataviewFileKeys1D"); }
		console.debug("getDataviewFileKeys1D is returning: ",dvFileKeys);
		return dvFileKeys;
	}
	
	
	// Accessing Attributes //
	
	getMetadataValueDV(targetFileDV,key){
		// this will return as a dataview array ONLY IF THE KEY CONTAINS MORE THAN ONE VALUE -- otherwise it returns a string. So you need to check the type with Array.isArray(whatever this function returns) before using it.
		console.debug("getMetadataValueDV(",targetFileDV,"," + key + ") was called.");
		// this returns ALL values of a given metadata entry from a given dataview file
		if (targetFileDV == null) { throw new Error("No dataview file provided to get metadata value from! src: getMetadataValueDV"); }
		if (key == null) { throw new Error("No key provided to retrieve metadata value from! src: getMetadataValueDV"); }
		// note: below is equivalent to var metadataValue = targetFile.key, except key can be var here.
		var metadataValueDV = targetFileDV[key];
		if (metadataValueDV == null) { console.warn("Failed to retrieve metadata value! File may be incorrect or file may not have this metadata item. src: getMetadataValueDV"); }
		console.debug("getMetadataValueDV is returning: ",metadataValueDV);
		return metadataValueDV;
	}
	
	async getFirstMetadataValueDV(targetFileDV,key){
		console.debug("getFirstMetadataValueDV(",targetFileDV,"," + key + ") was called.");
		// this returns the FIRST value of a given metadata entry from a given dataview file AS A STRING
		if (targetFileDV == null) { throw new Error("No dataview file provided to get metadata value from! src: getFirstMetadataValueDV"); }
		if (key == null) { throw new Error("No key provided to retrieve metadata value from! src: getFirstMetadataValueDV"); }
		var metadataValueDV = await this.getMetadataValueDV(targetFileDV, key);
		if (metadataValueDV == null) { console.warn("Failed to retrieve metadata value! File may be incorrect or file may not have this metadata item. src: getFirstMetadataValueDV"); }
		if (Array.isArray(metadataValueDV)){
			var metadataValue = metadataValueDV[0];
		} else {
			var metadataValue = metadataValueDV;
		}
		
		console.debug("getFirstMetadataValueDV is returning: ",metadataValue);
		return metadataValue;
	}
	
	getKeyValFromArray(givenArray, givenKey){
		// array must be in format [key, value, key, value] OR a multi-dimensional format that flattens to it.
		console.debug("getKeyValFromArray(" + givenArray + ", " + givenKey + ") was called.");
		// returns the key's value(s) AS AN ARRAY, must use [0] to get single value
		if (givenArray == null) { throw new Error("No array was provided to pull values from! src: getKeyValFromArrayDV"); }
		if (givenKey == null) { throw new Error("No key was provided to get the value of! src: getKeyValFromArrayDV"); }
		givenArray = givenArray.flat();
		var outputArray = new Array();
		var i=0; while (i<givenArray.length){
			if (givenArray[i].toLowerCase() == givenKey.toLowerCase()){
				outputArray.push(givenArray[i+1]);
			}
			i = i + 2;
		}
		if (outputArray.length == 0) {
			outputArray = null;
			console.warn("The given key was not found in this array! Key may be incorrect or array may be misconfigured. src: getKeyValFromArrayDV"); 
		}
		console.debug("getKeyValFromArray is returning: ",outputArray);
		return outputArray;
	}
	
		
	// Accessing Setting Files // 
	
	concatSettingsID(whichAuthor,whichConfig){
		console.debug("concatSettingsID(" + whichAuthor + ", " + whichConfig + ") was called.");
		if (whichAuthor == null) { throw new Error("No settings author provided! src: concatSettingsID"); }
		if (whichConfig == null) { throw new Error("No settings file specified! src: concatSettingsID"); }
		var settingsID = "settings_" + whichAuthor + "_" + whichConfig;
		console.debug("concatSettingsID is returning: ",settingsID);
		return settingsID;
	}
	
	async getCatListSettingsFileDV() {
		console.debug("getCatListSettingsFileDV() was called.");
		var catListFileDV = await this.getSettingsHolFileDV("categories");
		console.debug("getCatListSettingsFileDV is returning: ",catListFileDV);
		return catListFileDV;
	}
	
	async getCatListDV(){
		console.debug("getCatListDV() was called.");
		// this returns a dataview array of the current categories in the vault
		var catFileDV = await this.getCatListSettingsFileDV();
		if (catFileDV == null || catFileDV == "") { throw new Error("Failed to retrieve 'categories' setting file! File may have been deleted or had its ID changed. src: getCatListDV"); }
		var catListDV = await this.getMetadataValueDV(catFileDV,"category");
		if (catListDV == null) { console.warn("No categories were found! 'Categories' setting file may be misconfigured. src: getCatListDV"); }
		console.debug("getCatListDV is returning: ",catListDV);
		return catListDV;
	}
	
	async getCatSettingsFileDV(cat){
		console.debug("getCatSettingsFileDV(" + cat + ")" + " was called.");
		// this returns a dataview type file containing the settings for the given category
		if (cat == null) { throw new Error("No category was provided! src: getCatSettingsFileDV"); }
		var catSettingID = await this.concatCatSettingsID(cat);
		var catSettingsFolderPath = this.getDefaultPathBase("categories_settings");
		var catFile = await this.getDataviewFileByID(catSettingID,catSettingsFolderPath);
		console.debug("getCatSettingsFileDV is returning: ",catFile);
		return catFile;
	}
	
	concatCatSettingsID(cat){
		console.debug("concatCatSettingsID(" + cat + ")" + " was called.");
		// this returns the correct naming convention for the given category setting file's ID
		// it exists as its own function for ease of future refactoring
		if (cat == null) { throw new Error("No category was provided! src: concatCatSettingsID"); }
		var catSettings = cat + "_settings";
		console.debug("concatCatSettingsID is returning: ",catSettings);
		return catSettings;
	}
	
	concatCatSettingsName(cat){
		console.debug("concatCatSettingsID(" + cat + ")" + " was called.");
		// this returns the correct naming convention for the given category setting file's name
		// it exists as its own function for ease of future refactoring
		if (cat == null) { throw new Error("No category was provided! src: concatCatSettingsName"); }
		var catSettings = cat + "_settings";
		console.debug("concatCatSettingsName is returning: ",catSettings);
		return catSettings;
	}
	
	concatCatSettingsTag(cat){
		console.debug("concatCatSettingsTag(" + cat + ")" + " was called.");
		// this returns the correct naming convention for the given category setting file's ID
		// it exists as its own function for ease of future refactoring
		if (cat == null) { throw new Error("No category was provided! src: concatCatSettingsTag"); }
		var catSettingsTag = "settings/category/" + cat;
		console.debug("concatCatSettingsTag is returning: ",catSettingsTag);
		return catSettingsTag;
	}
	
	concatCatIndex(cat){
		console.debug("concatCatIndex(" + cat + ")" + " was called.");
		// This function exists in casewe want to change the way files are named in the future.
		// It returns the proper format for the default category index file.
		if (cat == null) { throw new Error("No category was provided! src: concatCatIndex"); }
		var catIndex = cat + "_index.md";
		console.debug("concatCatIndex is returning: ",catIndex);
		return catIndex;
	} 
	
	concatCatTemplate(cat){
		console.debug("concatCatTemplate(" + cat + ")" + " was called.");
		// This function exists in case we want to change the way files are named in the future.
		// It returns the proper format for the default category template file.
		if (cat == null) { throw new Error("No category was provided! src: concatCatTemplate"); }
		var catTemplate = cat + "_template.md";
		console.debug("concatCatTemplate is returning: ",catTemplate);
		return catTemplate;
	}
	
		
	// Accessing Category Information //
	
	async doesCatExistDV(cat){
		console.debug("doesCategoryExistDV(" + cat + ") was called.");
		// this returns a true or false response based on whether the category is in the list
		if (cat == null) { throw new Error("No category was provided! src: doesCatExistDV"); }
		var catListDV = await this.getCatListDV();
		if (catListDV == null) { console.warn("No categories were found! 'Categories' setting file may be misconfigured. src: doesCatExistDV"); }
		var catPresence = false;
		if (catListDV.includes(cat)) {catPresence = true;}
		console.debug("doesCatExistDV is returning: ",catPresence);
		return catPresence;
	}
		
	async getCatSettingDV(cat,setting){
		// first underscore after cat is added by the code! do not send!
		console.debug("getCatSettingDV(" + cat + ", " + setting + ") was called.");
		// this returns all values of a given setting from the given category, multiple entries will return an array! 
		if (cat == null) { throw new Error("No category was provided! src: getCatSettingDV"); }
		if (setting == null) { throw new Error("No setting attribute was provided! src: getCatSettingDV"); }
		var catFileDV = await this.getCatSettingsFileDV(cat);
		if (catFileDV == null) { throw new Error("Failed to retrieve the settings file for this category! File may have been deleted or had its ID changed. src: getCatSettingDV"); }
		var catAttribute = await this.getMetadataValueDV(catFileDV,setting); 
		if (catAttribute == null) { console.warn("Failed to retrieve category attribute! The setting file for this category may be misconfigured or missing information. src: getCatSettingDV"); }
		console.debug("getCatSettingDV is returning: ",catAttribute);
		return catAttribute;
	}
		
	async getFirstCatSettingDV(cat,setting){
		// first underscore after cat is added by the code! do not send!
		console.debug("getFirstCatSettingDV(" + cat + ", " + setting + ") was called.");
		// this returns the first value of a given setting from the given category as a string
		if (cat == null) { throw new Error("No category was provided! src: getFirstCatSettingDV"); }
		if (setting == null) { throw new Error("No setting attribute was provided! src: getFirstCatSettingDV"); }
		var firstAttribute = await this.getCatSettingDV(cat, setting);
		if (Array.isArray(firstAttribute)){	firstAttribute = firstAttribute[0]; }
		console.debug("getFirstCatSettingDV is returning: ",firstAttribute);
		return firstAttribute;
	}	
	

	
	// // Accessing Category Information: convenience functions // //
	
	async getCatFolderPathDV(cat){
		console.debug("getCatFolderPathDV(" + cat + ") was called.");
		// this returns the default path string of the current cat
		if (cat == null) { throw new Error("No category was provided! src: getCatFolderPathDV"); }
		var catFolderPath = await this.getFirstCatSettingDV(cat,"s_folder");
		if (catFolderPath == null) { console.warn("Failed to retrieve category folder path! 'categories' setting file may be misconfigured or missing information. src: getCatFolderPathDV"); }
		console.debug("getCatFolderPathDV is returning: ",catFolderPath);
		return catFolderPath;
	}
	
	async getCatNameDV(cat){
		console.debug("getCatNameDV(" + cat + ") was called.");
		// this returns the descriptive name string of the given cat
		if (cat == null) { throw new Error("No category was provided! src: getCatNameDV"); }
		var catName = await this.getFirstCatSettingDV(cat,"s_name");
		if (catName == null) { console.warn("Failed to retrieve category name! 'categories' setting file may be misconfigured or missing information. src: getCatNameDV"); }
		console.debug("getCatNameDV is returning: ",catName);
		return catName;
	}
	
	async getCatDescriptionDV(cat){
		console.debug("getCatDescriptionDV(" + cat + ") was called.");
		// this returns the description string of the given cat
		if (cat == null) { throw new Error("No category was provided! src: getCatDescriptionDV"); }
		var catFolderPath = await this.getFirstCatSettingDV(cat,"s_description");
		if (catFolderPath == null) { console.warn("Failed to retrieve category description! 'categories' setting file may be misconfigured. src: getCatDescriptionDV"); }
		console.debug("getCatDescriptionDV is returning: ",catFolderPath);
		return catFolderPath;
	}
	
	async getCatTagDV(cat){
		console.debug("getCatTagDV(" + cat + ") was called.");
		// this returns the tag string of the given cat
		if (cat == null) { throw new Error("No category was provided! src: getCatTagDV"); }
		var catTag = await this.getFirstCatSettingDV(cat,"s_tag");
		if (catTag == null) { console.warn("Failed to retrieve category tag! 'categories' setting file may be misconfigured. src: getCatTagDV"); }
		console.debug("getCatTagDV is returning: ",catTag);
		return catTag;
	}
	
	async getCatTemplateDV(cat){
		console.debug("getCatTemplateDV(" + cat + ") was called.");
		// this returns the template string of the given cat
		if (cat == null) { throw new Error("No category was provided! src: getCatTemplateDV"); }
		var catTemplate = await this.getFirstCatSettingDV(cat,"s_template");
		if (catTemplate == null) { console.warn("Failed to retrieve category template! 'categories' setting file may be misconfigured. src: getCatTemplateDV"); }
		console.debug("getCatTemplateDV is returning: ",catTemplate);
		return catTemplate;
	}
	
	async getCatIndexDV(cat){
		console.debug("getCatIndexDV(" + cat + ") was called.");
		// this returns the template path string of the given cat
		if (cat == null) { throw new Error("No category was provided! src: getCatIndexDV"); }
		var catIndex = await this.getFirstCatSettingDV(cat,"s_index");
		if (catIndex == null) { console.warn("Failed to retrieve category index! 'categories' setting file may be misconfigured. src: getCatIndexDV"); }
		console.debug("getCatIndexDV is returning: ",catIndex);
		return catIndex;
	}
	
	async getCatParentDV(cat){
		console.debug("getCatParentDV(" + cat + ") was called.");
		// this returns the template path string of the given cat
		if (cat == null) { throw new Error("No category was provided! src: getCatParentDV"); }
		var catParent = await this.getFirstCatSettingDV(cat,"s_parent");
		if (catParent == null) { console.warn("Failed to retrieve category parent! 'categories' setting file may be misconfigured. src: getCatParentDV"); }
		console.debug("getCatParentDV is returning: ",catParent);
		return catParent;
	}
	
	async getCatSettingsAsArrayDV(cat){
		console.debug("getCatSettingsAsArrayDV(" + cat + ") was called.");
		// this returns a 2D array of all keys from the given cat's setting file; use .flat() on returned value for 1D
		if (cat == null) { throw new Error("No category was provided! src: getCatSettingsAsArrayDV"); }
		var catFileDV = await this.getCatSettingsFileDV(cat);
		if (catFileDV == null) { throw new Error("Failed to retrieve the settings file for this category! File may have been deleted or had its ID changed. src: getCatSettingsAsArrayDV"); }
		var catSettingsArray = await this.getDataviewFileKeys2D(catFileDV);
		console.debug("getCatSettingsAsArrayDV is returning: ",catSettingsArray);
		return catSettingsArray;
	}
	
	// Accesssing Other Settings Files //
	
	async getSettingsFileDV(whichAuthor, whichConfig) {
		console.debug("getSettingsFileDV(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns dataview version of the specificed config file. 
		// this is necessary to get the values efficiently when in metadata format.
		// source format will be config_whichAuthor_whichConfig
		if (whichAuthor == null) { throw new Error("No config author provided! src: getSettingsFileDV"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getSettingsFileDV"); }
		var settingsID = await this.concatSettingsID(whichAuthor,whichConfig);
		var thisConfigFile = await this.getDataviewFileByID(settingsID,"#settings");
		console.debug("getSettingsFileDV is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	async getSettingsHolFileDV(whichConfig) {
		console.debug("getSettingsHolFileDV(" + whichConfig + ") was called.");
		// returns dataview version of the specified config file by author hol (me)
		if (whichConfig == null) { throw new Error("No settings file specified! src: getSettingsHolFileDV"); }
		var thisConfigFile = await this.getSettingsFileDV("hol", whichConfig);
		console.debug("getSettingsHolFileDV is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	// // hol settings convenience functions // //
	
	async getSettingsHolDefaultsFileDV() {
		console.debug("getSettingsHolDefaultsFileDV() was called.");
		// returns dataview version of the main settings file with the default values
		var thisConfigFile = await this.getSettingsHolFileDV("defaults");
		console.debug("getSettingsHolDefaultsFileDV is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	async getIdentifierDV(){
		console.debug("getIdentifierDV() was called.");
		// returns the string value of the identifier key as set in the config
		var defaultSettingsFileDV = await this.getSettingsHolDefaultsFileDV();
		var defaultID = defaultSettingsFileDV.identifier;
		console.debug("getIdentifierDV is returning: ",defaultID);
		return defaultID;
	}
	
	async getCatLengthDV(){
		console.debug("getCatLengthDV() was called.");
		// returns the string value of the identifier key as set in the config
		var defaultSettingsFileDV = await this.getSettingsHolDefaultsFileDV();
		var defaultID = defaultSettingsFileDV.category_length;
		console.debug("getCatLengthDV is returning: ",defaultID);
		return defaultID;
	}
	
	async getStartingIDNumDV(){
		console.debug("getStartingIDNumDV() was called.");
		// returns the string value of the identifier key as set in the config
		var defaultSettingsFileDV = await this.getSettingsHolDefaultsFileDV();
		var defaultID = defaultSettingsFileDV.starting_idnum;
		console.debug("getStartingIDNumDV is returning: ",defaultID);
		return defaultID;
	}
	
	async getBlindIDsDV(){
		console.debug("getBlindIDsDV() was called.");
		// returns the string value of the identifier key as set in the config
		var defaultSettingsFileDV = await this.getSettingsHolDefaultsFileDV();
		var defaultID = defaultSettingsFileDV.blind_ids;
		console.debug("getBlindIDsDV is returning: ",defaultID);
		return defaultID;
	}
	
	async getAppendIDDV(){
		console.debug("getAppendIDDV() was called.");
		// returns the string value of the identifier key as set in the config
		var defaultSettingsFileDV = await this.getSettingsHolDefaultsFileDV();
		var defaultID = defaultSettingsFileDV.append_id;
		console.debug("getAppendIDDV is returning: ",defaultID);
		return defaultID;
	}
	
	/////////////////////////// Accessing & Creating Files //////////////////////////////
	
	async concatFileNameDV(cat, givenTitle, thisID){
		// the returned file name DOES NOT HAVE the extension! You must add it if creating a new file!
		console.debug("concatFileNameDV(" + cat + ", " + givenTitle + ", " + thisID + ") was called.");
		// returns a string with the correctly formatted title w/ next ID
		// thisID is optional; if it's not provided, the next ID according the given cat is provided
		if (cat == null) { throw new Error("No category was provided! src: concatFileNameDV"); }
		if (givenTitle == null) { console.warn("No title was provided for concatenation! src: concatFileNameDV"); }
		if (thisID == null) { console.warn("No ID was provided, so the next ID will be calculated. src: concatFileNameDV"); }
		givenTitle = givenTitle.replace(/[|&;$%@!""''*:<>+,]/g, "");
		var blindIDs = await this.getBlindIDsDV();
		if  (blindIDs == false) {
			if (thisID == null){
				var nextID = await this.getNextIDDV(cat);
				nextID = nextID.toUpperCase();
			} else {
				var nextID = thisID;
			}
			var append = await this.getAppendIDDV();
			switch(append){
				case "prepend":
					var newTitle = nextID + " " + givenTitle;
					console.debug("concatFileNameDV is returning: ",newTitle);
					return newTitle;
					break;
				case "append":
					var newTitle = givenTitle + " " + nextID;
					console.debug("concatFileNameDV is returning: ",newTitle);
					return newTitle;
					break;
			}
		} else {
			if (givenTitle == "" || givenTitle == "null"){
				givenTitle = "Untitled";
			}
			console.debug("concatFileNameDV is returning: ",givenTitle);
			return givenTitle;
		}
	}
	
	async createNewFileMD(path,contents,fileName){
		// This already adds the md extension to the file path before creating the new file!
		// use fileName ONLY IF it is not already part of the path
		console.debug("createNewFileMD(" + path + ", " + contents + ") was called.");
		// This function creates a new file at the specified path + .md, with the given contents
		if (path == null) { throw new Error("No path was provided to create the file at! src: createNewFileMD"); }
		if (contents == null) { 
			console.warn("No contents were provided, defaulting to empty file! src: createNewFileMD"); 
			contents = "";
		}
		if (fileName != null){ path = path + "/" + fileName + ".md"; } else { path = path + ".md"; }
		await this.createNewFile(path,contents);
		console.debug("New file was created at: " + path + " src: createNewFileMD");
	}
	
	async createNewFile(path,contents,fileName){
		// use fileName ONLY IF it is not already part of the path
		console.debug("createNewFile(" + path + ", " + contents + ") was called.");
		// creates a new file at the specified path with the given contents
		// This function exists in case we need to change the way files are accessed in the future. It simplifies refactoring.
		if (path == null) { throw new Error("No path was provided to create the file at! src: createNewFile"); }
		if (contents == null) { console.warn("No contents were provided, defaulting to empty file! src: createNewFile"); }
		if (fileName != null){ path = path + "/" + fileName; };
		try {
			await app.vault.create(path, contents);
			console.debug("New file was created at: " + path + " src: createNewFile");
		} catch {
			throw new Error("Failed to create new file at: " + path + " src: createNewFile");
		}
	}
	
	async getFileByPath(path){
		console.debug("getFileByPath(" + path + ") was called.");
		// returns the file with the specified path
		// This function exists in case we need to change the way files are accessed in the future. It simplifies refactoring.
		try {
			var targetFile = await app.vault.getAbstractFileByPath(path);
			console.debug("Requested file was found! src: getFileByPath");
			return targetFile;
		} catch {
			throw new Error("Failed to find the requested file! src: getFileByPath");
		}
	}
		
	async getFileContents(targetFile){
		console.debug("getFileContents(", targetFile, ") was called.");
		// returns the contents of the given file as a string
		if (targetFile == null){throw new Error("No target file was provided to read the contents of! src: getFileContents");}
		var contents = await app.vault.read(targetFile);
		if (contents == null){throw new Error("Failed to retrieve file contents! src: getFileContents");}
		console.debug("getFileContents is returning: ",contents);
		return contents;
	}
	
	async getFileContentsByPath(path){
		console.debug("getFileContentsByPath(" + path + ") was called.");
		// returns the contents of the file at the specified path as a string
		if (path == null){throw new Error("No path to target file was provided to read the contents of! src: getFileContentsByPath");}
		var targetFile = await this.getFileByPath(path);
		if (targetFile == null){throw new Error("Failed to retrieve file! Path may be incorrect or file may not exist. src: getFileContentsByPath");}
		var contents = await this.getFileContents(targetFile);
		if (contents == null){throw new Error("Failed to retrieve file contents! src: getFileContentsByPath");}
		console.debug("getFileContentsByPath is returning: ",contents);
		return contents;
	}
	
	async getFileLines(targetFile){
		console.debug("getFileLines(", targetFile, ") was called.");
		// returns the lines of the specified file
		if (targetFile == null){throw new Error("No target file was provided to get the lines of! src: getFileLines");}
		var contents = await this.getFileContents(targetFile);
		var contentLines = await this.getStringLines(contents);
		console.debug("getFileLines is returning: ",contentLines);
		return contentLines;
	}
	
	async getFileLinesByPath(path) {
		console.debug("getFileLinesByPath(" + path + ") was called.");
		// returns the lines of the file at a specified path as an array
		if (path == null){throw new Error("No path to target file was provided to read the lines of! src: getFileLinesByPath");}
		var targetFile = await this.getFileByPath(path);
		var fileLines = await this.getFileLines(targetFile);
		console.debug("getFileLinesByPath is returning: ",fileLines);
		return fileLines;
	}
	
	async replaceFileContents(targetFile, newContents){
		console.debug("replaceFileContents(", targetFile, ", ", newContents, ") was called.");
		// replaces the contents of the given file with the provided contents
		if (targetFile == null){throw new Error("No target file was provided to replace the contents of! src: replaceFileContents");}
		if (newContents == null){
			console.warn("No new contents were provided! Existing contents will be replaced with nothing. src: replaceFileContents");
			newContents = "";
			}
		try {
			await app.vault.modify(targetFile, newContents);
			console.debug("Successfully modified the target file! src: replaceFileContents");
		} catch {
			throw new Error("Failed to modify the targe file! src: replaceFileContents");
		}
	}
	
	async replaceFileContentsByPath(path, contents){
		console.debug("replaceFileContentsByPath(" + path + ", " + newContents + ") was called.");
		// replaces the contents of the file found at the given path with the provided contents
		if (path == null){throw new Error("No path to target file was provided to replace the contents of! src: replaceFileContentsByPath");}
		if (contents == null){
			console.warn("No new contents were provided! Existing contents will be replaced with nothing. src: replaceFileContentsByPath");
			contents = "";
			}
		var targetFile = await this.getFileByPath(path);
		await this.replaceFileContents(targetFile,contents);
		console.debug("Successfully modified the target file! src: replaceFileContentsByPath");
	}
	
	async concatCatSettingsFileMetadata(cat){
		console.debug("concatCatSettingsFileMetadata(", cat, ") was called.");
		// UNFINISHED
		var catSettingsID = await this.concatCatSettingsID(cat);
		var catSettingsTag = await this.concatCatSettingsTag(cat);
		var fileMetadata = "---\nid: " + catSettingsID + "\ntag: " + catSettingsTag + "\n---\n\n";
		console.debug("concatCatSettingsFileMetadata is returning: ",fileMetadata);
		return fileMetadata;
	}
	
	concatSettingsFilePath(){
		// UNFINISHED
	}
	
	async getCatListSettingsFileContent(){
		// UNFINISHED
	}
	
	
	async createNewCatSettingsFile(cat){
		// UNFINISHED
	}

	
	////////////////////// Handling Strings //////////////////////
	
	getStringLines(targetString){
		// returns the lines of a given string as an array
		console.debug("getStringLines(" + targetString + ") was called.");
		var stringLines = targetString.split("\n");
		console.debug("getStringLines is returning: ",stringLines);
		return stringLines;
	}
	
	wrapStringInQuotesYAML(targetString){
		console.debug("wrapStringInQuotesYAML(" + targetString + ") was called.");
		// this returns the given string with quotes around it, it's specifically used for wrapping YAML strings
		// it exists in case the formatting of YAML changes at any point, and so we can add more advanced formatting for edge cases later
		if (targetString == null){throw new Error("No target string was provided to wrap in quotes! src: wrapStringInQuotesYAML");}
		var returnString = '"' + targetString + '"';
		console.log("wrapStringInQuotesYAML is returning :", returnString);
		return returnString;
	}
	
	wrapStringInQuotesDV(targetString){
		console.debug("wrapStringInQuotesDV(" + targetString + ") was called.");
		// this returns the given string with quotes around it, it's specifically used for wrapping DV source strings
		// it exists in case the formatting of Dataview changes at any point, and so we can add more advanced formatting for edge cases later
		if (targetString == null){throw new Error("No target string was provided to wrap in quotes! src: wrapStringInQuotesDV");}
		var returnString = '"' + targetString + '"';
		console.log("wrapStringInQuotesDV is returning :", returnString);
		return returnString;
	}
	
	addAfterNewline(targetString, newString){
		return targetString + "/n" + newString;
		
	}

	/////////////////////// Handling IDs ///////////////////////
	
	async getFilesInCatDV(cat) {
		console.debug("getFilesInCatDV(" + cat + ") was called.");
		// returns a list of dataview-type files in the given category
		const dv = await DataviewAPI; var defaultID = await this.getIdentifierDV(); // NEED THIS
		if (cat == null) { throw new Error("No category was provided to get files from! src: getFilesInCatDV"); }
		cat = await cat.toLowerCase();
		var fileList = await dv.pages("#" + cat); 
		if (fileList.length == 0){ fileList = null; }
		if (fileList == null) { console.warn("Failed to retrieve dataview-type files! Directory may be empty. src: getFilesInCatDV"); }
		console.debug("getFilesInCatDV is returning: ",fileList);
		return fileList;
	}
	
	async getIDNumsDV(cat){
		console.debug("getIDNumsDV(" + cat + ") was called.");
		// returns a list of IDs in the given category
		if (cat == null) { throw new Error("No category was provided to get files from! src: getIDNumsDV"); }
		var fileListDV = await this.getFilesInCatDV(cat);
		var idList = new Array();
		var i=0; while (i<fileListDV.length){
			var thisIDNum = await fileListDV[i].idnum;
			if (thisIDNum != null && Number.isInteger(thisIDNum)){
				idList.push(thisIDNum);
			} 
			i++;
		}
		console.debug("getIDNumsDV is returning: ",idList);
		return idList;
	}
	
	async getNextIDNumDV(cat){
		console.debug("getNextIDNumDV(" + cat + ") was called.");
		var minimumID = await this.getStartingIDNumDV();
		var idList = await this.getIDNumsDV(cat);
		var idList = await idList.sort();
		var lastID = idList[idList.length - 1];
		var nextID = +lastID + 1;
		console.debug("getNextIDNumDV is returning: ",nextID);
		return nextID;
	}
	
	async getNextIDDV(cat){
		console.debug("getNextIDDV(" + cat + ") was called.");
		var nextIDNum = await this.getNextIDNumDV(cat);
		var nextID = cat + nextIDNum;
		console.debug("getNextIDDv is returning: ",nextID);
		return nextID;
	}

}
