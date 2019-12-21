import "reflect-metadata"
import { Container } from "inversify"
import { WinningNumbersRepository, WinnerAnnouncement } from "../lotto/repository/WinningNumbersRepository"
import { TYPES } from "./types"
import { LottoMachine } from "../lotto/service/LottoMachine"

export const container = new Container()
container.bind<LottoMachine>(LottoMachine).toSelf()
container.bind<WinningNumbersRepository>(TYPES.WinningNumbersRepository).to(WinnerAnnouncement)