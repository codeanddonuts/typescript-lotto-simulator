import { model } from "./modules/model.mjs"
import { view } from "./modules/view.mjs"
import { intent } from "./modules/intent.mjs"

(async () => view(await model(intent())))()
