--APP FLOW--
--Global Variables: 
  -let data = null;
  -let classListData = null;
  -let inventoryData  = null;
  -let inventoryObject;  Stores all of the character's intentories upon page load (object containing arrays of arrays))
  -let inventoryObjectName = {}; -Stores an individual character (in order to query an individual characters inventory in the inventory modal)
-Upon page launch:
  -Fires off 'getInventoryData()' and 'getCharactersAll()' 
--Event Listeners:
  -'keyup' @ #search-input - Search bar that query's the character names on the main page. Contains an 'if' condition that re-fills the table with default data when search bar is empty.
  -'keyup' @ #inventory-search-input - Search bar the query's the inventory items inside the character inventory modals. Contains an 'if' condition that re-fills the table with default data when search bar is empty.
  -'click' @ 'th' - Sorts the characters in alphabetical order - it should have sorted depending on which column is clicked, but seems to only sort the character names. (Needs to be debugged)

--FUNCTIONS:
  --CRUD:
    -'getCharactersAll()' - This function fires upon page load, and it gets the entire 'characters' database, and sends it to the front end (An array of objects)
    -'newCharacter()' - 'push()' a new character onto the local 'data' array. Upload the local 'data' variable as the 'body'. Re-write 'db.JSON' using express
    -'editCharacter(characterName)' - Find the index of the desired character, by querying the 'data' global variable using 'findIndex()'. Take a 'characterSnapshot' of the desired object so that the new 'edits' can be compared to the snapshot. Then, 'data.splice(characterIndex, 1);. If an 'edit' field is empty, null, or undefined, it is ommited and the 'snapshot' value is used for the final 'edit' 
      -'renderEditButton(characterName)' fires upon clicking the edit button. This way, the submit button inside the edit modal is imprinted with the correct parameter 
    -'deleteCharacter()' - 'findIndex()' of character in the local 'data' variable, 'splice()' is out. Send up the 'body' and the newly spliced 'data' character. Re-write the 'db.JSON' file with express

  --Table Building:
    -'buildTable(data)' - Fires off on page load and on 'keyup'. Fills the table with the character infos.
    -'buildTableInventory(data)' - Builds the inventory table modal. Fires when modal opens, as well as on each keystroke
    -'searchTable(value, data)' - Fires upon every keystroke. Uses the '.includes()' method to query character names
    -'searchTableInventoy(value, data)' - Fires upon every keystroke. Uses the 'includes()' method to query Items. Has an 'if' condition: 'if search bar is empty string, RETURN' 

  --MISC:
    -'listByClass()' - When the pulldown value/field 'changes' (there is an 'onchange' attribute in the html), filter the local 'data' by 'classValue' and fill the table as such.
    