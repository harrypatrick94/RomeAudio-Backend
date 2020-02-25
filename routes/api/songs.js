const express = require('express');
//use express router
const router = express.Router();

//song model
const Song = require('../../models/songs')
// @route GET api/songs
// @desc Get All Songs
// @access Public
router.get('/', (req, res) => {
  Song.find()
  .then(songs => {
    console.log("songs: ", songs)
    res.json(songs)})
})


module.exports = router;
