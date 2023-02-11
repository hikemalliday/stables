
let data = null;
let classListData = null;
// Stores all of the character's intentories upon page load (object containing arrays of arrays)
let inventoryObject;
// Need to convert the 'inventoryObject' into an array of arrays, and 'shift()' the 'character name' to the front of each array (necessary for item searching)
let inventoryItemSearch = [];
// Stores an individual character (in order to query an individual characters inventory in the inventory modal)
let inventoryObjectName = {};
let spellBookData = null;

// 'get' the entire database upon page firing, so that the search bar is ready
getInventoryData();
getCharactersAll();
getSpellBookData();

        // EVENT LISTENERS //

    // ITEM SEARCH ALL //

$('#item-search-input').on('keypress', function(e)
{
    let value = $(this).val();
    
    if (e.key === 'Enter')
    {
        let searchData = searchInventoryAll(value, inventoryItemSearch);
        buildTableItemSearch(searchData);
    }
})

    // INVENTORY SEARCH (ONE CHARACTER) //

// This event/function listens for 'keyup'
$('#inventory-search-input').on('keyup', function()
{
    if ($('#inventory-search-input').val() === '')
        {
            buildTableInventory(inventoryObjectName);
            return;
        }
    let value = $(this).val();
    let searchData = searchTableInventory(value, inventoryObjectName);
    buildTableInventory(searchData);
});

// This event/function listens for 'keypress Enter' for the P99 dir modal
$('#p99dirinput').on('keypress', function(e)
{
    let value = $(this).val();
    
    if (e.key === 'Enter')
    {
        p99DirSet(value);
    }
})

// MOVE THIS LATER

async function p99DirSet(path)
{
    let body = 
    {   
       path: path
    };
    
    data.shift();
    data.unshift(body);
   
    try
    {
        const result = await fetch("http://localhost:5000/p99dirset",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        
        returnedData = await result.json();
        console.log('returnedData: ', returnedData);

    }
    catch(err)
    {
        console.log(err)
    };
};

// This event/function listens for clicks on 'th', and sorts the column
$('th').on('click', function() 
{
    let order = $(this).data('order')
    let column = $(this).data('column')

    console.log('Column was clicked!', column, order)

    if (order == 'desc')
    {
        $(this).data('order', 'asc')
        data = data.sort((a,b) => a[column] > b[column] ? 1 : -1)
    }
    else
    {
        $(this).data('order', 'desc')
        data = data.sort((a,b) => a[column] < b[column] ? 1 : -1)
    }
    
    buildTableFirst(data)
})



    // CHARACTER ACCOUNT SEARCH //

// This event/function listens for 'keyup'
$('#search-input').on('keyup', function()
{
    if ($('#search-input').val() === '')
    {
        buildTable(data);
        return;
    }
    let value = $(this).val()
    let searchData = searchTable(value, data)
    buildTable(searchData)
});

        // TEST //

function inventoryItemSearchTest()
{
    console.log(inventoryItemSearch);
}

        // THESE FIRE ON LOAD //

async function getInventoryData()
{
    try
    {
        const result = await fetch("http://localhost:5000/getinventorydata",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}           
        });

        inventoryObject = await result.json(); 
        console.log('Returned Inventory Data: ', inventoryObject)
        
       
        // Iterate through the 'iventoryObject' and 'unshift()' the character name on the front of each array
        for (let character in inventoryObject)
        {
            for (let i = 0; i < inventoryObject[character].length; i++)
                {
                    inventoryObject[character][i].unshift(character);
                    inventoryItemSearch.push(inventoryObject[character][i])
                }  
         }
       
    }
    catch(err)
    {
        console.log(err)
    }
};

async function getCharactersAll()
{
    try
    {
        const result = await fetch("http://localhost:5000/getcharactersall",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}           
        });
        
        returnedData = await result.json(); 
        data = returnedData;
        
        console.log('Returned Data: ', returnedData)
    }
    catch(err)
    {
        console.log(err)
    }

    buildTable(data)
};

async function getSpellBookData()
{
    try
    {
        const result = await fetch("http://localhost:5000/getspellbookdata",
        {
            method: "GET",
            headers: {"Content-Type": "application/json"}           
        });

        returnedData = await result.json(); 
        spellBookData = returnedData;
        
        console.log('Returned spellBookData: ', spellBookData)
    }
    catch(err)
    {
        console.log(err)
    }
}

// I need to iterate over over the 'characterClass' and compare it to 'characterName'. If the spell in 'characterName' doesnt exist, then push spell onto 'missingSpells'


function getMissingSpells(characterName, characterClass)
{
    let missingSpells = [];
    let characterSpells = [];
    let classSpells = [];
    // Create the 'characterSpells' and 'classSpells' arrays
    // Iterate over the respective 'values' and 'push()' the spell names onto the arrays
    for (let i = 0; i < spellBookData[characterName].length; i++)
    {
        characterSpells.push(spellBookData[characterName][i][1]);
    }

    for (let i = 0; i < spellBookData[characterClass].length; i++)
    {
        classSpells.push(spellBookData[characterClass][i][1]);
    }

    // Now loop over the 'classSpells' array and check which ones dont have any matches in 'characterSpells'
    for (let i = 0; i < classSpells.length; i++)
    {
        if (characterSpells.indexOf(classSpells[i]) == -1)
        {
            missingSpells.push(classSpells[i]);
        }
    }

    console.log('missingSpells: ', missingSpells);
    buildMissingSpellsTable(missingSpells);

}

function buildMissingSpellsTable(missingSpells)
{
    let table = document.getElementById('missingSpellsTable');
    table.innerHTML = '';

    for (let i = 0; i < missingSpells.length; i++)
    {
        let row =  `<tr>
                        <td>${missingSpells[i]}</td>
                    </tr>`
        table.innerHTML += row;
    }  
}

async function getInventoryAndSpells(characterName)
{
    let body = 
    {  
       name: characterName,
       path: data[0].path  
    }
    
    try
    {
        const result = await fetch("http://localhost:5000/getinventoryandspells",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        
        // These next 2 lines of code are merely 'awaiting' the response from express and console logging the results
        returnedData = await result.json();
        console.log('returnedData: ', returnedData);

    }
    catch(err)
    {
        console.log(err)
    }
    
}

async function copyUi(characterName, characterClass)
{
    let body = 
    {  
       name: characterName ,
       class: characterClass   
    }
    console.log(body);
    try
    {
        const result = await fetch("http://localhost:5000/copyui",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        
        returnedData = await result.json();
        
    }
    catch(err)
    {
        console.log(err)
    }   
}

        // CRUD //

async function newCharacter()
{
    let body = 
    {   // Had to add a [0] onto 'data' because the 'getInput' function produces an array of objects, containing just 1 object.
       name: $("#name").val(),
       charclass: $("#class").val(),
       emuaccount: $("#emuaccount").val(),
       emupassword: $("#emupassword").val(),
       account: $("#account").val(),
       password: $("#password").val(),
       server: $("#server").val(),
       location: $("#location").val() 
    }
    data.push(body);
    console.log(data)
    try
    {
        const result = await fetch("http://localhost:5000/newcharacter",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        // These next 2 lines of code are merely 'awaiting' the response from express and console logging the results
        returnedData = await result.json();
        // 'push()' the returnedData onto the 'data' array
        
        
        console.log('returnedData: ', returnedData)
    }
    catch(err)
    {
        console.log(err)
    }
    buildTable(data);
};

async function editCharacter(characterName)
{  
  // Find index containing 'characterName', save snapshot,
  // delete entry with splice(), compare new 'edit' fields to snapshot, 
  // push 'edit' onto 'data', upload 'data'
  let characterIndex = data.findIndex((char) => char.name === characterName);
  let characterSnapshot = data.find((char) => char.name === characterName);
  data.splice(characterIndex, 1);

  let editedChar = 
  {
       name: $("#editname").val(),
       charclass: $("#editclass").val(),
       emuaccount: $("#editemuaccount").val(),
       emupassword: $("#editemupassword").val(),
       account: $("#editaccount").val(),
       password: $("#editpassword").val(),
       server: $("#editserver").val(),
       location: $("#editlocation").val() 
  }
  // Iterate through the 'editedChar' and if sometrhing is empty, use the 'snapshot' value instead
  for (let key in editedChar)
  {
    if (editedChar[key] === '' || null || undefined)
    {
        editedChar[key] = characterSnapshot[key];
    }
  }

  data.push(editedChar)

  try
  {
      const result = await fetch("http://localhost:5000/newcharacter",
      {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
      });
      // These next 2 lines of code are merely 'awaiting' the response from express and console logging the results
      returnedData = await result.json();
      // 'push()' the returnedData onto the 'data' array
      
      
      console.log('returnedData: ', returnedData)
  }
  catch(err)
  {
      console.log(err)
  }
  buildTable(data);

};

async function deleteCharacter(characterName)
{
    let characterIndex = data.findIndex((char) => char.name === characterName);
    data.splice(characterIndex, 1);
    let body = data;
    console.log(data)
    
    try
    { // The 'character' has already been deleted locally, but for reading sake, I will name the route as such anyways
        const result = await fetch("http://localhost:5000/deletecharacter",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        
        returnedData = await result.json();
        console.log('returnedData: ', returnedData)

    }
    catch(err)
    {
        console.log(err)
    }
    buildTable(data);
};

// Is necessary to link a specific character to the 'editCharacter(characterName)' parameter. Function renders the proper button inside the edit modal
function renderEditButton(characterName)
{
    let modalButton = document.getElementById('editbutton');
    modalButton.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" onclick="editCharacter('${characterName}')">submit</button>
   `
};

function renderMissingSpellsButton(characterName, characterClass)
{
    if (characterClass === 'Warrior' || characterClass === 'Rogue' || characterClass === 'Monk')
    {
        return;
    }

    let modalButton = document.getElementById('missingspellsbutton')
    modalButton.innerHTML = `
    <button type="button" onclick="getMissingSpells('${characterName}', '${characterClass}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#missingSpellsModal">
    Missing Spells
    </button>
    `
}

function renderGetInventoryAndSpellsButton(characterName)
{
    let modalButton = document.getElementById('getinventoryandspellsbutton')
    modalButton.innerHTML = `
    <button type="button" onclick="getInventoryAndSpells('${characterName}')" class="btn btn-primary">
    Get Inventory and Spells
    </button>
    `
}

function renderCopyUiButton(characterName, characterClass)
{
    let modalButton = document.getElementById('copyuibutton')
    modalButton.innerHTML = `
    <button type="button" onclick="copyUi('${characterName}', '${characterClass}')" class="btn btn-primary">
    Copy UI
    </button>
    `
}

function renderP99DirModal()
{
    let modalBody =document.getElementById('p99dirmodalbody');

    modalBody.innerHTML = `
    P99 directory path: ${data[0].path}
    <br>
    example: c:/programfiles/r99/ (please include the final "/")
    
    `
}
        // SEARCH TABLE //

// This function iterates over every object in the 'data' array, and filters it depending on the search parameters. It is fired on every key stroke.
function searchTable(value, data)
{
    let filteredData = [];

    for (let i = 0; i < data.length; i++)
    {
        value = value.toLowerCase();
        let name = data[i].name.toLowerCase();

        if (name.includes(value))
        {
            filteredData.push(data[i])
        }
    }
    return filteredData
};

// This function iterates over an array of arrays, filters depending on parameters
function searchTableInventory(value, data)
{
    let filteredData = [];
    for (let i = 0; i < data.length; i++)
    {
        for (let j = 0; j < data[i].length; j++)
        {
            if (data[i][j].includes(value))
            {
                filteredData.push(data[i])
                console.log('test(SearchTableInventory)')
            }
        }
    }
    return filteredData;
};

// This function iterates over an array of arrays, filters depending on parameters
function searchInventoryAll(value, data)
{
    
    let filteredData = [];
    for (let i = 0; i < data.length; i++)
    {
        for (let j = 0; j < data[i].length; j++)
        {
            if (data[i][j].includes(value))
            {
                filteredData.push(data[i])
                console.log('test(searchInventoryAll)')
            }
        }
    }
    return filteredData;
};

        // TABLE BUILDING //

function buildTable(data)
{
    let table = document.getElementById('myTable');

    table.innerHTML = ''

    for (let i = 1; i < data.length; i++)
    {
        let row = `<tr>
        <td><a href="javascript:void(0);"  onclick="setInventoryObjectName('${data[i].name}'), renderMissingSpellsButton('${data[i].name}', '${data[i].charclass}'), renderGetInventoryAndSpellsButton('${data[i].name}'), buildTableInventory(inventoryObject.${data[i].name}), renderCopyUiButton('${data[i].name}', '${data[i].charclass}')" data-bs-toggle="modal" data-bs-target="#inventoryModal">${data[i].name}</a></td>
                        <td>${data[i].charclass}</td>
                        <td>${data[i].account}</td>
                        <td>${data[i].password}</td>
                        <td>${data[i].emuaccount}</td>
                        <td>${data[i].emupassword}</td>
                        <td>${data[i].server}</td>
                        <td>${data[i].location}<a href="javascript:void(0);" onclick=deleteCharacter('${data[i].name}')><i class="fa-solid fa-trash-can"></i></a>
                        <a href="javascript:void(0);" onclick=renderEditButton('${data[i].name}')><i class="fa-solid fa-pencil" data-bs-toggle="modal" data-bs-target="#editCharacterModal"></i></a></td>
                    </tr>`
        table.innerHTML += row;
    }
    
};

// Builds table for the inventory modal
function buildTableInventory(data)
{

    let table = document.getElementById('inventoryTable');
    table.innerHTML = '';


    if (data === undefined)
    { 
        return;
    }

    

    for (let i = 0; i < data.length; i++)
    {
        let row =  `<tr>
                        <td>${data[i][1]}</td>
                        <td><a href="https://wiki.project1999.com/${data[i][2]}" target="_blank">${data[i][2]}</a></td>
                        <td>${data[i][3]}</td>
                        <td>${data[i][4]}</td>   
                    </tr>`
        table.innerHTML += row;
    }  
};

function buildTableItemSearch(data)
{
    let table = document.getElementById('itemSearchTable');
    table.innerHTML = '';

    for (let i = 0; i < data.length; i++)
    {
        let row =  `<tr>
                        <td>${data[i][0]}</td>
                        <td>${data[i][1]}</td>
                        <td><a href="https://wiki.project1999.com/${data[i][2]}" target="_blank">${data[i][2]}</a></td>
                        <td>${data[i][3]}</td>   
                        <td>${data[i][4]}</td>   
                    </tr>`
        table.innerHTML += row;
    }  
}


// This function sets the 'inventoryObjectName' variable upon opening a character's inventory modal

function setInventoryObjectName(name)
{
    inventoryObjectName = inventoryObject[name];
     if (inventoryObjectName === undefined)
     { 
        return;
     }
    // For loop starting at 1, because 0 is a redundant table header
    for (let i = 1; i < inventoryObjectName.length; i++)
    {
        inventoryObjectName[i].location = inventoryObjectName[i][0]
        inventoryObjectName[i].name = inventoryObjectName[i][1]
        inventoryObjectName[i].id = inventoryObjectName[i][2]
        inventoryObjectName[i].count = inventoryObjectName[i][3]
        
    }
        console.log(inventoryObjectName)
}

// Print table with the desired class
function listByClass()
{
   let classValue = $('#classdropdown').val();
    // Filter 'data' and create a new array
    classListData = data.filter((dat) => dat.charclass === classValue)
    buildTable(classListData);
}







