import bodyParser from "body-parser"
import express from "express"
import path from "path"
import config from "./config.json"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"

export default class Server {
    public run = () => {
        const app = express()
        const port = process.env.PORT || 53134

        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))

        app.get("/", async (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            if (req.query.code) {
                await SQLQuery.initOauth2(req.query.code)
                res.status(200).sendFile(path.join(__dirname, "../assets/html/authorized.html"))
            } else {
                res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
            }
        })

        app.get("*", (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            res.status(404).sendFile(path.join(__dirname, "../assets/html/404.html"))
        })

        app.listen(port)
        Logger.log(`Started the web server!`)
    }
}

if (config.testing === "off") {
    const server = new Server()
    server.run()
}
