// Imports
const express = require('express')
const app = express()
const port = 3001



// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views

app.set('views', './views')
app.set('view engine', 'ejs')


app.get('', (req, res) => {
    res.render('index', { text: 'This is EJS' })
})

app.get('/commands', (req, res) => {
    res.render('commands', { text: 'Commands' })
})
app.get('/leaderboard', (req, res) => {
    res.render('leaderboard', { text: 'Commands' })
})





// Listen on port 3001
app.listen(port, () => console.info(`Listening on port ${port}`))