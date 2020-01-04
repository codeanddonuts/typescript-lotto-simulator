import { container } from "./di/Inversify.config";
import { App } from "./App";


container.get<App>(App).start()
