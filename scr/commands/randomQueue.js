const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/command')

class CommandRandomQueue extends Command {
    constructor() {
        super({
            name: "randomqueue",
            data: new SlashCommandBuilder()
                .setName('randomqueue')
                .setDescription('Ativa/Desativa modo que toca músicas aleatórias da queue'),
            type: 'music',
        })
    }

    async execute(client, interaction) {
        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction)

        const newState = queue.changeStateRandomQueue() ? "ativado" : "desativado"
        const embed = new MessageEmbed()
            .setColor(cor)
            .setAuthor({ name: `| 🔀 Queue aleatória ${newState}.`, iconURL: interaction.user.displayAvatarURL() })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}

module.exports = CommandRandomQueue