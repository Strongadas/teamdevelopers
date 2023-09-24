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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port:456,
    secure:true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });


app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/members',(req,res)=>{
    res.render('members')
})
app.get('/projects',(req,res)=>{
    res.render('projects')
})

app.post('/', async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Save sender data to MongoDB
      const sender = new Sender({ name, email, message });
      await sender.save((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("saved to db")
        }
      });
  
      // Send email
      const emailMessage = {
        from: 'Team Developers',
        to: 'teamdevelopers72@gmail.com',
        subject: `New client ${name} wants to get in touch with your Team`,
        text: `${email} said: ${message}`,
      };
  
      await transporter.sendMail(emailMessage);
      console.log('Email sent');
  
      res.redirect('/');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  });

const PORT = process.env.PORT || 3000
app.listen(PORT,(err)=>{
    if(err){
        console.log(err + "while sarting the server")
    }
    console.log('Server started on port 3000')
})