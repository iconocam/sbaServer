const express= require('express');
const app= express();
const PORT= 8000;


const charactersInfo = require('./characters/characters');

// Finish this later.
// app.engine("", (filePath, options, callback) => {

// })


// Middleware
const logger = (req, res, next) => {
    console.log(`Request was made at${req.method} ${req.url}`);
    console.log(1);
    next();
};

app.use(logger)

// GET Routes 
app.get('/', (req, res) => {
    res.send('Hello Human');
});

app.route('/characters')
.get ((req, res) => {
    res.json(charactersInfo);
});














app.listen(PORT, () => {
    console.log(`Server is listening at: ${PORT}`)
})