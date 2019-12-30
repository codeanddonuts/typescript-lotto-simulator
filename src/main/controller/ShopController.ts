import { injectable, inject } from "inversify"
import Router from "koa-router"
import Controller from "./Controller"

@injectable()
export class ShopController implements Controller {
  constructor(@inject(Router) private readonly router: Router) {}
}
