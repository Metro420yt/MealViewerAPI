/*
    this example uses the daily function
    filters some results
    then sends an embed to users of the menu

    discord.js version: ~13
    package.json: "discord.js": "~13.5.1"
*/

const { MessageEmbed } = require('discord.js')
const { Client } = require('mealviewerapi')
const mv = new Client('mySchool', {date: true, url: true, daily: true})

const filter = [
    'grape jelly',
    'syrup',
    'milk variety',
    'juice variety',
    'fresh fruit variety',
    'honey mustard',
    'milk variety'
]
const sendList = [
    '<userId>'
]

module.exports = (client) => {
    mv.daily.on('newMenu', async data => {

        // sets up the embed
        const embed = new MessageEmbed({
            author: {name: data.date.split('T')[0].split('-').join('/')},
            title: 'Todays Menu',
            url: data.url
        })

        // adds a feild of any menu that is returned
        for (const key in data.menu) {
            if (['date'].includes(key)) continue;
            var values = data.menu[key].filter(v=>!filter.includes(v)), extra = 0

            while (values.join('\n').length > 900) {
                values = values.slice(-1)
                extra++
            }

            if (extra > 0) values.push(`*(${extra} more)*`)
            embed.addField(key, values.join('\n'))
        }

        // sets the embed to all users in sendList
        for (const id of sendList) {
            client.users.fetch(id).catch(e => console.log('couldnt get user')).then(user => user.send({ embeds: [embed] }))
        }
    })
}