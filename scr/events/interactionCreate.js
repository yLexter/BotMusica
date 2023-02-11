const InteractionSlashCommand = require('../classes/SlashCommand')
const InteractionAutoComplete = require('../classes/AutoComplete')
const InteractionButton = require('../classes/ButtonInteraction')

module.exports = {
  name: 'interactionCreate',
  once: false,

  execute: async (client, interaction) => {

    if (interaction.isButton()) return new InteractionButton(client, interaction).main()
    if (interaction.isCommand()) return new InteractionSlashCommand(client, interaction).executeCommand()
    if (interaction.isAutocomplete()) return new InteractionAutoComplete(client, interaction).main()

  }
}