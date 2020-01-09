import 'reflect-metadata'
import supertest from 'supertest'
import { App } from '../../../main/config/App.config'
import { LottoMachine } from '../../../main/lotto/service/LottoMachine'
import { LottoShop } from '../../../main/lotto/service/LottoShop'
import { APPROXIMATE_RECENT_ROUND, connectTestDatabase } from '../../TestUtils'
require("iconv-lite").encodingExists("cesu8")

const PURCHASE_QUERY =
    `mutation ($round: Int, $investment: Int!, $manualPicks: [[Int!]!]) {
      purchase(round: $round, investment: $investment, manualPicks: $manualPicks) {
        round
        games
        winningNumbers {
          mains
          bonus
        }
        totalPrize
      }
    }`

const app = App()
const server = app.getHttpServer()

beforeAll(async () => {
  await connectTestDatabase()
  server.listen(8080)
})

afterAll(async () => {
  await app.stop()
})

describe("Wrong query", () => {
  it("Hell, world!", async () => {
    const res = await supertest(server).get("/api?query={hellworld}")
                                       .expect(400)
    expect(res.body.data).toBeUndefined()
    expect(res.body.errors).toBeInstanceOf(Array)
  })
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
  it(`${APPROXIMATE_RECENT_ROUND}`, async () => {
    const res = await supertest(server).get("/api?query={recentRound}")
                                       .expect(200)
    expect(res.body).toEqual({
      data: {
        recentRound: APPROXIMATE_RECENT_ROUND.num
      }
    })
  })
})

describe("Purchasing...?", () => {
  it("850₩ -> Failure", async () => {
    const round = 123
    const investment = 850
    const manualPicks = [[1, 2, 3, 4, 5, 6]]
    const res = await supertest(server).post("/api")
                                       .send({
                                          query: PURCHASE_QUERY,
                                          variables: {
                                            round: round,
                                            investment: investment,
                                            manualPicks: manualPicks
                                          }
                                       }).expect(200)
    expect(res.body.errors[0].message).toEqual("지불 금액이 부족합니다.")
  })

  it("1,200₩, No manual picks -> Success", async () => {
    const round = 123
    const investment = 1_200
    const res = await supertest(server).post("/api")
                                       .send({
                                          query: PURCHASE_QUERY,
                                          variables: {
                                            round: round,
                                            investment: investment,
                                            manualPicks: []
                                          }
                                       }).expect(200)
    expect(res.body.data.purchase).toMatchObject({
      round: 123,
      winningNumbers: {
        bonus: 27,
        mains: [7, 17, 18, 28, 30, 45]
      }
    })
  })

  it("1,200₩, One manual pick -> Success", async () => {
    const round = 123
    const investment = 1_200
    const manualPicks = [[1, 2, 3, 4, 5, 6]]
    const res = await supertest(server).post("/api")
                                       .send({
                                          query: PURCHASE_QUERY,
                                          variables: {
                                            round: round,
                                            investment: investment,
                                            manualPicks: manualPicks
                                          }
                                       }).expect(200)
    expect(res.body.data.purchase).toEqual({
      games: [[1, 2, 3, 4, 5, 6]],
      round: 123,
      totalPrize: 0,
      winningNumbers: {
        bonus: 27,
        mains: [7, 17, 18, 28, 30, 45]
      }
    })
  })

  it("1,200₩, Two manual picks -> Failure", async () => {
    const round = 123
    const investment = 1_200
    const manualPicks = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]]
    const res = await supertest(server).post("/api")
                                       .send({
                                          query: PURCHASE_QUERY,
                                          variables: {
                                            round: round,
                                            investment: investment,
                                            manualPicks: manualPicks
                                          }
                                       }).expect(200)
    expect(res.body.errors[0].message).toEqual("수동 입력이 너무 많습니다.")
  })

  it("123,000₩ -> Failure", async () => {
    const round = 123
    const investment = 123_000
    const res = await supertest(server).post("/api")
                                       .send({
                                          query: PURCHASE_QUERY,
                                          variables: {
                                            round: round,
                                            investment: investment,
                                            manualPicks: []
                                          }
                                       }).expect(200)
    expect(res.body.errors[0].message).toEqual(`최대 ${LottoMachine.MAX_PURCHASE_AMOUNT}장만 구매 가능합니다.`)
  })
})
