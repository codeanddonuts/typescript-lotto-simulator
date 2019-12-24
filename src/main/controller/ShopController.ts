import { injectable, inject } from "inversify"
import Router = require("koa-router")
import { Controller } from "./Controller"
import { LottoMachine } from "../lotto/service/LottoMachine"

@injectable()
export class ShopController implements Controller {
  constructor(@inject(Router) private readonly router: Router) {
    this.router.get("/", async ctx => {
      ctx.redirect("/app.html")
    })

    this.router.get("/api/price", async ctx => {
      ctx.body = LottoMachine.PRICE_PER_GAME
    })
  }
}
