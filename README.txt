-DM me anytime on discord for tech support!

**DISCLAIMER**
-App reads / and writes to a local db.JSON file in the app folder. This means none of your character info is uploaded to any kind of cloud database or anything weird like that. If you are a coder, you can inspect the code yourself. 

**HOW TO LAUNCH APP**
-Double click on launchApp.bat from the directory folder. It should launch server and open your default browser to the correct page. If not, just type in 'localhost:5000' into your browser. That's it!

**HOW TO OUTPUT INVENTORY/SPELLBOOK FILES*
-Commands to output inventory/spellbook files:
  -Load into a character in game, and type: /output inventory Charname
  -Load into a character in game, and type: /output spellbook Charnamespells
  -THESE MUST BE FORMATTED AS SUCH, with the first letter of the character name capitalized, and the rest lower case. 

-CREATING UI FILES-
  -The 'copyUi' button works by checking the characters class, then copying a UI from that premade class specific UI.
  -You must create a UI file for each class and save it in the 'classUIs' folder.
  -Just overwrite the existing files in there to maintain proper filename formatting.

-WHEN ENTERING A NEW CHARACTER: (VERY IMPORTANT)
  -The first letter should be uppercased, because the output inventory and spellbook files are case sensitive.
  -Class names MUST be entered and in this format, or function WILL NOT work:
      Enchanter
      Mage
      Necromancer
      Wizard
      Cleric
      Druid
      Shaman
      Bard
      Monk
      Ranger
      Rogue
      Tanks
      Paladin
      Shadowknight
      Warrior
      
  -If things are not formatted correctly, things may not function properly.
  
  **TIPS/QUIRKS**

-Item/inventory queries are case sensitive, however character name queries are not (im just bad is why)
-Some buttons require a browser refresh to see the results
-The P99 Dir requires a '/' at the end. Function will not work otherwise.
-When entering the P99 dir, just press ENTER and it will work. There is no submit button and it may look like nothing happened. Just refresh the page, re-open the modal, and you should see the correct DIR display.



 
  








    
