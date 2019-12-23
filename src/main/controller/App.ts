import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import TOP_DIR from "../TopDir.config"

new class App {
  private static readonly PORT = 80
  private static readonly STATIC_FILES_DIR = "/static"

  private readonly app = new Koa()
  private readonly router = new Router()

  constructor() {
    this.initControllers()
    this.app.use(serve(TOP_DIR + App.STATIC_FILES_DIR)).use(this.router.routes()).use(this.router.allowedMethods())
    this.app.listen(App.PORT)
  }

  private initControllers() {
    this.router.get("/", async (ctx, next) => {
      ctx.redirect("/app.html")
      await next()
    })
  }
}()