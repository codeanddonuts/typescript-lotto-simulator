import "reflect-metadata"
import { Container } from "inversify"
import Router from "koa-router"
import Controller from "../controller/Controller"
import { ShopController } from "../controller/ShopController"
import { WinningNumbersCachedWebCrawler } from "../lotto/repository/WinningNumbersCachedWebCrawler"
import { WinningNumbersRepository } from "../lotto/repository/WinningNumbersRepository"
import { LottoMachine } from "../lotto/service/LottoMachine"
import { LottoShop } from "../lotto/service/LottoShop"
import { App } from "../App"

export const container = new Container()
container.bind<WinningNumbersRepository>(WinningNumbersRepository).to(WinningNumbersCachedWebCrawler)
container.bind<LottoMachine>(LottoMachine).toSelf()
container.bind<LottoShop>(LottoShop).toSelf()
container.bind<Router>(Router).toConstantValue(new Router())
container.bind<Controller>(Controller).to(ShopController)
container.bind<App>(App).toSelf()
