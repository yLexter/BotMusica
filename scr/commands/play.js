const { MessageEmbed } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Queue = require('../classes/Queue')
const { songType } = require("../enums/index")

class CommandPlay extends Command {
    constructor() {
        super({
            name: "play",
            data: new SlashCommandBuilder()
                .setName('play')
                .setDescription('toca uma música desejada')
                .addStringOption(option =>
                    option
                        .setName('search')
                        .setDescription('Informe uma música para tocar')
                        .setRequired(true)
                ),
            type: 'music',
            cooldown: 3
        })
    }

    async execute(client, interaction) {
        const { cor } = client
        const query = interaction.options.getString('search');

        try {
            await interaction.deferReply()

            if (!interaction.member.voice.channel)
                throw new Error("Você precisa entrar em um canal de voz primeiro.")

            const queue = client.queues.get(interaction.guild.id) || new Queue(client, interaction)
            const data = await Queue.songSearch(query, interaction)

            const typesData = {
                [songType.track]: async () => queue.play(data, interaction),
                [songType.playlist]: async () => {
                    const { playlist, owner, songs, totalSongs, durationFormatted, images, color } = data
                    const embedPlaylist = new MessageEmbed()
                        .setColor(color || cor)
                        .setDescription(`🅿️ **Playlist: [${playlist.name}](${playlist.url})\n🆔 Autor: [${owner.name}](${owner.url})\n📑 Total: ${totalSongs}\n🕑 Duração: ${durationFormatted}**`)
                        .setAuthor({ name: '| 🎶 Playlist adicionada', iconURL: interaction.user.displayAvatarURL() })
                    if (images) embedPlaylist.setThumbnail(images)

                    interaction.editReply({ embeds: [embedPlaylist] })

                    queue.play(songs)
                }
            }

            typesData[data.type]()

        } catch (e) {
            interaction.editReply({ content: `Error => ${e.message}` }).catch(() => { })
            client.queues.delete(interaction.guild.id)
        }
    }
}

module.exports = CommandPlay


