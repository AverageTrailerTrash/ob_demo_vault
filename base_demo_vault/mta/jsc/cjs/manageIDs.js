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
		
	// Getting config_hol_base Values // 
	
	async getIdentifier() {
		console.debug("getIdentifier() was called.");
		//returns the string value of the identifier key as set in the config
		var defaultID = await this.getHolBaseConfigValue("identifier");
		console.debug("getIdentifier is returning: ",defaultID);
		return defaultID;
	}
	
	async getCatLength(){
		console.debug("getCatLength() was called.");
		// returns the string value of the category length as set in the config
		var catLength = await this.getHolBaseConfigValue("catLength");
		console.debug("getCatLength is returning: ",catLength);
		return catLength;
	}
	
	async getStartingID(){
		console.debug("getStartingID() was called.");
		// returns the string value of the starting ID as set in the config
		var startingID = await this.getHolBaseConfigValue("startingID");
		console.debug("getStartingID is returning: ",startingID);
		return startingID;
	}
	
	// Accessing IDs // 
	
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
		// UNFINISHED
		
	}
	
	async getAllCats() {
		// this requires a function to get lines of file 
		// and split by ::, cats before, leave out blanks
		// returns an array of all categories' IDs
		// we should have all we need to code this now!
		// UNFINISHED
	}
	
	async getAllCatsDV(){
		
	}
	
	
	
	// Accessing Files in Bulk // 
	
	async getFilesInCatDV(cat) {
		console.debug("getFilesInCatDV(" + cat + ") was called.");
		// returns a list of dataview-type files in the given category
		const dv = await DataviewAPI; var defaultID = await this.getIdentifier();
		if (cat == null) { throw new Error("No category was provided to get files from! src: getFilesInCatDV"); }
		cat = await cat.toLowerCase();
		var fileList = await dv.pages().where(p => {
			var p_bool = false;
			if (p[defaultID] != undefined) { 
				var p_id = p[defaultID].toString();
				p_bool = p_id.includes(cat); 
			}
			return p_bool; 
		});
		if (fileList.length == 0){ fileList = null; }
		if (fileList == null) { console.warn("Failed to retrieve dataview-type files! Directory may be empty. src: getFilesInCatDV"); }
		console.debug("getFilesInCatDV is returning: ",fileList);
		return fileList;
	}
	
	async getIDsInCatDV(cat){
		console.debug("getIDsInCatDV(" + cat + ") was called.");
		// returns a list of IDs in the given category
		var defaultID = await this.getIdentifier();
		if (cat == null) { throw new Error("No category was provided to get files from! src: getIDsInCatDV"); }
		var fileListDV = await this.getFilesInCatDV(cat);
		var idList = new Array();
		var i=0; while (i<fileListDV.length){idList[i] = await fileListDV[i][defaultID]; i++}
		console.debug("getIDsInCatDV is returning: ",idList);
		return idList;
	}
	
	async getIDNumsInCatDV(cat){
		console.debug("getIDNumsInCatDV(" + cat + ") was called.");
		// returns a list of IDs in the given category
		if (cat == null) { throw new Error("No category was provided to get files from! src: getIDNumsInCatDV"); }
		var fileListDV = await this.getFilesInCatDV(cat);
		var idList = new Array();
		var i=0; while (i<fileListDV.length){
			var thisIDNum = await fileListDV[i].idnum;
			if (thisIDNum != null && Number.isInteger(thisIDNum)){
				idList.push(thisIDNum);
			} 
			i++;
		}
		console.debug("getIDNumsInCatDV is returning: ",idList);
		return idList;
	}
	
	async removeCatFromIDString(givenID){
		console.debug("removeCatFromIDString(" + givenID + ") was called.");
		// This extracts the first cat-length characters in a string
		var catLength = await this.getCatLength();
		var strippedID = givenID.substring(catLength);
		console.debug("removeCatFromIDString is returning: ",strippedID);
		return strippedID;
	}
	
	async getIDNumsFromIDList(idList){
		console.debug("getIDNumsFromIDList(" + idList + ") was called.");
		// this extracts the ID numbers from a list of IDs
		var i=0; while (i<idList.length){
			idList[i] = await this.removeCatFromIDString(idList[i]); 
			i++
			}
		console.debug("getIDNumsFromIDList is returning: ",idList);
		return idList;
	}
	
	async getIDNumsInCatByIDDV(cat){
		// this is a less efficient way of getting the idnums.
		// it exists for edge cases where a user may not have assigned the idnum key to their vault
		// please use getIDNumsInCatDV wherever possible
		console.debug("getIDNumsInCatByIDDV(" + cat + ") was called.");
		var idList = await this.getIDsInCatDV(cat);
		var numList = await this.getIDNumsFromIDList(idList);
		console.debug("getIDNumsInCatByIDDV is returning: ",numList);
		return numList;
	}
		
	async getNextIDNumInCat(cat){
		console.debug("getNextIDNumInCat(" + cat + ") was called.");
		var minimumID = await this.getStartingID();
		var idList = await this.getIDNumsInCatDV(cat);
		var idList = await idList.sort();
		console.log("SEE ME: ", idList);
		var lastID = idList[idList.length - 1];
		console.log("SEE ME: ", lastID);
		var nextID = +lastID + 1;
		console.debug("getNextIDNumInCat is returning: ",nextID);
		return nextID;
	}
	
	async getNextIDInCat(cat){
		console.debug("getNextIDInCat(" + cat + ") was called.");
		var nextIDNum = await this.getNextIDNumInCat(cat);
		var nextID = cat + nextIDNum;
		console.debug("getNextIDInCat is returning: ",nextID);
		return nextID;
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
	
	// String Utiliites //
	
	removeLeadingSpaces(targetString){
		console.debug("removeLeadingSpaces(" + targetString + ") was called.");
		// this returns the provided string without any leading spaces
		if (targetString == null) { throw new Error("No target string provided! src: removeLeadingSpaces"); }
		while (targetString.charAt(0) == " ") { targetString = targetString.substr(1); }
		console.debug("removeLeadingSpaces is returning: ",targetString);
		return targetString;
	}
	
	getKeyFromString(targetString){
		console.debug("getKeyFromString(" + targetString + ") was called.");
		// this returns the text before :: in a string, generally the key of a key:: value pair
		if (targetString == null) { throw new Error("No target string provided! src: getKeyFromString"); }
		var key = targetString.split("::")[0];
		console.debug("getKeyFromString is returning: ",key);
		return key;
	}
	
	async getValueFromString(targetString){
		console.debug("getValueFromString(" + targetString + ") was called.");
		// this returns the text after :: in a string minus any leading spaces, generally the value of a key:: value pair
		if (targetString == null) { throw new Error("No target string provided! src: getValueFromString"); }
		var value = targetString.split("::")[1];
		value = await this.removeLeadingSpaces(value);
		console.debug("getValueFromString is returning: ",value);
		return value;
	}
	
	async getValueFromStringDV(targetString){
		// we should be able to do fileDV.values or fileDV.values[0]
		// UNFINISHED
	}
	
	wrapStringWithSpacers(targetString){
		targetString = "\n" + targetString + "\n";
		return targetString;
	}
	
	wrapStringWithYAMLHeader(targetString){
		targetString = "---\n" + targetString + "\n---";
		return targetString;
	}
	
	wrapStringWithComment(targetString){
		targetString = "%%\n" + targetString + "\n%%";
		return targetString;
	}
	
	wrapStringWithCommentSpacers(targetString){
		targetString = "%%\n\n" + targetString + "\n\n%%";
		return targetString;
	}
	
	wrapStringWithCommentInline(targetString){
		targetString = "%%" + targetString + "%%";
		return targetString;
	}
	
	wrapStringWithCommentInlineSpaces(targetString){
		targetString = "%% " + targetString + " %%";
		return targetString;
	}
	
	wrapStringWithHTMLComment(targetString){
		targetString = "<--\n" + targetString + "\n-->";
		return targetString;
	}
	
	wrapStringWithHTMLCommentSpacers(targetString){
		targetString = "<--\n\n" + targetString + "\n\n-->";
		return targetString;
	}
	
	wrapStringWithHTMLCommentInline(targetString){
		targetString = "<--" + targetString + "-->";
		return targetString;
	}
	
	wrapStringWithHTMLCommentInlineSpaces(targetString){
		targetString = "<-- " + targetString + " -->";
		return targetString;
	}
	
	wrapStringWithTickCommentBlock(targetString,codeName){
		if (codeName == null) {codeName = "";}
		targetString = "```" + codeName + "\n" + targetString + "\n```";
		return targetString;
	}
	
	wrapStringWithTickCommentBlockSpacers(targetString,codeName){
		if (codeName == null) {codeName = "";}
		targetString = "```" + codeName + "\n\n" + targetString + "\n\n```";
		return targetString;
	}
	
	wrapStringWithTickCommentInline(targetString){
		targetString = "`" + targetString + "`";
		return targetString;
	}
	
	wrapStringWithTickCommentInlineDV(targetString){
		targetString = "`=" + targetString + "`";
		return targetString;
	}
	
	wrapStringWithDataviewBlock(targetString){
		var resultString = this.wrapStringWithTickCommentBlock(targetString,"dataview");
		return resultString;
	}
	
	wrapStringWithDataviewBlockSpacers(targetString){
		var resultString = this.wrapStringWithTickCommentBlockSpacers(targetString,"dataview");
		return resultString;
	}
	
	wrapStringWithInlineDVQuery(targetString){
		targetString = "`=this." + targetString + "`";
		return targetString;
	}
	
	wrapStringWithInlineDVJS(targetString){
		targetString = "`?=" + targetString + "`";
		return targetString;
	}
	
	concatYAML(givenKey, givenValue){
		var resultString = givenKey + ": " + givenValue;
		return resultString;
	}
	
	concatNewline(givenStringArray){
		var resultString = "";
		var i=0; while (i<givenStringArray.length) {
			if (i == givenStringArray.length - 1){
				resultString = resultString + givenStringArray[i];
			} else {
				resultString = resultString + givenStringArray[i] + "\n";
			}
			i++;
		}
		return resultString;
	}
	
	async concatNewlineYAML(givenStringArray){
		var targetString = await this.concatNewline(givenStringArray);
		var resultString = await this.wrapStringWithYAMLHeader(targetString);
		return resultString;
	}
	
	
	// Accessing Keys & Values in Bulk // 
	
	async getListedFileKeys(targetFile){
		console.debug("getListedFileKeys(", targetFile, ") was called.");
		// returns the keys in the specified flie; requires file with a key:: value\nkey::value format
		if (targetFile == null) { throw new Error("No target file provided! src: getListedFileKeys"); }
		var fileLines = await this.getFileLines(targetFile);
		var i = 0;
		while (i < fileLines.length){fileLines[i] = this.getKeyFromString(fileLines[i]); i++;}
		console.debug("getListedFileKeys is returning: ",fileLines);
		return fileLines;
	}
	
	async getListedFileKeysByPath(path){
		console.debug("getListedFileKeysByPath(" + path + ") was called.");
		// returns the keys in the specified flie; requires file with a key:: value\nkey::value format
		if (path == null) { throw new Error("No path provided to target file! src: getListedFileKeysByPath"); }
		var fileLines = await this.getFileLinesByPath(path);
		var i = 0;
		while (i < fileLines.length){fileLines[i] = this.getKeyFromString(fileLines[i]); i++;}
		console.debug("getListedFileKeysByPath is returning: ",fileLines);
		return fileLines;
	}
	
	async getListedFileValues(targetFile){
		console.debug("getListedFileValues(", targetFile, ") was called.");
		// returns the values in the specified flie; requires file with a key:: value\nkey::value format
		if (targetFile == null) { throw new Error("No target file provided! src: getListedFileValues"); }
		var fileLines = await this.getFileLines(targetFile);
		var i = 0;
		while (i < fileLines.length){fileLines[i] = this.getValueFromString(fileLines[i]); i++;}
		console.debug("getListedFileValues is returning: ",fileLines);
		return fileLines;
	}
	
	async getListedFileValuesByPath(path){
		console.debug("getListedFileValuesByPath(" + path + ") was called.");
		// returns the values in the specified flie; requires file with a key:: value\nkey::value format
		if (path == null) { throw new Error("No path provided to target file! src: getListedFileValuesByPath"); }
		var fileLines = await this.getFileLinesByPath(path);
		var i = 0;
		while (i < fileLines.length){fileLines[i] = await this.getValueFromString(fileLines[i]); i++;}
		console.debug("getListedFileValuesByPath is returning: ",fileLines);
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

	async getConfigFileValues(whichAuthor,whichConfig) {
		console.debug("getConfigFileValues(" + whichAuthor + "," + whichConfig + ") was called.");
		// returns an array of keys from the specified config file
		if (whichAuthor == null) { throw new Error("No config author provided! src: getConfigFileValues"); }
		if (whichConfig == null) { throw new Error("No config file specified! src: getConfigFileValues"); }
		var configPath = await this.getConfigFilePath(whichAuthor,whichConfig);
		var configLines = await this.getListedFileValuesByPath(configPath);
		console.debug("getConfigFileValues is returning: ",configLines);
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
	
	async getHolConfigValues(whichConfig){
		console.debug("getHolConfigValues() was called.");
		if (whichConfig == null) { throw new Error("No config file specified! src: getHolConfigValues"); }
		var configLines = await this.getConfigFileValues("hol",whichConfig);
		console.debug("getHolConfigValues is returning: ",configLines);
		return configLines;
	}
	
	async getHolBaseConfigValues(){
		console.debug("getHolBaseConfigValues() was called.");
		var configLines = await this.getHolConfigValues("base");
		console.debug("getHolBaseConfigValues is returning: ",configLines);
		return configLines;
	}
	
	// Building Metadata //
	
	async getNextIDAsYAML(cat){
		var nextID = await this.getNextIDInCat(cat);
		var defaultID = await this.getIdentifier();
		var idString = await this.concatYAML(defaultID, nextID);
		return idString;
	}
	
	async getNextIDNumAsYAML(cat){
		var nextIDNum = await this.getNextIDNumInCat(cat);
		var idString = await this.concatYAML("idnum", nextIDNum);
		return idString;
	}
	
	async getNextIDAndNumAsYAML(cat){
		var nextID = await this.getNextIDInCat(cat);
		var nextIDNum = await this.getNextIDNumInCat(cat);
		var defaultID = await this.getIdentifier();
		var idString = await this.concatYAML(defaultID, nextID);
		var idNumString = await this.concatYAML("idnum", nextIDNum);
		var idLines = await this.concatNewlineYAML([idString,idNumString]);
		return idLines;
	}
	

}
