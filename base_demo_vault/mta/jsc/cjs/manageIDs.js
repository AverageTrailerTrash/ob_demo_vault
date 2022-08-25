	class manageIDs {
	//  this class implements the core functionality and structure of my vault
	
	// function structure:
	// // vital notices, debug, description, dependencies, errors, vars, behavior, debug, return
	
	// using console:
	// // console.debug for code logic, console.info for user-driven activities,
	// // console.log for notes, console.warn for possible issues (not throwable)
	
	abcTest(){
		// my function!
		return "abc";
	}
	
	// Global Variables //
	
	getBaseStructure(key){
		console.debug("getBaseStructure(" + key + ") was called.");
		// returns the requested global value; these are vital to operation
		var keyValue = "";
		switch(key){
			case "utilities_folder": keyValue = "mta"; break;
			case "javascript_folder": keyValue = "mta/jsc"; break;
			case "customJS_folder": keyValue = "mta/jsc/cjs"; break;
			case "rawdata_folder": keyValue = "mta/val"; break;
			case "template_folder": keyValue = "mta/tpl"; break;
			case "temporary_folder": keyValue = "mta/tmp"; break;
			case "cat_list_file": keyValue = "category_list.md"; break;
			default: throw new Error("Incorrect key provided for base structure! src: getBaseStructure"); break;
		}
		console.debug("getBaseStructure is returning: ",keyValue);
		return keyValue;
	}
	
	// Accessing Metadata //
		
	async getDataviewFile(path){
		console.debug("getDataviewFile(" + path + ") was called.");
		// returns dataview version of a file. 
		// this is necessary to efficiently pull metadata from files.
		// path can be actual path or file name.
		const dv = DataviewAPI;
		if (path == null) { throw new Error("No path or name provided! src: getDataviewFile"); }
		var dvFile = await dv.page(path);
		if (dvFile == null) { throw new Error("Failed to retrieve dataview-type file! Path may be invalid. src: getDataviewFile"); }
		console.debug("getDataviewFile is returning: ",dvFile);
		return dvFile;
	}
	
	getMetadataValue(targetFileDV,key){
		console.debug("getMetadataValue(",targetFileDV,"," + key + ") was called.");
		// this returns the vaue of a given metadata entry from a given dataview file
		if (targetFileDV == null) { throw new Error("No dataview file provided to get metadata value from! src: getMetadataValue"); }
		if (key == null) { throw new Error("No key provided to retrieve metadata value from! src: getMetadataValue"); }
		// note: below is equivalent to var metadataValue = targetFile.key, except key can be var here.
		var metadataValue = targetFileDV[key];
		if (metadataValue == null) { console.warn("Failed to retrieve metadata value! File may be incorrect or file may not have this metadata item. src: getMetadataValue"); }
		console.debug("getMetadataValue is returning: ",metadataValue);
		return metadataValue;
	}

	async getMetadataValueFromPath(path,key){
		console.debug("getMetadataValueFromPath(" + path + "," + key + ") was called.");
		// this returns the vaue of a given metadata entry from a given file by its path
		// either path or file name can be used here
		if (path == null) { throw new Error("No file path or name provided to get metadata value from! src: getMetadataValue"); }
		if (key == null) { throw new Error("No key provided to retrieve metadata value from! src: getMetadataValue"); }
		var targetFile = await this.getDataviewFile(path);
		// note: below is equivalent to var metadataValue = targetFile.key, except key can be var here.
		var metadataValue = targetFile[key];
		if (metadataValue == null) { console.warn("Failed to retrieve metadata value! Path may be incorrect, file missing, or the file may not have this metadata item. src: getMetadataValueFromPath"); }
		console.debug("getMetadataValueFromPath is returning: ",metadataValue);
		return metadataValue;
	}
	
	// // accessing config-related metadata // //
	
	async getConfigFileDV(whichAuthor, whichConfig) {
		console.debug("getConfigFileDV(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns dataview version of the specificed config file. 
		// this is necessary to get the values efficiently when in metadata format.
		// path format will be config_whichAuthor_whichConfig.md
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigFileDV"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigFileDV"); }
		var path = await this.getConfigFilePath(whichAuthor,whichConfig);
		var thisConfigFile = await this.getDataviewFile(path);
		console.debug("getConfigFileDV is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	async getConfigValue(whichAuthor, whichConfig, key) {
		console.debug("getConfigValue(" + whichAuthor + "," + whichConfig + "," + key + ") was called.");
		// returns the value of a particular config value from a particular file
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigValue"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigValue"); }
		if (key == null) { throw new Error("No key provided to get config value from! src: getConfigValue"); }
		var thisConfigFile = this.getConfigFileDV(whichAuthor,whichConfig);
		var keyValue = thisConfigFile[key];
		console.debug("getConfigFileDV is returning: ",keyValue);
		return keyValue;
	}
	
	//  //  convenience functions for accessing common config metadata values // //
	
	async getHolConfigFileDV(whichConfig) {
		console.debug("getHolConfigFileDV(" + whichConfig + ") was called.");
		// returns dataview version of the specified config file by author hol (me)
		if (whichConfig == null) { throw new Error("No config file specified! src: getHolConfigFileDV"); }
		var thisConfigFile = await this.getConfigFileDV("hol", whichConfig);
		console.debug("getHolConfigFileDV is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	async getHolBaseConfigFileDV() {
		console.debug("getHolConfigFileDV() was called.");
		// returns dataview version of the base config file by author hol (me)
		var thisConfigFile = await this.getHolConfigFileDV("base");
		console.debug("getHolBaseConfigFileDV is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	async getHolBaseConfigValue(key) {
		console.debug("getHolBaseConfigValue(" + key + ") was called.");
		// returns a metadata value from config_hol_base
		if (key == null) { throw new Error("No key provided to retrieve metadata value from! src: getHolBase"); }
		var configFile = await this.getHolBaseConfigFileDV();
		var configValue = await this.getMetadataValue(configFile,key);
		console.debug("getHolBaseConfigValue is returning: ",configValue);
		return configValue; 
	}
		
	// Accessing IDs // 
	
	async getIdentifier() {
		console.debug("getIdentifier() was called.");
		var defaultID = await this.getHolBaseConfigValue("identifier");
		console.debug("getIdentifier is returning: ",defaultID);
		return defaultID;
	}
	
	async getID(targetFileDV){
		console.debug("getID(",targetFileDV,") was called.");
		// this returns the id of a given file, gotten by its dataview-style file
		if (targetFileDV == null) { throw new Error("No dataview file provided to get ID from! src: getID"); }
		var defaultID = await this.getIdentifier();
		var targetID = await this.getMetadataValue(targetFileDV,defaultID);
		console.debug("getID is returning: ",targetID);
		return targetID;
	}
	
	async getIDFromPath(path){
		console.debug("getIDFromPath(" + path + ") was called.");
		// this returns the id of a given file, gotten by its path or name
		if (path == null) { throw new Error("No file path or name provided to get this ID from! src: getIDFromPath"); }
		var targetFile = this.getDataviewFile(path);
		var defaultID = await this.getIdentifier();
		var targetID = await this.getMetadataValue(targetFile,defaultID);
		console.debug("getIDFromPath is returning: ",targetID);
		return targetID;
	}
	
	// Accessing Categories //
	
	async getCatDirectory(cat){
		console.debug("getCatDirectory(" + cat + ") was called.");
		// this returns the default directory of the given category
		var catListFileName = await this.getBaseStructure("cat_list_file");
		var catListPath = await this.getBaseStructure("rawdata_folder") + "/" + catListFileName;
		var catFile = await this.getDataviewFile(catListPath);
		var myCatDirectory = catFile[cat][0];
		console.debug("getCatDirectory is returning: ",myCatDirectory);
		return myCatDirectory;
	} 
	
	async getCatDesc(cat){
		console.debug("getCatDesc(" + cat + ") was called.");
		// this returns the descriptive title of the given category
		var catListFileName = await this.getBaseStructure("cat_list_file");
		var catListPath = await this.getBaseStructure("rawdata_folder") + "/" + catListFileName;
		var catFile = await this.getDataviewFile(catListPath);
		var myCatDesc = catFile[cat][1];
		console.debug("getCatDesc is returning: ",myCatDesc);
		return myCatDesc;
	}
	
	async doesCatExist(cat){
		console.debug("doesCatExist(" + cat + ") was called.");
		// this checks if a category currently exists and returns a boolean
		var catListFileName = await this.getBaseStructure("cat_list_file");
		var catListPath = await this.getBaseStructure("rawdata_folder") + "/" + catListFileName;
		var catFile = await this.getDataviewFile(catListPath);
		var myCat = catFile[cat];
		var doesCat = false;
		if (myCat != null) {doesCat = true;}
		console.debug("doesCatExist is returning: ",doesCat);
		return doesCat;
	}
	
	async doesCatDirExist(cat){
		// this requires a function to check if a file path exists
	}
	
	async getAllCats() {
		// this requires a function to get lines of file 
		// and split by ::, cats before, leave out blanks
		// returns an array of all categories' IDs
	}
	
		
	// Accessing Markdown Files //
	
	async getFileLinesByPath(path) {
		console.debug("getFileLines(" + path + ") was called.");
		// returns an array of lines from the requested file, by path
		if (path == null) { throw new Error("No path provided to get lines from! src: getFileLinesByPath"); }
		var listFile = await app.vault.getAbstractFileByPath(path);
		if (listFile == null) { throw new Error("Failed to retrieve requested file! Path may be incorrect or file may not exist. src: getFileLinesByPath"); }
		var listContents = await app.vault.read(listFile);
		if (listContents == null || listContents == "") { console.warn("Requested file appears to be empty. Path may be incorrect. src: getFileLinesByPath"); }
		var listLines = listContents.split("\n");
		console.debug("getFileLinesByPath is returning: ",listLines);
		return listLines;
	}
	
	async getFileLines(targetFile) {
		console.debug("getFileLines(", targetFile, ") was called.");
		// returns an array of lines from the requested file, by abstractfile
		if (targetFile == null) { throw new Error("Failed to retrieve requested file! Path may be incorrect or file may not exist. src: getFileLines"); }
		var listContents = await app.vault.read(targetFile);
		if (listContents == null || listContents == "") { console.warn("Requested file appears to be empty. Path may be incorrect. src: getFileLines"); }
		var listLines = listContents.split("\n");
		console.debug("getFileLines is returning: ",listLines);
		return listLines;
	}
		
	async getConfigFile(whichAuthor, whichConfig) {
		console.debug("getConfigFile(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns abstractfile version of the specified config file. 
		// path format will be config_whichAuthor_whichConfig.md
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigFile"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigFile"); }
		var path = await this.getConfigFilePath(whichAuthor,whichConfig);
		var thisConfigFile = await app.vault.getAbstractFileByPath(path);
		if (thisConfigFile == null) { throw new Error("Failed to find config file! src: getConfigFile"); }
		console.debug("getConfigFile is returning: ",thisConfigFile);
		return thisConfigFile;
	}
	
	async getConfigLines(whichAuthor, whichConfig){
		console.debug("getConfigLines(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns an array of lines from the specified config file. 
		// path format will be config_whichAuthor_whichConfig.md
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigLines"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigLines"); }
		var configFile = await this.getConfigFile(whichAuthor, whichConfig);
		var configLines = await this.getFileLines(configFile);
		console.debug("getConfigLines is returning: ",configLines);
		return configLines;
	}
	
	getKeyFromString(targetString){
		console.debug("getKeyFromString() was called.");
		var key = targetString.split("::")[0];
		console.debug("getKeyFromString is returning: ",key);
		return key;
	}
	
	async getListedFileKeys(targetFile){
		console.debug("getListedFileKeys() was called.");
		// returns the keys in the specified flie; requires file with a key:: value\nkey::value format
		if (targetFile == null) { throw new Error("No target file provided! src: getListedFileKeys"); }
		var fileLines = await this.getFileLines(targetFile);
		var i = 0;
		while (i < fileLines.length){fileLines[i] = fileLines[i].split("::")[0]; i++;}
		console.debug("getListedFileKeys is returning: ",fileLines);
		return fileLines;
	}
	
	async getListedFileKeysByPath(path){
		console.debug("getListedFileKeysByPath() was called.");
		// returns the keys in the specified flie; requires file with a key:: value\nkey::value format
		if (path == null) { throw new Error("No path provided to target file! src: getListedFileKeysByPath"); }
		var fileLines = await this.getFileLinesByPath(path);
		var i = 0;
		while (i < fileLines.length){fileLines[i] = fileLines[i].split("::")[0]; i++;}
		console.debug("getListedFileKeysByPath is returning: ",fileLines);
		return fileLines;
	}
	
	async getConfigFilePath(whichAuthor,whichConfig){
		console.debug("getConfigFilePath(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns an array of keys from the specified config file, or a file with a similar structure
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigFilePath"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigFilePath"); }
		var rawdataFolder = await this.getBaseStructure("rawdata_folder");
		var configPath = rawdataFolder + "/config_" + whichAuthor + "_" + whichConfig + ".md";
		console.debug("getConfigFilePath is returning: ",configPath);
		return configPath;
	}
	
	async getConfigFileKeys(whichAuthor,whichConfig) {
		console.debug("getConfigFileKeys(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns an array of keys from the specified config file
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigFileKeys"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigFileKeys"); }
		var configPath = await this.getConfigFilePath(whichAuthor,whichConfig);
		var configLines = await this.getListedFileKeysByPath(configPath);
		console.debug("getConfigFileKeys is returning: ",configLines);
		return configLines;
	}
	
	// // convenience functions for common config files // //
	
	async getHolConfigLines(whichConfig){
		console.debug("getHolConfigLines() was called.");
		// returns an array of lines from the specificed config file. 
		// path format will be config_hol_whichConfig.md
		if (whichConfig == null) { throw new Error("No config file specified! src: getHolConfigLines"); }
		var configLines = await this.getConfigLines("hol", whichConfig);
		console.debug("getHolConfigLines is returning: ",configLines);
		return configLines;
	}
	
	async getHolBaseConfigLines(){
		console.debug("getHolBaseConfigLines() was called.");
		// returns an array of lines from the config_hol_base.md file. 
		var configLines = await this.getHolConfigLines("base");
		console.debug("getHolBaseConfigLines is returning: ",configLines);
		return configLines;
	}
	
	async getHolConfigKeys(whichConfig){
		console.debug("getHolConfigKeys() was called.");
		if (whichConfig == null) { throw new Error("No config file specified! src: getHolConfigKeys"); }
		var configLines = await this.getConfigFileKeys("hol",whichConfig);
		console.debug("getHolConfigKeys is returning: ",configLines);
		return configLines;
	}
	
	async getHolBaseConfigKeys(){
		console.debug("getHolBaseConfigKeys() was called.");
		var configLines = await this.getHolConfigKeys("base");
		console.debug("getHolBaseConfigKeys is returning: ",configLines);
		return configLines;
	}


	
	//// OLD CODE BELOW, NEEDS REFACTORING ////
		
	async getCatList() {
		// returns array of lines from the categories file
		var path = "mta/val/category_list.md";
		var catListLines = await this.getFileLines(path);
		console.debug("getCatList is returning: ",catLinesList);
		return catListLines;
	}
	
	
	
	
	// async getHolConfigValue(keyToFind, holConfig) {
		// returns the string value of a particular item in the config
		// if (!typeof keyToFind === "string" || !keyToFind instanceof String) {
			// throw new Error("Key provided is not a string!");
		// }
		// holConfig = holConfig || await this.getHolConfig();
		// keyToFind = keyToFind + "::";
		// var holConfigLine = holConfig.filter(s => s.includes(keyToFind))[0];
		// var holConfigValue = holConfigLine.split(' ')[1];
		// return holConfigValue;
	// }
	
	async getCatLength(holConfig){
		// returns the string value of the category length as set in the config
		holConfig = holConfig || await this.getHolConfig();
		var catLength = await this.getHolConfigValue("catLength",holConfig);
		return catLength;
	}
	
	async getStartingID(holConfig){
		// returns the string value of the starting ID as set in the config
		holConfig = holConfig || await this.getHolConfig();
		var startingID = await this.getHolConfigValue("startingID",holConfig);
		return startingID;
	}
	
	async getNextID(cat, fileList) {
		// return the string next ID of the given category
		// if the starting ID is returned, there were no files of this cat found in the file list

        if (cat == null || !typeof cat === "string" || !cat instanceof String) {
			throw new Error ("No category was provided!");
		}
		
		// this will get a list of all files if the file list was not provided
		fileList = fileList || app.vault.getMarkdownFiles();
		
		// preparing variables
		cat = cat.toLowerCase();
		var holConfig = await this.getHolConfig();
		var nextID = await this.getStartingID(holConfig);
		var catLength = await this.getCatLength(holConfig);
		var fileCatIDList = new Array();
		
		if (cat.length != catLength) { throw new Error("Category is not correct length!"); }
				
		// this will make a new array of the names of files in this cat
		if (fileList.length > 0) {
			var pHolder = 0; 
			var thisFileName = "";
			while (pHolder < fileList.length - 1){ 
				// we check if this file is of the same category and is numbered after the category
				thisFileName = fileList[pHolder].basename;
				if (thisFileName.substring(0,catLength).toLowerCase() == cat && !isNaN(thisFileName.split(" ")[0].substring(catLength))) 
					{
						fileCatIDList.push(thisFileName.split(" ")[0] || thisFileName);
					}
				pHolder = pHolder += 1;
			} 
		if (fileCatIDList.length > 0 ) {
			// we will now sort the list alphabetically so the last ID is at the end
			fileCatIDList.sort();
			// we wil now extract the number from the ID
			nextID = fileCatIDList[fileCatIDList.length - 1].substring(catLength);
			nextID = +nextID + 1;
			}
		}
		
		return nextID;
    }
	

}
