const Command = require('../classes/command')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const wait = require('util').promisify(setTimeout);
const geral = require("../enums/geral")

class CommandHostInfo extends Command {
    constructor() {
        super({
            name: "botinfo",
            data: new SlashCommandBuilder()
                .setName('botinfo')
                .setDescription('Informações do bot da host'),
            type: "owner",
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true })

        const row = () => {
            return new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(geral.restartBot)
                        .setEmoji('🛠')
                        .setLabel("Reinciar")
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(geral.stopBot)
                        .setEmoji('🔧')
                        .setLabel("Parar")
                        .setStyle('DANGER')
                )
        }

        const { SquareApi } = this
        const { cor } = client
        const { response: { cpu, ram, storage, network, requests } } = await SquareApi.getStatus()

        await wait(1 * 1000)

        const logs = await SquareApi.getLogs()
        const timeOnline = Math.floor((Date.now() - client.uptime) / 1000)

        const embed = new MessageEmbed()
            .setAuthor({ name: `| ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .setColor(cor)
            .setTitle("Registro de Logs")
            .setDescription(`\`\`\`txt\n${logs.maximumChar(3000, true)}\n\`\`\``)
            .addFields(
                { name: `💻 Cpu`, value: `${cpu}`, inline: true },
                { name: `🛠 Ram`, value: `${ram}/${SquareApi.totalRam}MB`, inline: true },
                { name: `📤 Network`, value: `${network.total}`, inline: true },
                { name: `🗄 Storage`, value: `${storage}`, inline: true },
                { name: `⏰ Uptime`, value: `<t:${timeOnline}:R>`, inline: true },
                { name: `📠 Requests`, value: `${requests}`, inline: true },
            )

        return interaction.editReply({
            embeds: [embed],
            components: [row()]
        })
    }

}

module.exports = CommandHostInfo
