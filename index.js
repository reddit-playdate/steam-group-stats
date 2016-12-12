require('dotenv').config()
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const xml2js = require('xml2js').parseString
const xmlUri = process.env.XML_PATH

mongoose.connect(process.env.DB_URI)
let Member = mongoose.model('Member', { steamId: String })

function userGamesPath (steamId) {
  return 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/' +
  `?key=${process.env.API_KEY}&steamid=${steamId}` +
  '&format=json&include_appinfo=1&include_played_free_games=1'
}

fetch(xmlUri)
  .then(res => { return res.text() })
  .then(xml => {
    xml2js(xml, function (err, result) {
      if (err) {
        console.log(err)
        return false
      } else {
        console.dir(result)
        return true
      }
    })
  })
