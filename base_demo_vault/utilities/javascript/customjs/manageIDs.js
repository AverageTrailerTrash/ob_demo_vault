class manageIDs {
	// might rename this to "utilities" or "holUtilities"
	
	abcTest(){
		// my function!
		return "abc";
	}
	
	async getFileLines(path) {
		// returns an array of lines from the requested file
		if (path == null) { throw new Error("No path provided to get lines from!"); }
		var listFile = await app.vault.getAbstractFileByPath(path);
		var listContents = await app.vault.read(listFile);
		var listLines = listContents.split("\n");
		return listLines;
	}
	
	async getHolConfig() {
		// returns array of lines from the config file
		var path = "mta/val/hol_config.md";
		var holConfigLines = await this.getFileLines(path);
		return holConfigLines;
	}
	
	async getCatList() {
		// returns array of lines from the categories file
		var path = "mta/val/category_list.md";
		var catListLines = await this.getFileLines(path);
		return catListLines;
	}
	
	async getHolConfigValue(keyToFind, holConfig) {
		// returns the string value of a particular item in the config
		if (!typeof keyToFind === "string" || !keyToFind instanceof String) {
			throw new Error("Key provided is not a string!");
		}
		holConfig = holConfig || await this.getHolConfig();
		keyToFind = keyToFind + "::";
		var holConfigLine = holConfig.filter(s => s.includes(keyToFind))[0];
		var holConfigValue = holConfigLine.split(' ')[1];
		return holConfigValue;
	}
	
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