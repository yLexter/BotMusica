const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/Command')
class CommandNowPlaying extends Command {
    constructor() {
        super({
            name: "nowplaying",
            data: new SlashCommandBuilder()
                .setName('nowplaying')
                .setDescription('Exibe a música atual'),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        const { cor } = client
        const queue = client.queues.get(interaction.guild.id)
        const song = queue?.songs[0]

        if (!queue)
            return super.notQueue(interaction);

        const embed = new MessageEmbed()
            .setColor(cor)
            .setDescription(`[${song.title}](${song.url})\n${queue.getProgressBar()}`)
            .setAuthor({ name: `| 🎶 Tocando Agora `, iconURL: interaction.user.displayAvatarURL() })
        return interaction.reply({ embeds: [embed], })

    }
}

module.exports = CommandNowPlaying