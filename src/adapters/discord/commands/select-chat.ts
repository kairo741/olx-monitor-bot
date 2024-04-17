import { CommandInteraction, Guild, SlashCommandBuilder, TextChannel } from "discord.js";
// @ts-ignore
import { db } from '../../../database/database.js';

export const data = new SlashCommandBuilder()
  .setName("select")
  .setDescription("Seleciona esse chat para enviar os anúncios.");

export async function execute(interaction: CommandInteraction) {

  const channel: TextChannel = interaction.channel! as TextChannel;
  const server = interaction.guild!;

  const query = `SELECT * FROM discord_servers WHERE serverId = ? LIMIT ?`
  const values = [ server?.id, 1 ]

  let message = ""
  await new Promise(function (resolve, reject) {
    db.all(query, values, async function (error: Error, rows: any[]) {

      if (error) {
        message = error.message
        console.error(error) // TODO - Loggar
        reject(error)
        return
      }

      if (!rows || rows.length <= 0) {

        message = await insertData(server, channel)
        console.log('Insert') // TODO - Loggar
        return
      }

      message = await updateData(server, channel, rows[0])
      resolve(rows)
      console.log("Update")// TODO - Loggar
    })
  })
  return interaction.reply(message);
}


async function insertData(server: Guild, channel: TextChannel) {
  const now = new Date().toISOString()
  try {
    const query = `
        INSERT INTO discord_servers(serverId, name, channelId, channelName, created, lastUpdate)
        VALUES( ?, ?, ?, ?, ?, ? )`

    const values = [
      server?.id,
      server?.name,
      channel.id,
      channel.name,
      now,
      now
    ]

    await new Promise(function (resolve, reject) {
      db.run(query, values, function (error: Error, rows: any[]) {
        if (error) {
          reject(error)
          return
        }
        resolve(true)
      })
    })

    return `O canal **${ channel.name }** foi selecionado para o envio das mensagens!`
  } catch (e) {
    return "Erro ao selecionar o canal de mensagens!"
  }
}

async function updateData(server: Guild, channel: TextChannel, dbData: any) {
  try {

    const query =
      `UPDATE discord_servers SET name = ?, channelId = ?, channelName = ?, lastUpdate = ? WHERE id = ?`

    const values = [
      server?.name,
      channel.id,
      channel.name,
      new Date().toISOString(),
      dbData.id
    ]

    await new Promise(function (resolve, reject) {
      db.run(query, values, function (error: Error, rows: any[]) {
        if (error) {
          reject(error)
          return
        }
        resolve(true)
      })
    })

    return `O canal **${ dbData.channelName }** foi alterado para o canal **${ channel.name }** no envio das mensagens!`

  } catch (e) {
    return "Erro ao selecionar o canal de mensagens!"
  }
}