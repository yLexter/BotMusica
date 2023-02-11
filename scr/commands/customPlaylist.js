const { MessageEmbed, } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/Command')
const Queue = require('../classes/queue')
const { songType } = require("../enums/index")

class CustomPlaylist extends Command {

   constructor() {
      super({
         name: 'customplaylist',
         data: new SlashCommandBuilder()
            .setName('customplaylist')
            .setDescription('Personaliza sua propia playlist.')
            .addSubcommand(subcommand =>
               subcommand
                  .setName('show')
                  .setDescription('Mostra a sua custom playlist.')
            ).addSubcommand(subcommand =>
               subcommand
                  .setName('play')
                  .setDescription('Coloca sua custom playlist na queue do servidor.')
            ).addSubcommand(subcommand =>
               subcommand
                  .setName('delete')
                  .setDescription('Deleta uma música da sua custom playlist.')
                  .addStringOption(option =>
                     option
                        .setName('song')
                        .setDescription('Informe a url da música que deseja deletar.')
                        .setRequired(true)
                  )
            )
            .addSubcommand(subcommand =>
               subcommand
                  .setName('add')
                  .setDescription('Adiciona uma música da sua custom playlist.')
                  .addStringOption(option =>
                     option
                        .setName('search')
                        .setDescription('Informe uma url de playlist/vídeo ou nome da música')
                        .setRequired(true)
                  ))
            .addSubcommand(subcommand =>
               subcommand
                  .setName('deleteall')
                  .setDescription('Deleta toda sua custom playlist.')
            ),
         type: 'music',
         cooldown: 5,
      })

   }

   async execute(client, interaction) {
      const { cor } = client
      const { Database, SongsPagination, sucessMessage } = this
      const { customPlaylist } = await Database.fecthUser(interaction)
      const limiteSongs = 1000
      const subCommand = interaction.options.getSubcommand()
      const subCommands = {
         'show': showCustomPlaylist,
         'delete': deleteSongFromCustomPlaylist,
         'play': playCustomPlaylist,
         'add': addInCustomPlaylist,
         'deleteall': deleteCustomPlaylist,
      }

      if (!customPlaylist.length && subCommand != "add")
         throw new Error('Não exite nenhuma música em sua custom playlist.');

      await interaction.deferReply({ ephemeral: subCommand != 'play' })
      await subCommands[subCommand]()

      async function showCustomPlaylist() {

         const page = new SongsPagination({
            title: "📝 Custom Playlist",
            finishCommand: 100,
            amountPerPage: 10,
            interaction: interaction,
            songs: () => customPlaylist,
         })

         return page.startPagination()
      }

      async function deleteSongFromCustomPlaylist() {
         const urlSong = interaction.options.getString('song');
         const songRemoved = customPlaylist.find(song => song.url == urlSong)

         if (!songRemoved)
            throw new Error('Não encontrei a música que procura, tente novamente.')

         await Database.user.findOneAndUpdate(
            { id: interaction.user.id },
            { $pull: { customPlaylist: songRemoved } }
         )

         return sucessMessage(interaction, `A track [${songRemoved.title}](${songRemoved.url}) foi deletada com sucesso!`)
      }

      async function playCustomPlaylist() {
         if (!interaction.member.voice.channel)
            throw new Error('Você precisa estar em um canal de voz primeiro!');

         let queue = client.queues.get(interaction.guild.id)

         if (queue) {
            queue.play(customPlaylist)

            return sucessMessage(interaction, `Playlist adicionada com sucesso`)
         }

         queue = new Queue(client, interaction)

         queue.play(customPlaylist, interaction)
      }

      async function addInCustomPlaylist() {
         const searchUser = interaction.options.getString('search');
         const data = await Queue.songSearch(searchUser)

         const objets = {
            [songType.playlist]: async () => {
               const { songs, playlist } = data
               const totalSongs = customPlaylist.concat(songs)

               if (totalSongs.length >= limiteSongs)
                  throw new Error(`No momento só é aceitado ${limiteSongs} músicas na custom playlist`)

               const filtred = songs.filter(song => !customPlaylist.some(x => x.url == song.url))

               if (!filtred.length)
                  throw new Error("Sua custom playlist contém todas as músicas da playlist informada")

               await Database.user.findOneAndUpdate(
                  { id: interaction.user.id },
                  { customPlaylist: customPlaylist.concat(filtred) }
               )

               return sucessMessage(interaction, `A playlist [${playlist.name}](${playlist.url}) foi adicionado com sucesso!`)
            },
            [songType.track]: async () => {
               if (customPlaylist.length >= limiteSongs)
                  throw new Error(`No momento só é aceitado ${limiteSongs} músicas na custom playlist`)

               if (customPlaylist.some(song => song.url == data.url))
                  throw new Error('A música já está em sua custom playlist!')

               await Database.user.findOneAndUpdate(
                  { id: interaction.user.id },
                  { $push: { customPlaylist: data } }
               )

               return sucessMessage(interaction, `✅ A track [${data.title}](${data.url}) foi adicionado a custom playlist!`)
            }
         }

         return objets[data.type]()
      }

      async function deleteCustomPlaylist() {

         await Database.user.findOneAndUpdate(
            { id: interaction.user.id },
            { customPlaylist: [] }
         )

         return sucessMessage(interaction, 'Sua custom playlist foi deletada com sucesso.')
      }

   }
}

module.exports = CustomPlaylist