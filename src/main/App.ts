import { container } from "./di/Inversify.config"
import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import compress from "koa-compress"
import Controller from "./controller/Controller"
import { ApolloServer, makeExecutableSchema } from "apollo-server-koa"
import { createConnection, getConnectionOptions } from "typeorm"

const enum HttpStatus {
  NOT_FOUND = 404
}

new class App {
  private static readonly API_DIR = "/api"
  private static readonly STATIC_FILES_DIR = "/public"
  private static readonly PORT = 80
 
  private readonly app = new Koa()
  private readonly apiServer: ApolloServer

  constructor(private readonly router: Router, private readonly controllers: Readonly<Controller[]>) {
    this.setDefaultRoutings()
    this.apiServer = new ApolloServer({
      schema: makeExecutableSchema({
        typeDefs: controllers.map(x => x.typeDefs()).filter(x => x != ""),
        resolvers: controllers.map(x => x.resolvers()).filter(x => Object.keys(x).length > 0)
      }),
      playground: process.env.NODE_ENV !== "production",
      debug: process.env.NODE_ENV !== "production"
    })
    this.apiServer.applyMiddleware({ app: this.app, path: App.API_DIR })
    this.app.use(serve(__dirname + App.STATIC_FILES_DIR))
            .use(this.router.routes())
            .use(this.router.allowedMethods())
            .use(compress)
    this.connectDatabase().then(() => this.app.listen(App.PORT))
                          .catch(e => console.log(e))
  }

  private setDefaultRoutings() {
    this.router.get("/", ctx => {
      ctx.redirect("/index.html")
    })
    this.router.all("*", ctx => {
      ctx.status = HttpStatus.NOT_FOUND
      ctx.redirect("/error.html")
    })
  }

  private async connectDatabase(): Promise<void> {
    createConnection(
        Object.assign(
            await getConnectionOptions(), {
              cache: true,
              entities: [
                  "src/main/lotto/repository/**/*.ts"
              ]
            }
        )
    )
  }
}(container.get<Router>(Router), container.getAll<Controller>(Controller))
