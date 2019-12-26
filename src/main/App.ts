import "reflect-metadata"
import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import Controller from "./controller/Controller"
import { container } from "./di/Inversify.config"
import { createConnection, getConnectionOptions } from "typeorm"

new class App {
  private static readonly STATIC_FILES_DIR = "/public"
  private static readonly PORT = 80

  private readonly app = new Koa()

  constructor(private readonly router: Router, private readonly controllers: Readonly<Controller[]>) {
    this.connectDatabase().then(ok => {
      this.app.use(serve(__dirname + App.STATIC_FILES_DIR))
              .use(this.router.routes())
              .use(this.router.allowedMethods())
              .listen(App.PORT)
    })
  }

  async connectDatabase() {
    createConnection(
        Object.assign(
            await getConnectionOptions(),
            { entities: [ "./lotto/repository/**/*.ts" ] }
        )
    )
  }
}(container.get<Router>(Router), container.getAll<Controller>(Controller))