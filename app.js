const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const app = express()

//mongoose.connect('mongodb://localhost:27017/TdSendersDb')
mongoose.connect("mongodb+srv://Anacleto:Strongadas@cluster0.odsr23g.mongodb.net/teamDB")

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

app.post('/', async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Create a new Sender instance
      const sender = new Sender({
        sender: name,
        email,
        message,
      });
  
      // Save the sender's information to the database
      await sender.save();
      console.log('Saved to Db')
  
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'teamdevelopers72@gmail.com',
          pass: 'tpqe yuyw rvnt cxmi',
        },
      });
  
      // Compose the email message
      const emailMessage = {
        from: 'Team Developers <teamdevelopers72@gmail.com>',
        to: 'teamdevelopers72@gmail.com',
        subject: `New client ${name} wants to get in touch with your Team`,
        text: `${email} said: ${message}`,
      };
  
      // Send the email
      const info = await transporter.sendMail(emailMessage);
  
      console.log('Email sent:', info.response);
      console.log(name);
  
      // Redirect the user after successful submission
      res.redirect('/');
    } catch (err) {
      console.error('Error:', err);
      // Handle errors here, e.g., sending an error response
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