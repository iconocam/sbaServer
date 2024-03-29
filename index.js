const express= require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app= express();
const PORT= 3001;

// Set view engine

app.set('view engine', 'ejs');


// app.set('views', path.join(__dirname, 'sbaserver', 'views'));
// Replaced line 10 code with code below to check if engine is set properly 
try {
const viewsDirectory = path.join(__dirname,  'views');
// DELETED 'sbaserver' in line 14 and it worked! thank you Malek!!
app.set('views', viewsDirectory);

console.log('Views directory:', viewsDirectory);
} catch (error) {
    console.error('Error setting views directory', error.message)
};

// redundant commented this out;
// console.log('Server started. Views directory:', app.get('views'));

const charactersInfo = require('./characters/charData');

const charBackgrounds = require('./lore/lore');

const characters = require('./characterList/allCharacters')
// I think this is redundant but i was trying something for the filtering feature
const charData = require('./characters/charData');




// note for errors :P
// taskkill /f /im node.exe in powershell for 'already in use error'

// Middleware

// Middleware for serving static files 
app.use(express.static(path.join(__dirname, 'public')));

const logger = (req, res, next) => {
    const time = new Date();

    console.log(
    `${time.toLocaleTimeString()}`
    );
    console.log(`Request was made at${req.method} ${req.url}`);
    console.log(1);
    next();
};


app.use(logger)

// Middleware for setting Content Security Policy
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https://encrypted-tbn0.gstatic.com");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // express.json allows us to send json data 



// GET Routes

app.get('/', (req, res) => {
    res.render('how');
});

app.route('/characterInfo')
.get ((req, res) => {
    res.json(charactersInfo);
});

app.post('/submitForm', (req, res) => {
    console.log('Request Body:', req.body);
    
    if (req.body) {
        const { name, email } = req.body;
        res.render('submission', { name, email });
    } else {
        res.status(400).send('Invalid form data');
    }
});

app.get('/charBackgrounds', (req, res) => {
    res.json(charBackgrounds);
});

// Trying to allow query paramaters for region and role, I don't think it works BUT it does allow for query search of 'characters' which then shows all the characters so that's simple enough but lets try again 

// app.get('/characters', (req, res) => {
//     const { region, role } = req.query;
//     const filteredCharacters = charData.filter(character => {
//         return (
//             (!region || charData.championRegion === charData.championRegion) &&
//             (!role || charData.championRole === charData.championRole)
//         );
//     });
//     res.json(filteredCharacters);
// });
// it still won't give me a singular character <:C
app.get('/characters', (req, res) => {
    const { id, region, role } = req.query;

    // Check if the 'id' parameter is provided
    if (id) {
        const characterById = charData.find(character => character.id === parseInt(id));
        
        if (characterById) {
            // If a character with the specified ID is found, return only that character
            res.json([characterById]);
        } else {
            // If no character is found with the specified ID, return an empty array
            res.json([]);
        }
    } else {
        // If 'id' parameter is not provided, filter characters based on 'region' and 'role'
        const filteredCharacters = charData.filter(character => (
            (!region || character.championRegion === region) &&
            (!role || character.championRole === role)
        ));
        res.json(filteredCharacters);
    }
});



// Patch 

app.patch('/characters/:id', (req, res) => {
    const characterId = parseInt(req.params.id);
    const { championName, championRegion, championRole, conviction } = req.body;

    // Find the character with the given ID
    const characterToUpdate = charactersInfo.find(character => character.id === characterId);

    if (characterToUpdate) {
        // Update properties if provided in the request body
        if (championName) characterToUpdate.championName = championName;
        if (championRegion) characterToUpdate.championRegion = championRegion;
        if (championRole) characterToUpdate.championRole = championRole;
        if (conviction) characterToUpdate.conviction = conviction;

        res.json(characterToUpdate);
    } else {
        
        res.status(404).send('Character not found');
    }
});

// Deletion
app.delete('/characters/:id', (req, res) => {
    const characterId = parseInt(req.params.id);
    
    // Find the index of the character with the given ID
    const characterIndex = charactersInfo.findIndex(character => character.id === characterId);

    // Check if the character with the given ID exists
    // if findIndex doesn't find a match, it returns -1. So, this condition checks if the character with the given ID exists in the array.
    if (characterIndex !== -1) {
        // Remove the character from the array
        charactersInfo.splice(characterIndex, 1);
        res.send(`Character with ID ${characterId} deleted successfully`);
    } else {
        // Character not found
        res.status(404).send('Character not found');
    }
});

// In case anything goes wrong within a route
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});













app.listen(PORT, () => {
    console.log(`Server is listening at: ${PORT}`)
})