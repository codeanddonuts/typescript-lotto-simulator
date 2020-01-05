import http from "http"
import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import compress from "koa-compress"
import logger from "koa-logger"
import Controller from "./controller/Controller"
import { ApolloServer, makeExecutableSchema } from "apollo-server-koa"
import { createConnection, getConnectionOptions, getConnection } from "typeorm"
import { injectable, inject, multiInject } from "inversify"
import { WinningNumbersEntity } from "./lotto/repository/WinningNumbersCachedWebCrawler"

const DEV_MODE = process.env.NODE_ENV !== "production"

const enum HttpStatus {
  NOT_FOUND = 404
}

@injectable()
export class App {
  private static readonly API_DIR = "/api"
  private static readonly STATIC_FILES_DIR = "/public"
  private static readonly PORT = DEV_MODE ? 3000 : 80
 
  private readonly server: http.Server

  constructor(
      @inject(Router) private readonly router: Router,
      @multiInject(Controller) private readonly controllers: Readonly<Controller[]>
  ) {
    const koa = new Koa()
    const apollo = new ApolloServer({
      schema: makeExecutableSchema({
        typeDefs: controllers.map(x => x.typeDefs()).filter(x => x != ""),
        resolvers: controllers.map(x => x.resolvers()).filter(x => Object.keys(x).length > 0)
      }),
      formatError: e => {
        console.log(e.message)
        return e
      },
      playground: DEV_MODE,
      debug: DEV_MODE,
    })
    apollo.applyMiddleware({ app: koa, path: App.API_DIR })
    this.setDefaultRoutings()
    koa.use(logger())
       .use(serve(__dirname + App.STATIC_FILES_DIR))
       .use(this.router.routes())
       .use(this.router.allowedMethods())
       .use(compress)
    this.server = http.createServer(koa.callback())
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

  public async start() : Promise<void> {
    await this.connectDatabase()
    this.server.listen(App.PORT)
  }

  private async connectDatabase(): Promise<void> {
    await createConnection(
        Object.assign(
            await getConnectionOptions(), {
              cache: true,
              entities: [
                WinningNumbersEntity
              ]
            }
        )
    ).catch(e => console.log(e))
  }

  public async stop(): Promise<void> {
    this.server.close()
    return getConnection().close()
                          .catch(e => console.log(e))
  }

  public getHttpServer(): http.Server {
    return this.server
  }
}
