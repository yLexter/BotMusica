const { Client, Intents, Collection } = require('discord.js')
const { MessageEmbed } = require("discord.js");
const { channelError } = require('../jsons/config.json')

const configClient = {
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
}

class CustomClient extends Client {
    constructor() {
        super(configClient)
        this.commands = new Collection()
        this.cooldown = new Collection()
        this.queues = new Collection()
        this.cor = '#4B0082'
        this.timeCooldown = 2.5
    }

    async startBot() {
        super.login(process.env.TOKEN)
    }

    sendError(interaction, e) {
        const { member, user, commandName } = interaction
        const helpMsg = new MessageEmbed()
            .setColor(this.cor)
            .setDescription(`**Comando => ${commandName}**\n\n` + '```js\n' + `- ${e.stack}\n` + '```')
            .addFields(
                { name: 'Guild', value: member.guild.name, inline: true },
                { name: 'User', value: `<@${user.id}>`, inline: true }
            )
        return this.channels.cache.get(channelError)?.send({ embeds: [helpMsg] })
    }

    embedError(interaction, error) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`❌ ${error}`)

        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

}

module.exports = CustomClient
