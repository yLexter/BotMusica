const { MessageEmbed } = require("discord.js");
const Command = require('../classes/command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandShuffle extends Command {
    constructor() {
        super({
            name: "shuffle",
            data: new SlashCommandBuilder()
                .setName('shuffle')
                .setDescription('Embaralha a queue atual'),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction);


        await queue.shuffle()

        const helpMsg = new MessageEmbed()
            .setColor(cor)
            .setAuthor({ name: `| 🔀 Queue embaralhada`, iconURL: interaction.user.displayAvatarURL() })
        return interaction.reply({ embeds: [helpMsg] })
    }
}

module.exports = CommandShuffle