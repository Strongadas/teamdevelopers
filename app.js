require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const app = express()

//mongoose.connect('mongodb://localhost:27017/TdSendersDb')
mongoose.connect(process.env.MONGO_DB,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
})

app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.use(bodyParser.urlencoded({extended:true}))

const senderSchema = new mongoose.Schema({
    sender:String,
    email:String,
    message:String
})

const Sender = new mongoose.model('Sender', senderSchema)




app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/members',(req,res)=>{
    res.render('members')
})
app.get('/projects',(req,res)=>{
    res.render('projects')
})

app.post('/',(req,res)=>{

    const name = req.body.name
    const email = req.body.email
    const message = req.body.message

    const sender = new Sender({
        sender:name,
        email:email,
        message:message
    })
    sender.save((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log('saved to database')
            
        }
    })
   

    const transporter = nodemailer.createTransport({
        service:'gmail',
        port:456,
        secure:true,
        auth:{
            user: process.env.EMAIL_USER,
            pass:GMAIL_PASSWORD
        }
    })
    const emailMessage = {
        from:"Team Developers",
        to: "teamdevelopers72@gmail.com",
        subject: "Team Developers a new client " + name + " wants to get in touch with your Team",
        text: email + " Said: " + message
        

    }
    
    transporter.sendMail(emailMessage,(err, info)=>{
        
        if(err){
            console.log('error sending email' , err)
        }else{
            console.log('Email sent:', info.response)
            console.log(name)
            res.redirect('/')
            
        }
    })
})


const PORT = process.env.PORT || 3000
app.listen(PORT,(err)=>{
    if(err){
        console.log(err + "while sarting the server")
    }
    console.log('Server started on port 3000')
})