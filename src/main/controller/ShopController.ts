import { injectable, inject } from "inversify"
import Router from "koa-router"
import Controller from "./Controller"
import { LottoMachine } from "../lotto/service/LottoMachine"

@injectable()
export class ShopController implements Controller {
  constructor(@inject(Router) private readonly router: Router) {
    this.router.get("/", ctx => {
      ctx.redirect("/index.html")
    })

    this.router.get("/api/price", ctx => {
      ctx.body = LottoMachine.PRICE_PER_GAME
    })

    this.router.post("/api/purchase", ctx => {
      ctx.body = LottoMachine.PRICE_PER_GAME
    })
  }
}
