import { container } from "./di/Inversify.config";
import { ServerConfig } from "./ServerConfig";

container.get<ServerConfig>(ServerConfig)