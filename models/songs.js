const mongoose = require('mongoose');

  console.log('connecteddddd songs');
  const songSchema = new mongoose.Schema({
    authorName: String,
    trackName: String,
    sequence: [[{play: Boolean, ready: Boolean}]]
  })

  let Song = mongoose.model('Song', songSchema);

  const smiley = new Song({
    authorName: "Smiley",
    trackName: "Smiley's track",
    sequence: [
      [{play: false, ready: true}, {play: false, ready: true}, {play: false, ready: true}],
      [{play: false, ready: true}, {play: false, ready: true}, {play: false, ready: true}],
      [{play: false, ready: true}, {play: false, ready: true}, {play: false, ready: true}]
  ]
  })

  const fishy = new Song({
    authorName: "Fishy",
    trackName: "Fishy's track",
    sequence: [
      [{play: false, ready: true}, {play: false, ready: true}, {play: false, ready: true}],
      [{play: false, ready: true}, {play: false, ready: true}, {play: false, ready: true}],
      [{play: false, ready: true}, {play: false, ready: true}, {play: false, ready: true}]
  ]
  })

  Song.find({authorName: "Smiley"}, function(err, docs) {
    console.log("docsssssssssss", docs);
    console.log(docs);
  })


module.exports = Song = mongoose.model('song', songSchema)
