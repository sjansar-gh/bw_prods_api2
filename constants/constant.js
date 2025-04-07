import * as config from "./config.js";
import "dotenv/config";

export const JWT_MAX_AGE = 24 * 60 * 60 * 1000;
export const ENV = process.env.ENV;

export let app_url = "";
export let logs_folder = "";
export let uploads_folder = "";
export let downloads_folder = "";
export let mdb_url = "";

if (ENV === "dev" || ENV === "DEV") {
  app_url = config.BW_CONFIG.dev.app_url;
  logs_folder = config.BW_CONFIG.dev.logs;
  uploads_folder = config.BW_CONFIG.dev.uploads;
  downloads_folder = config.BW_CONFIG.dev.downloads;
  mdb_url = config.BW_CONFIG.dev.mdb_url;
} else if (ENV === "prod" || ENV === "PROD") {
  app_url = config.BW_CONFIG.prod.app_url;
  logs_folder = config.BW_CONFIG.prod.logs;
  uploads_folder = config.BW_CONFIG.prod.uploads;
  downloads_folder = config.BW_CONFIG.prod.downloads;
  mdb_url = config.BW_CONFIG.prod.mdb_url;
}

console.log("app_url: ", app_url);
console.log("logs_folder: ", logs_folder);
console.log("uploads_folder: ", uploads_folder);
console.log("downloads_folder: ", downloads_folder);
console.log("mdb_url: ", mdb_url);

export const CORS_OPT = {
  origin: app_url,
  credentials: true,
};
