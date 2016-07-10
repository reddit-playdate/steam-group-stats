const http = require('http')
const xml2js = require('xml2js')

var parser = new xml2js.Parser()

var groupUrl = 'http://steamcommunity.com/groups/redditpd/memberslistxml/?xml=1'
var groupMembers = []

function getGroupMembersList (url) {
  let request = http.get(url, (response) => {
    let xml = ''

    response.on('data', (chunk) => {
      xml += chunk
    })

    response.on('end', () => {
      parser.parseString(xml, (error, result) => {
        let steamIdArray = result.memberList.members[0].steamID64
        console.dir(steamIdArray)
        Array.prototype.push.apply(groupMembers, steamIdArray)
        if (result.memberList.nextPageLink) {
          getGroupMembersList(result.memberList.nextPageLink[0])
        } else {
          console.log(groupMembers.length)
          console.log('done!')
          return
        }
      })
    })
  })
}

getGroupMembersList(groupUrl)
