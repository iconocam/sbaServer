const express= require('express');
const path = require('path');
const app= express();
const PORT= 3001;

// Set view engine

app.set('view engine', 'ejs');


// app.set('views', path.join(__dirname, 'sbaserver', 'views'));
// Replaced line 10 code with code below to check if engine is set properly 
try {
const viewsDirectory = path.join(__dirname, 'sbaserver', 'views');

app.set('views', viewsDirectory);

console.log('Views directory:', viewsDirectory);
} catch (error) {
    console.error('Error setting views directory', error.message)
};
// redundant
// console.log('Server started. Views directory:', app.get('views'));

const charactersInfo = require('./characters/charData');

const charBackgrounds = require('./lore/lore');





// taskkill /f /im node.exe in powershell for 'already in use error'

// GET Routes

app.get('/', (req, res) => {
    res.render('how');
});

app.route('/characterInfo')
.get ((req, res) => {
    res.json(charactersInfo);
});

app.get('/charBackgrounds', (req, res) => {
    res.json(charBackgrounds);
});

// Middleware
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
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:");
    next();
});












app.listen(PORT, () => {
    console.log(`Server is listening at: ${PORT}`)
})