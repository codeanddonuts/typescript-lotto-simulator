import { Round } from "../../main/lotto/domain/Round"
import moment from "moment"

export const APPROXIMATE_RECENT_ROUND = new Round(889 + moment(Date.now()).diff(moment("2019-12-14T12:00:00Z"), "weeks"))
