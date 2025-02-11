import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display bot help menu",
      collectUsage: false,
      name: "help",
      action: "SEND_HELPMENU",
    });
  }

  async run(ctx: Context) {
    const keyboard = Markup.inlineKeyboard([
      [{ text: "Sponsors", callback_data: "SEND_SPONSORS" }],
      [
        {
          text: "GitHub",
          url: "https://github.com/Riddea/Riddea",
        },
        {
          text: "Support me",
          url: "https://www.donationalerts.com/r/lwjerri",
        },
      ],
    ]);

    await ctx.reply(
      `Yo! Type / for view list of all bot commands.\n\nNOTE: If you wanna upload picture, you need send this picture to bot without commands, compression, and etc. Also you can forward picture from other chat :3`,
      keyboard,
    );
  }
}
