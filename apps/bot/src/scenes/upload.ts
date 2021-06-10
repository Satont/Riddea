import { Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "@riddea/typeorm";
import axios from "axios";

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
  .enter((ctx) => ctx.reply(`Okay, send me your image!`).catch(() => {}))
  .on("photo", async (ctx) => {
    const photo = ctx.message.photo.pop();
    const photoRequest = await axios.get((await ctx.telegram.getFileLink(photo.file_id)).href, {
      responseType: "arraybuffer",
    });

    await getRepository(Upload).save({
      userID: ctx.from.id,
      fileID: photo.file_id,
      data: `data:image/jpeg;base64,${Buffer.from(photoRequest.data, "binary").toString("base64")}`,
    });

    await ctx.reply(`Yay, your image loaded to bot database! Type /cancel if you don't want upload pictures anymore.`).catch(() => {});
  })
  .command("cancel", async (ctx) => {
    await ctx.scene.leave().catch(() => {});
    await ctx.reply("You leave from upload image section!").catch(() => {});
  })
  .on("message", async (ctx) => {
    await ctx.reply(`If you don't want upload image, type /cancel!`).catch(() => {});
  });
