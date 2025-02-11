import { Controller, Get, Response, Query, Request } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";
import { apiLogger } from "../../main";
import { TelegramService } from "./telegram.service";

@Controller("/v1/auth/telegram")
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @ApiExcludeEndpoint()
  @Get("callback")
  async telegramCallback(@Query() query: any, @Request() req: FastifyRequest, @Response() res: FastifyReply) {
    try {
      const user = await this.telegramService.confirmLogin(query);
      req.session.set("user", user);
      return res.redirect(302, "/");
    } catch (err) {
      return apiLogger.error(`Telegram Controller error:`, err.stack);
    }
  }
}
