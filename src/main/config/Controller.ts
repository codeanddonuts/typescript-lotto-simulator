import { ITypedef, IResolvers } from "apollo-server-koa"
import { injectable } from "inversify"

@injectable()
export abstract class Controller {
  public typeDefs(): ITypedef {
    return ""
  }

  public resolvers() : IResolvers<any, any> {
    return {}
  }
}
