import http from "http"
import Koa from "koa"
import Router from "koa-router"
import logger from "koa-logger"
import compress from "koa-compress"
import serve from "koa-static"
import { Controller } from "./Controller"
import { ApolloServer, makeExecutableSchema } from "apollo-server-koa"
import { createConnection, getConnectionOptions, getConnection } from "typeorm"
import { WinningNumbersEntity } from "../lotto/infrastructure/WinningNumbersCachedWebCrawler"
import { __basedir } from "../__basedir"
import { container } from "./Inversify.config"

const IS_DEV_MODE = process.env.NODE_ENV !== "production"

const enum HttpStatus {
  NOT_FOUND = 404
}

class Server {
  private static readonly API_URL = "/api"
  private static readonly STATIC_FILES_DIR = "/public"
  private static readonly PORT = 3000
 
  private readonly server: http.Server

  constructor(private readonly router: Router, private readonly controllers: Readonly<Controller[]>) {
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
      playground: IS_DEV_MODE,
      debug: IS_DEV_MODE,
    })
    apollo.applyMiddleware({ app: koa, path: Server.API_URL })
    this.setDefaultRoutings()
    koa.use(logger())
       .use(compress())
       .use(serve(__basedir + Server.STATIC_FILES_DIR))
       .use(this.router.routes())
       .use(this.router.allowedMethods())
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

  public async start() : Promise<Server> {
    await this.connectDatabase()
    this.server.listen(Server.PORT)
    return this
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

export const App = () => new Server(
    container.get<Router>(Router),
    container.getAll<Controller>(Controller)
)
