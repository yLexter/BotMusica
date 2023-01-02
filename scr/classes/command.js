const { MessageEmbed } = require('discord.js')
const Base = require("./base")

class Command extends Base {
    constructor(options) {
        super()
        this.name = options.name
        this.data = options.data
        this.type = options.type
        this.cooldown = options.cooldown || 2
        this.cor = options.cor || 'RANDOM'
    }

    notQueue(interaction) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`❌ Não existe uma queue ativa no servidor`)

        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    sucessMessage(interaction, message) {
        const embed = new MessageEmbed()
            .setDescription(`✅ ${message}`)
            .setColor("GREEN")

        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

}

module.exports = Command