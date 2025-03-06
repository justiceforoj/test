import { SlashCommandBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("help").setDescription("Lists all available commands"),
  async execute(interaction) {
    const commands = interaction.client.commands
    const commandList = commands.map((command) => `**/${command.data.name}**: ${command.data.description}`).join("\n")

    await interaction.reply({
      content: `Here are all available commands:\n${commandList}`,
      ephemeral: true,
    })
  },
}

