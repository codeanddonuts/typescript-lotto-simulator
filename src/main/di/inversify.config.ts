import "reflect-metadata"
import { Container } from "inversify"
import { TYPES } from "./Types"
import Router from "koa-router"
import { ShopController } from "../controller/ShopController"
import { WinningNumbersRepository, WinningNumbersWebCrawler } from "../lotto/repository/WinningNumbersRepository"
import { LottoMachine } from "../lotto/service/LottoMachine"
import { Controller } from "../controller/Controller"

export const container = new Container()
container.bind<Router>(Router).toConstantValue(new Router())
container.bind<Controller>(Controller).to(ShopController)
container.bind<WinningNumbersRepository>(TYPES.WinningNumbersRepository).to(WinningNumbersWebCrawler)
container.bind<LottoMachine>(LottoMachine).toSelf()
