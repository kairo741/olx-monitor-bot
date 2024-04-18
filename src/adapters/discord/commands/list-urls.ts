import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from "discord.js";
// @ts-ignore
import { db } from '../../../database/database.js';

export const data = new SlashCommandBuilder()
  .setName("list_urls")
  .setDescription("Busca todas as URLs de busca do servidor")
  .addBooleanOption(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Você pode selecionar uma URL para remover'));

export async function execute(interaction: CommandInteraction) {

  const server = interaction.guild!;

  const query = `SELECT * FROM search_urls WHERE serverId = ?`
  const values = [ server?.id ]

  let row1;
  let embedMessage = new EmbedBuilder()
    .setColor('Random').setTimestamp();
  await new Promise(function (resolve, reject) {
    db.all(query, values, async function (error: Error, rows: any[]) {
      if (error) {
        embedMessage
          .setTitle('ERRO')
          .setDescription(`Ocorreu um erro: ${ error.message }`);
        console.error(error) // TODO - Loggar
        reject(error)
        return
      }

      try {
        const serverUrls = rows.filter(value => value.serverId == server.id);
        if (!rows || serverUrls.length <= 0) {
          embedMessage
            .setTitle('Nenhuma URL foi encontrada')
            .setDescription(`Nenhuma URL de busca foi encontrada para esse servidor!`);
          resolve(rows)
          return
        }

        let description = ""

        serverUrls.forEach((value, index) => {
          description += `\n- **[${ index + 1 }]** [${ value.name }](${ value.url })`
        })

        embedMessage.setTitle('URLs de busca desse servidor');
        embedMessage
          .setDescription(description)
        resolve(rows)


        if (interaction.options.get("delete")?.value) {
          const select = new StringSelectMenuBuilder()
            .setCustomId('list_urls')
            .setPlaceholder('Selecione a URL que deseja remover!')

          serverUrls.forEach((value, index) => {
            select.addOptions(new StringSelectMenuOptionBuilder()
              .setLabel(`[${ index + 1 }]`)
              .setDescription(value.name)
              .setValue(index.toString()))
          })

          row1 = new ActionRowBuilder()
            .addComponents(select);
        }

        return
      } catch (e) {
        console.error(e)
        return `Erro interno: ${ e }`
      }
    })
  })


  // @ts-ignore
  return interaction.reply({ embeds: [ embedMessage ], components: [ row1 ], });
}

export async function menuAction(interaction: CommandInteraction) {

  console.log(interaction)
}