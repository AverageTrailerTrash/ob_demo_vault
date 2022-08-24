# Setting Up

It's not yet in a functional state due to lacking the category processing functions, but this will be relevant shortly.

## Installing Base Vault
* To a new vault (until stable), install the required community plugins, and enable the required core plugins.
* Copy the "utilities" folder with all its contents to your vault.
* In the CustomJS settings, set the folder to utilities/javascript/customjs.
* Adjust the values in utilities/rawdata/hol_config.md -- see [here](documentation/files/hol_config.md) for more information on its values. (This will be automated in the near future.)
* Add categories to utilities/rawdata/category_list.md in the "path:: description" format, one per line. (This will be automated in the near future.)

## General Tips

* Assign the "Templater: Insert Template" hotkey to something comfortable. You'll be using this a lot.

## Using Default Functions

To use my function in your templates or to use them in other javascript files, you must follow the basic structure to declare and inherit the class:

    const {myClass} = customJS;

Once you have this in your file or template, you can then call functions from that class within your script like 

    myClass.myFunction();

If you're using Templater templates as recommended, you need to wrap the part(s) of it that use javascript like so:

    <%* 
    your javascript can go here.
    %>

If you run into any issues, try adding a space after the last >. Templater sometimes has issues with templates that seem to be empty.

To write something to the file you're runinng the javascript template in, you'll need to explicitly tell it to return that line like so:

   <%* 
   your javascript can go here
   tR += what you want to return goes here;
   %>

(If you don't include the +, it'll replace whatever else is in the stream that's supposed to be pasted. So be careful to include it.)

For example:

   <%*
   const {manageIDs} = customJS;
   var myConfigFileContents = manageIDs.getHolConfig();
   tR = myConfigFileContents;
   %>

may return something like:

    startingID:: 50, catLength:: 3