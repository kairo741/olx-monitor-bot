import { Client, GatewayIntentBits } from "discord.js";
import { deployCommands } from './deploy-commands';
import { config } from '../../config';
import { commands } from "./commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,],
});

client.once("ready", async () => {
  // await deployCommands({ guildId: "967174673760657409" });
  console.log("Bot On! 🤖");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);