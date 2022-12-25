const { MessageEmbed, CommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/command')
const Client = require('../classes/client')

class CommandBack extends Command {
  constructor() {
    super({
      name: "back",
      data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Volta a tocar a música anterior'),
      type: 'music',
    })
  }

  /**
     * @param {Client} client
  */

  async execute(client, interaction) {
    const { cor } = client
    const queue = client.queues.get(interaction.guild.id);

    if (!queue)
      return super.notQueue(interaction)

    const song = await queue.playBackMusic()
    
    const embedSucess = new MessageEmbed()
      .setColor(cor)
      .setDescription(`[${song.title}](${song.url}) [${song.durationFormatted}]`)
      .setAuthor({ name: '| ⏪ Retornada', iconURL: interaction.user.displayAvatarURL() })
    return interaction.reply({ embeds: [embedSucess] })

  }
}

module.exports = CommandBack