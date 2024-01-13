import {DataSource} from "typeorm";
import {User} from "./entities/User.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env["PGHOST"],
    port: Number(process.env["PGPORT"]),
    username: process.env["PGUSER"],
    password: process.env["PGPASSWORD"],
    database: process.env["PGDATABASE"],
    synchronize: false,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})
