import { Context } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { getRepository } from "typeorm";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function thighsCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/thighs")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Show new thighs image",
                        callback_data: "NEW_THIGHS",
                    },
                ],
            ],
        },
    });

    const dbRepo = getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.thighsUsed = dbRepoUpdate.thighsUsed + 1;
    await dbRepo.save(dbRepoUpdate);

    return;
}
