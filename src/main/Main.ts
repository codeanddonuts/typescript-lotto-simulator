import { container } from "./config/Inversify.config"
import { App } from "./config/App.config"
import Router from "koa-router"
import { Controller } from "./config/Controller"

new App(
    container.get<Router>(Router),
    container.getAll<Controller>(Controller)
).start()
