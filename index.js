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
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



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
//     const { name, email } = req.body;
//     res.send(`Form submitted successfully. Name: ${name}, Email: ${email}`);
// });

app.get('/charBackgrounds', (req, res) => {
    res.json(charBackgrounds);
});















app.listen(PORT, () => {
    console.log(`Server is listening at: ${PORT}`)
})