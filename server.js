// require the packages that are needed
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const songs = require('./routes/api/songs')
const auth = require('./auth')
const PORT = process.env.PORT || 1337

const db = config.get('mongoURI')
//mongoose connect
mongoose
  .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
      })
  .then(() => console.log("mongodb connected"))
  .catch( err => console.log("err: ", err))

  app.use(cors());
  // app.use('/api/songs', songs)
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  // bodyParser middle useNewUrlParser
  app.use(bodyParser.json())

//import modules
const Song = require('./models/songs')
const User = require('./models/user')

// SONGS CRUD
//save single song
app.post('/user', (req, res) => {
  User.findbyIdandUpdate(
    req.params.id,

    
  )


  // updateOne({ id: req.user.id }, { $set: { name: 'foo' } }
  // const song = new Song({
  //   _id: new mongoose.Types.ObjectId(),
  //   authorName: req.body.authorName,
  //   trackName: req.body.trackName,
  //   sequence: req.body.song
  // })
  // song
  //   .save()
  //   .then(result => {
  //     console.log(result);
  //     res.status(201).json({
  //       message: "Handling POST requests to /products",
  //       createdProduct: result
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });

})
 // get all songs
app.get('/songs', function(req, res){
  Song.find({})
  .then(function(response){
    res.json(response)
  })
  .catch(function(err){
    res.json(err)
  })
  // res.send('the homepage is working')
})
// get track by name
app.get('/drum-machine/:trackName', (req, res) => {

    Song.find({trackName: req.params.trackName}, (err, result) => {
    if (err) {
      return console.log('song find error', err);
    }
    res.json(result)
  }) // db.collection songs

}) //app.get track name
// SONGS CRUD

// users CRUD
// create new user
// req.body (body parser)
app.post('/register', (req, res) => {
  const {userName, email, password} = req.body
  // small validation
  if (!userName || !email || !password) {
    return res.status(400).json({msg: "Please enter all fields"})
  }
  User.findOne({email})
    .then(user => {
      if(user) {
        return res.status(400).json({ msg: "User already exists"})
      }// if

      const newUser = new User({
        userName,
        email,
        password
      }) // new user

      // create password hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                {id: user.id},
                config.get('jwtsecret'),
                {expiresIn: 7200},
                (err, token) => {
                  if (err) throw err
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      userName: user.userName,
                      email: user.email
                  } // user
                }) // res .json
              } //jwt callback
            ) // sign
          }) // then
        }) // hash
      }) // bcrypt
    }) // then
  // res.send('register')

}) // post

// sign in
app.post('/signin', (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(400).json({msg: "Please enter all fields"})
  }

  User.findOne({email})
    .then(user => {
      if(!user) {
        return res.status(400).json({ msg: "User does not exists"})
      }// if

      //validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({msg: 'Invlaid credentials'});

          jwt.sign(
              {id: user.id},
              config.get('jwtsecret'),
              {expiresIn: 7200},
              (err, token) => {
                if (err) throw err
                res.json({
                  token,
                  user: {
                    id: user.id,
                    userName: user.userName,
                    email: user.email
                } // user
              }) // res .json
            } //jwt callback
          ) // sign
        })
    }) // then

})

//get user data
app.get('/user', auth, (req, res) => {
  console.log("im up here");
  User.findById(req.user.id)
    .select('-password')
    .then(user => {
      console.log("im down here", user);
      res.json(user)
    })
})
