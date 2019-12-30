import { container } from "./di/Inversify.config"
import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import compress from "koa-compress"
import Controller from "./controller/Controller"
import { createConnection, getConnectionOptions } from "typeorm"

const enum HttpStatus {
  NOT_FOUND = 404
}

new class App {
  private static readonly STATIC_FILES_DIR = "/public"
  private static readonly PORT = 80
 
  private readonly app = new Koa()

  constructor(private readonly router: Router, private readonly controllers: Readonly<Controller[]>) {
    this.setDefaultRoutings()
    this.app.use(serve(__dirname + App.STATIC_FILES_DIR))
            .use(this.router.routes())
            .use(this.router.allowedMethods())
            .use(compress)
            .listen(App.PORT)
    this.connectDatabase()
  }

  setDefaultRoutings() {
    this.router.get("/", ctx => {
      ctx.redirect("/index.html")
    })
    this.router.all("*", ctx => {
      ctx.status = HttpStatus.NOT_FOUND
      ctx.redirect("/error.html")
    })
  }

  async connectDatabase(): Promise<void> {
    createConnection(
        Object.assign(
            await getConnectionOptions(), {
              cache: true,
              entities: [
                  "./lotto/repository/**/*.ts"
              ]
            }
        )
    )
  }
}(container.get<Router>(Router), container.getAll<Controller>(Controller))
