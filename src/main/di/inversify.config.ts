import { Container } from "inversify"
import Router from "koa-router"
import Controller from "../controller/Controller"
import { ShopController } from "../controller/ShopController"
import { WinningNumbersCachedWebCrawler } from "../lotto/repository/WinningNumbersCachedWebCrawler"
import { WinningNumbersRepository } from "../lotto/repository/WinningNumbersRepository.1"
import { LottoMachine } from "../lotto/service/LottoMachine"

export const container = new Container()
container.bind<Router>(Router).toConstantValue(new Router())
container.bind<Controller>(Controller).to(ShopController)
container.bind<WinningNumbersRepository>(WinningNumbersRepository).to(WinningNumbersCachedWebCrawler)
container.bind<LottoMachine>(LottoMachine).toSelf()
