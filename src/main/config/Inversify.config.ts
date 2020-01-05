import "reflect-metadata"
import { Container } from "inversify"
import Router from "koa-router"
import { Controller } from "./Controller"
import { ShopController } from "../lotto/controller/ShopController"
import { WinningNumbersCachedWebCrawler } from "../lotto/infrastructure/WinningNumbersCachedWebCrawler"
import { WinningNumbersApiClient } from "../lotto/service/WinningNumbersApiClient"
import { LottoMachine } from "../lotto/service/LottoMachine"
import { LottoShop } from "../lotto/service/LottoShop"

export const container = new Container()
container.bind<WinningNumbersApiClient>(WinningNumbersApiClient).to(WinningNumbersCachedWebCrawler)
container.bind<LottoMachine>(LottoMachine).toSelf()
container.bind<LottoShop>(LottoShop).toSelf()
container.bind<Router>(Router).toConstantValue(new Router())
container.bind<Controller>(Controller).to(ShopController)
