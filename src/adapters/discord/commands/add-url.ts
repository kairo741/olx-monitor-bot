import { CommandInteraction, EmbedBuilder, Guild, SlashCommandBuilder } from "discord.js";
// @ts-ignore
import { db } from '../../../database/database.js';

export const data = new SlashCommandBuilder()
  .setName("add_url")
  .setDescription("Adiciona uma nova URL de busca de dados")
  .addStringOption(option =>
    option.setName('url')
      .setDescription('Url da busca na OLX')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('url_name')
      .setDescription('Nome essa URL de busca')
      .setRequired(true));

export async function execute(interaction: CommandInteraction) {

  const server = interaction.guild!;

  const urlString = interaction.options.get('url')?.value;
  const urlName = interaction.options.get('url_name')?.value;

  const query = `SELECT * FROM search_urls WHERE serverId = ?`
  const values = [ server?.id ]

  let embedMessage = new EmbedBuilder()
    .setColor('Random').setTimestamp();
  if (urlString && urlName) {
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
          const dbUrl = rows.filter(value => (value.name == urlName && value.serverId == server.id));
          if (!rows || dbUrl.length <= 0) {
            embedMessage.setTitle('URL de busca Inserida!');
            await insertData(server, urlString.toString(), urlName.toString())
            embedMessage
              .setDescription(`A URL **${ urlName }** foi salva com sucesso!`)
              .addFields(
                { name: 'URL:', value: urlString.toString() }
              )
            resolve(rows)
            console.log('Insert') // TODO - Loggar
            return
          }

          embedMessage.setTitle('URL de busca Alterada!');
          await updateData(urlString.toString(), dbUrl[0])
          embedMessage
            .setDescription(`A URL **${ urlName }** foi alterada com sucesso!`)
            .addFields(
              { name: 'Antiga URL:', value: dbUrl[0].url },
              { name: 'Nova URL:', value: urlString.toString() },
            )
          resolve(rows)
          console.log("Update")// TODO - Loggar
          return
        } catch (e) {
          console.error(e)
          return `Erro interno: ${ e }`
        }
      })
    })
  }

  return interaction.reply({ embeds: [ embedMessage ] });
}


async function insertData(server: Guild, url: string, urlName: string) {
  const now = new Date().toISOString()
  const query = `
        INSERT INTO search_urls(url, name, serverId, urlSource, created, lastUpdate)
        VALUES( ?, ?, ?, ?, ?, ? )`

  const values = [
    url,
    urlName,
    server?.id,
    "DISCORD",
    now,
    now
  ]

  return await new Promise(function (resolve, reject) {
    db.run(query, values, function (error: Error, rows: any[]) {
      if (error) {
        reject(error)
        return
      }
      resolve(true)
    })
  })
}

async function updateData(url: string, dbData: any) {
  const query =
    `UPDATE search_urls SET url = ?, lastUpdate = ? WHERE id = ?`

  const values = [
    url,
    new Date().toISOString(),
    dbData.id
  ]

  return await new Promise(function (resolve, reject) {
    db.run(query, values, function (error: Error, rows: any[]) {
      if (error) {
        reject(error)
        return
      }
      resolve(true)
    })
  })

}