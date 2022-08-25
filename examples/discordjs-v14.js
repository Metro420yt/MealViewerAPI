/*
    this example uses the daily function
    filters some results
    then sends an embed to users of the menu

    discord.js version: 14
    package.json: "discord.js": "~14.2.0"
*/

const { EmbedBuilder } = require('discord.js')
const { Client } = require('mealviewerapi')
const mv = new Client('<mySchool>', { date: true, url: true, daily: true })

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
        const embed = new EmbedBuilder({
            author: { name: new Date(data.date).toLocaleDateString() },
            title: 'Todays Menu',
            url: data.url
        })

        // adds a feild of any menu that is returned
        const fields = []
        for (const key in data.menu) {
            if (['date'].includes(key)) continue;
            var values = data.menu[key].filter(v => !filter.includes(v)), extra = 0

            while (values.join('\n').length > 900) {
                values = values.slice(-1)
                extra++
            }

            if (extra > 0) values.push(`*(${extra} more)*`)
            fields.push({ name: key, value: values.join('\n') })
        }
        embed.addFields(fields)

        // sets the embed to all users in sendList
        for (const id of sendList) {
            client.users.fetch(id).catch(e => console.log('couldnt get user')).then(user => user.send({ embeds: [embed] }))
        }
    })
}