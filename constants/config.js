export const BW_CONFIG = {
  dev: {
    app_url: "http://localhost:8080",
    logs: "C:/Dev/brass_works/bw_stuff/logs",
    uploads: "C:/Dev/brass_works/bw_stuff/uploads",
    downloads: "C:/Dev/brass_works/bw_stuff/downloads",
    mdb_url: "mongodb://0.0.0.0:27017/brasswork_db",
  },
  prod: {
    app_url: "https://bw-prods-app-fgr5j.ondigitalocean.app",
    logs: "/home/apps/bw_stuff/logs",
    uploads: "/home/apps/bw_stuff/uploads",
    downloads: "/home/apps/bw_stuff/downloads",
    mdb_url:
      "mongodb+srv://doadmin:5BI7A4ks80Y39Jx2@db-mongodb-bw-clstr-b91cd3a2.mongo.ondigitalocean.com/bw_prods_db?authSource=admin",
  },
};
