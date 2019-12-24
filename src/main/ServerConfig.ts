import { injectable, inject, multiInject } from "inversify"
import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import { Controller } from "./controller/Controller"

@injectable()
export class ServerConfig {
  private static readonly STATIC_FILES_DIR = "/static"
  private static readonly PORT = 80

  private readonly app = new Koa()

  constructor(
    @inject(Router) private readonly router: Router,
    @multiInject(Controller) private readonly controllers: Readonly<Controller[]>
  ) {
    this.app.use(serve(__dirname + ServerConfig.STATIC_FILES_DIR))
            .use(this.router.routes())
            .use(this.router.allowedMethods())
            .listen(ServerConfig.PORT)
  }
}
