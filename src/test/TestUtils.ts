import { createConnection, getConnectionOptions } from "typeorm"
import { Round } from "../main/lotto/domain/Round"
import moment from "moment"
import { WinningNumbersEntity } from "../main/lotto/infrastructure/WinningNumbersCachedWebCrawler"

export const connectTestDatabase = async () => {
  return createConnection(
      Object.assign(
          await getConnectionOptions(), {
            database : "test",
            cache: true,
            entities: [
              WinningNumbersEntity
            ]
          }
      )
  ).catch(e => console.log(e))
}

export const APPROXIMATE_RECENT_ROUND = new Round(889 + moment(Date.now()).diff(moment("2019-12-14T12:00:00Z"), "weeks"))
