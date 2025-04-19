import { BotSubcommandBuilder } from "@phasejs/builders"

import { TicTacToe } from "~/structures/games/tictactoe"

// this command only starts the game, it doesn't handle any game logic,
// see app/events/games/tictactoe.ts for that

export default new BotSubcommandBuilder()
  .setName("tictactoe")
  .setDescription("Starts a game of tic-tac-toe.")
  .addUserOption((option) => {
    return option
      .setName("opponent")
      .setDescription("The user you want to play against.")
      .setRequired(true)
  })
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const user1 = interaction.user
    const user2 = interaction.options.getUser("opponent", true)

    const tictactoe = new TicTacToe(interaction.client, [user1, user2])
    const message = tictactoe.message.createMessage()

    void interaction.reply(message)
  })
