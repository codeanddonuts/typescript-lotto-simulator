import "reflect-metadata"
require("iconv-lite").encodingExists("cesu8")
import { container } from "../../main/di/Inversify.config"
import { App } from "../../main/App"
import supertest from "supertest"
import { LottoShop } from "../../main/lotto/service/LottoShop"
import { connectTestDB, APPROXIMATE_RECENT_ROUND as RECENT_ROUND_MOCK } from "../TestUtils"
import { LottoMachine } from "../../main/lotto/service/LottoMachine"

const app = container.get<App>(App)

beforeAll(async () => {
  await connectTestDB()
  app.getServer().listen(8080)
})

afterAll(async () => {
  await app.stop()
})

describe("Price?", () => {
  it(`${LottoShop.PRICE_PER_GAME}`, async () => {
    const res = await supertest(app.getServer()).get("/api?query={price}")
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
    const res = await supertest(app.getServer()).get("/api?query={maxPurchaseAmount}")
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
    const res = await supertest(app.getServer()).get("/api?query={recentRound}")
                                                .expect(200)
    expect(res.body).toEqual({
      data: {
        recentRound: RECENT_ROUND_MOCK.num
      }
    })
  })
})
