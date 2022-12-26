const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require('../classes/command')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Youtube = require("youtube-sr").default;
const lyricsFinder = require('lyrics-finder');
const { geral } = require("../enums/index")

class CommandLyrics extends Command {
    constructor() {
        super({
            name: "lyrics",
            data: new SlashCommandBuilder()
                .setName('lyrics')
                .setDescription('Mostra a lyrics de uma música')
                .addStringOption(option =>
                    option
                        .setName('song')
                        .setDescription('Informe uma música')
                        .setRequired(true)
                ),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true })

        const row = () => {
            return new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(geral.translateLyrics)
                        .setEmoji('🛠')
                        .setLabel("Traduzir")
                        .setStyle('PRIMARY'),
                )

        }

        const { Utils: { formattedSongTitle } } = this
        const { cor } = client
        const userMusic = interaction.options.getString('song')
        const lyrics = await lyricsFinder(userMusic)
        const songTitle = async (query) => {
            const song = await Youtube.searchOne(query).catch(() => null)
            return !song ? `Lyrics` : formattedSongTitle(song.title)
        }

        if (!lyrics)
            throw new Error(`Lyrics não encontradas`);

        const title = await songTitle(lyrics)

        const embed = new MessageEmbed()
            .setColor(cor)
            .setTitle(title)
            .setDescription(lyrics.maximumChar(4000, true))
        return interaction.editReply({
            embeds: [embed],
            ephemeral: true,
            components: [row()]
        })

    }
}

module.exports = CommandLyrics 