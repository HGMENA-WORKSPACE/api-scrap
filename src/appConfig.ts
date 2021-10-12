import * as fs from "fs";
import { parse } from "./utils";

/**
 * 
 * @returns
 */
export default function appConfig(): any {
  console.log("envConfig ......");
  const isDevelopmentEnv = process.env.NODE_ENV !== "producction";
  if (isDevelopmentEnv) {
    const envFilePath = __dirname + "/../.env"; // Ruta del archivo de configuracion
    const existPath = fs.existsSync(envFilePath); // Booleano si existe el envFilePath
    if (!existPath) {
      console.log(".env file does not exist");
      process.exit(0);
    }
    const envConfig = parse(fs.readFileSync(envFilePath));

    console.log("envConfig listas");
    return envConfig;
  }
}
