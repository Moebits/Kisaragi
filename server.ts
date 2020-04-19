import bodyParser from "body-parser"
import express from "express"
import path from "path"
import ytNotification from "youtube-notification"
import config from "./config.json"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"
import {YoutubeOnline} from "./structures/YoutubeOnline"

export default class Server {
    private readonly yt = new ytNotification({
        hubCallback: `${config.kisaragiAPI}/yt`,
        middleware: true
    })

    public getYT = () => {
        return this.yt
    }

    public run = () => {
        const app = express()
        const port = process.env.PORT || 5000

        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))
        app.use("/yt", this.yt.listener())
        YoutubeOnline.youtubeRoutes(app)

        app.get("/twitter", async (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            if (req.query.oauth_token) {
                try {
                    await SQLQuery.twitterOauth(req.query.oauth_token, req.query.oauth_verifier)
                    res.status(200).sendFile(path.join(__dirname, "../assets/html/authorized.html"))
                } catch {
                    res.status(200).sendFile(path.join(__dirname, "../assets/html/rejected.html"))
                }
            } else {
                res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
            }
        })

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

const server = new Server()

if (config.testing === "off") {
    server.run()
}
const yt = server.getYT()
export {yt}
