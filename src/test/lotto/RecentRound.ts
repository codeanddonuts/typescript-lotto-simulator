import moment from "moment"
import { Round } from "../../main/lotto/domain/Round"

export const APPROXIMATE_RECENT_ROUND = new Round(889 + moment(Date.now()).diff(moment("2019-12-14T12:00:00Z"), "weeks"))