import "reflect-metadata"
require("iconv-lite").encodingExists("cesu8")
import { container } from "../../../main/config/Inversify.config"
import supertest from "supertest"
import { LottoShop } from "../../../main/lotto/service/LottoShop"
import { connectTestDB, APPROXIMATE_RECENT_ROUND as RECENT_ROUND_MOCK } from "../../TestUtils"
import { LottoMachine } from "../../../main/lotto/service/LottoMachine"
import Router from "koa-router"
import { Controller } from "../../../main/config/Controller"
import { App } from "../../../main/config/App.config"

const app = new App(
  container.get<Router>(Router),
  container.getAll<Controller>(Controller)
)
const server = app.getHttpServer()

beforeAll(async () => {
  await connectTestDB()
  server.listen(8080)
})

afterAll(async () => {
  await app.stop()
})

describe("Price?", () => {
  it(`${LottoShop.PRICE_PER_GAME}`, async () => {
    const res = await supertest(server).get("/api?query={price}")
                                       .expect(200)
    expect(res.body).toEqual({
      data: {
        price: LottoShop.PRICE_PER_GAME
      }
    })
  })
})

describe("Maximum purchase amount?", () => {
  it(`${LottoMachine.MAX_PURCHASE_AMOUNT}`, async () => {
    const res = await supertest(server).get("/api?query={maxPurchaseAmount}")
                                       .expect(200)
    expect(res.body).toEqual({
      data: {
        maxPurchaseAmount: LottoMachine.MAX_PURCHASE_AMOUNT
      }
    })
  })
})

describe("Recent round?", () => {
  it(`${RECENT_ROUND_MOCK}`, async () => {
    const res = await supertest(server).get("/api?query={recentRound}")
                                       .expect(200)
    expect(res.body).toEqual({
      data: {
        recentRound: RECENT_ROUND_MOCK.num
      }
    })
  })
})
