const express = require('express');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const app = express();
const port = 5000;
const path = require('path');
// Use fs.readFile to read the JSON file
// Hopefully the synchronous doesn't break the APP

let db = fs.readFileSync('db.json'); 
let dbData = JSON.parse(db);

// let dbData = JSON.parse(db)
// This next line makes the entire folder 'static'
// I believe this line causes express to default server 'index.html' upon loading the port in the browser
app.use(express.static('.'));
// This next allows express to parse the incoming JSON object into javascript (I think)
app.use(express.json());
// This next line launches the server on a port
app.listen(port, () => console.log(`Server has started on port: ${port}`));

// CRUD //
app.get('/getcharactersall', async (req, res) =>
{
    
    res.send(JSON.stringify(dbData))
    
})

app.post('/newcharacter', async (req, res) =>
{
    let {name} = req.body[req.body.length -1];
    console.log(name)
    // Overwrite the entire 'json.db' file with 'dbData'
    fs.writeFileSync('db.json', JSON.stringify(req.body, null, 4), (err) =>
    {
        if (err)
        {
            console.log(err.message);
        }
        else
        {
            console.log('added');
            res.send(JSON.stringify('success'))
        }
    })
    // This next code imports the '.bat' file as a string, and appends a new line to it
    
    let newBatLine = `copy C:\\r99\\${name} C:\\users\\mikeg\\desktop\\projects\\mikesprojects\\stables\\inventory\\${name}.txt /y `
    let batString = fs.readFileSync('inventorycopy.bat', "utf8");
    batString = batString + '\n' + newBatLine;
    fs.writeFileSync('inventorycopy.bat', batString);
    
})

app.post('/deletecharacter', async (req, res) =>
{
    fs.writeFile('db.json', JSON.stringify(req.body, null, 4), (err) =>
    {
        if (err)
        {
            console.log(err.message);
        }
        else
        {   // Even tho im overwriting the entire JSON, I'm printing 'char deleted' anyways
            console.log('character deleted');
            res.send(JSON.stringify('deleted'));
        }
    })
})


app.get('/getinventorydata', async (req, res) =>
{
    
    fs.readdir('./inventory', (error, files) =>
    {
        if (error)
        {
            console.log(error)
        }
        
        // Save 'files' imprint as 'inventoryFiles'
       let inventoryFiles = files;

       // Remove '.txt' from file names/element
       let inventoryFilesKeys = inventoryFiles.map(file => file.replace('.txt', ""));
       let inventoryFilesObject = {};

       // Creates an object, with the file names as keys
       inventoryFilesKeys.map(file => inventoryFilesObject[file] = file);
       
       // Iterate through the object and fill in the values as desired
       for (let key in inventoryFilesObject)
       {   
        // Set the 'value' as the correct file
        inventoryFilesObject[key] = fs.readFileSync(`./inventory/${key}.txt`, "utf8");
        inventoryFilesObject[key] = inventoryFilesObject[key].split(/\r?\n/);
        inventoryFilesObject[key] = inventoryFilesObject[key].map(p => [p]);
        inventoryFilesObject[key] = inventoryFilesObject[key].map(sub => sub.flatMap(element => element.split('\t')));
       }
       
       res.send(JSON.stringify(inventoryFilesObject));
    })  
})

app.get('/getspellbookdata', async (req, res) =>
{
    
    fs.readdir('./spells', (error, files) =>
    {
        if (error)
        {
            console.log(error)
        }
        
        // Save 'files' imprint as 'spellBookData'
       let spellBookData = files;
       
       // Remove '.txt' from file names/element
       let spellBookDataKeys = spellBookData.map(file => file.replace('.txt', ""));
       let spellBookDataObject = {};
       let spellBookDataObjectFinal = {};
       // Creates an object, with the file names as keys
       spellBookDataKeys.map(file => spellBookDataObject[file] = file);
       spellBookDataKeys.map(file => spellBookDataObjectFinal[file] = []);
       
       // Iterate through the object and fill in the values as desired
       for (let key in spellBookDataObject)
       {   
        // Set the 'value' as the correct file
        spellBookDataObject[key] = fs.readFileSync(`./spells/${key}.txt`, "utf8");
        spellBookDataObject[key] = spellBookDataObject[key].split(/\r?\n/);
        
        spellBookDataObject[key] = spellBookDataObject[key].map(p => [p]);
        spellBookDataObject[key] = spellBookDataObject[key].map(sub => sub.flatMap(element => element.split('\t')));
       }

       // Iterate through 'keys', if [classSpells] { split() }
       for (let key in spellBookDataObject)
       {
        if (key === 'Cleric' || key === 'Druid'|| key === 'Enchanter' || key === 'Mage' || key === 'Necromancer' || key === 'Paladin' || key === 'Shadowknight' || key === 'Shaman' || key === 'Wizard' || key === 'Bard' || key === 'Ranger')
        {
            for (let i = 0; i < spellBookDataObject[key].length; i++)
            {
                spellBookDataObject[key][i] = spellBookDataObject[key][i].map(array => array.split(','))
                
            }
        }
       }
       //Have to flatten after the previous loop
       for (let key in spellBookDataObject)
       {
        if (key === 'Cleric' || key === 'Druid'|| key === 'Enchanter' || key === 'Mage' || key === 'Necromancer' || key === 'Paladin' || key === 'Shadowknight' || key === 'Shaman' || key === 'Wizard' || key === 'Bard' || key === 'Ranger')
        {
            for (let i = 0; i < spellBookDataObject[key].length; i++)
            {
                spellBookDataObject[key][i] = spellBookDataObject[key][i].flat();
            }
        }
       }
    
       console.log(spellBookDataObject.Necromancer)
       res.send(JSON.stringify(spellBookDataObject));
    })  
})

app.post('/getinventoryandspells', async (req, res) =>
{   
    let spellbookName = `${req.body.name}spells`;
    let spellbookFile;
    let inventoryFile;
    let path = req.body.path;

    try 
    {
        inventoryFile = fs.readFileSync(`${path}${req.body.name}`, "utf8");
    }
    catch (err)
    {
    }
    
    try 
    {
        spellbookFile = fs.readFileSync(`${path}${spellbookName}`, "utf8",);
    }
    catch (err)
    {
    }
    
    try
    {
        fs.writeFileSync(`./inventory/${req.body.name}.txt`, inventoryFile);
    }
    catch (err)
    {
    }
    
    try
    {
        fs.writeFileSync(`./spells/${req.body.name}.txt`, spellbookFile);
    }
    catch (err)
    {
    }
    

    res.send(JSON.stringify('success'));
})

app.post('/copyui', async (req, res) =>
{
    let uiFile1;
    let uiFile2;
    let path = req.body.path

    try 
    {
        uiFile1 = fs.readFileSync(`./classUIs/${req.body.class}_P1999PVP.ini`);
        
    }
    catch (err)
    {
        console.log('error reading first file: ' , err);
    }

    try 
    {
        uiFile2 = fs.readFileSync(`./classUIs/UI_${req.body.class}_P1999PVP.ini`);
    }
    catch (err)
    {
        console.log('error reading second file: ' , err);
    }

    try
    {
    
        fs.writeFileSync(`${path}${req.body.name}_P1999PVP.ini`, uiFile1);
    }
    catch (err)
    {
        console.log('error writing first file: ', err);
    }
    
    try
    {
        fs.writeFileSync(`${path}UI_${req.body.name}_P1999PVP.ini`, uiFile2);
    }
    catch (err)
    {
        console.log('error writing second file: ', err);
    }

});

app.post('/p99dirset', async (req, res) =>
{
    // Overwrite the entire 'json.db' file with 'dbData'
    fs.writeFileSync('db.json', JSON.stringify(req.body, null, 4), (err) =>
    {
        if (err)
        {
            console.log(err.message);
        }
        else
        {
            console.log('P99 dir changed');
            res.send(JSON.stringify('success'))
        }
    })
});