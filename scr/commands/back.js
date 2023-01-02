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

    await queue.playBackMusic()
  }
}

module.exports = CommandBack