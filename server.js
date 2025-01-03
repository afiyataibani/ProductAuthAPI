const express = require('express')
const path = require('path')
const db = require('./config/database')
const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

const app = express()

const port = 8081

app.set('view engine','ejs')

app.use(cookieParser())
app.use(express.static(path.join(__dirname + '/assets')))
app.use('/uploads',express.static(path.join(__dirname+'/uploads')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });
  

app.use('/',require('./routers'))

app.listen(port,(err)=>{
    if(!err){
        db()
        console.log('Server is running on\nhttp://localhost:'+port)
    }
})