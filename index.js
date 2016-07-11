require('dotenv').config()
const http = require('http')
const xml2js = require('xml2js')
const fetch = require('node-fetch')
const fs = require('fs')
var parser = new xml2js.Parser()

var groupUrl = 'http://steamcommunity.com/groups/redditpd/memberslistxml/?xml=1'
var getGamesUrl = function (userId) {
  return `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.API_KEY}&steamid=${userId}&format=json&include_appinfo=1&include_played_free_games=1`
}

let memberList = []

var getGroupMembersList = function (url) {
  let request = http.get(url, (response) => {
    let xml = ''
    response.on('data', (chunk) => {
      xml += chunk
    })

    response.on('end', () => {
      parser.parseString(xml, (error, result) => {
        if (error) {
          return error
        } else {
          let steamIdArray = result.memberList.members[0].steamID64
          Array.prototype.push.apply(memberList, steamIdArray)
          if (result.memberList.nextPageLink) {
            getGroupMembersList(result.memberList.nextPageLink[0])
          } else {
            console.log('done!')
            Promise.resolve(memberList)
            .then((ids) => {
              return Promise.all(ids.map((id) => {
                return fetch(getGamesUrl(id))
                .then((text) => { return text.json() })
                .then((json) => { return json.response })
              }))
            })
            .then((data) => {
              fs.writeFile('membersList.json', JSON.stringify(data))
            })
          }
        }
      })
    })
  })
}

getGroupMembersList(groupUrl)
