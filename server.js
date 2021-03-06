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
// const request = require('request');
//
// const corsOptions = {
//   origin: "https://harrypatrick94.github.io/RomeAudio-Frontend",
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

// app.options("*", cors())
// // app.use(cors({
//   'origin': "*",
//   "methods": "GET,HEAD,PUT,POST",
//   "preflightContinue": false
// }))
const PORT = process.env.PORT || 1337
const db = process.env.MONGODB_URL || config.get('mongoURI');
// const db = config.get('mongoURI')
//mongoose connect
app.use(cors());
// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       useCreateIndex: true
//     });
//     console.log("MongoDB is Connected...");
//   } catch (err) {
//     console.error("can not connect to atlas ", err.message);
//     process.exit(1);
//   }
// };

mongoose
  .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
      })
  .then(() => console.log("mongodb connected"))
  .catch( err => console.log("error connection to atlas: ", err))


  // app.use('/api/songs', songs)
  const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  // bodyParser middle useNewUrlParser
  // module.exports = server
  app.use(bodyParser.json())
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   next();
  // });

//import modules
const Song = require('./models/songs')
const User = require('./models/user')

// SONGS CRUD
//save single song
app.post('/user', (req, res) => {


  console.log("Sequence over herererere: ", req.body.song);
  console.log("authorName: ", req.body);

  User.findOneAndUpdate(

    {_id: req.body.userId},

    {$push: {"beatz": {
      authorName: req.body.authorName,
      trackName: req.body.trackName,
      song: req.body.song
    }

    }},
    { safe: true, upsert: true },
    function (err, model) {
      if (err) {
        //console.log(err);
        return res.send(err);
      }
      return res.json(model);
    }
  )

})
 // get all songs
app.get('/songs', function(req, res){
  User.findOne({_id: req.body.userId}, (err, response) => {
    if (err) {
      return console.log(err);
    }

    console.log("responseeeeee: ", response);
  })

})
// get track by name
app.get('/user/:trackName', auth, (req, res) => {

  let trackName = req.params.trackName;
  console.log("Top of get track: ", trackName);
  User.findById(req.user.id)
    .select('-password')
    .then(user => {
      console.log("im down here", user);

      res.json(user)
    })


  }) // db.collection songs

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
  console.log("trying to sign in over herer please LOOOOOOOKKKK ATTTTT MMMEEEEE");
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


const io = require('socket.io')(server)

io.on('connection', socket => {
  console.log('got that connection yo');
  setInterval(() => {
    console.log("connected");
    socket.emit('ping', {msg: 'hi there'})
  }, 2000)
})
