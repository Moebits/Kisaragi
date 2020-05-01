import bodyParser from "body-parser"
import express from "express"
import path from "path"
import ytNotification from "youtube-notification"
import config from "./config.json"
import {YoutubeOnline} from "./routes/YoutubeOnline"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"

let yt: any
if (!yt) {
    yt = new ytNotification({
        hubCallback: `${config.kisaragiAPI}/yt`,
        middleware: true
    })
}
export default class Server {
    public checkState = async (state: string) => {
        const states = await SQLQuery.redisGet("state")
        if (states.includes(state)) {
            return true
        } else {
            return false
        }
    }

    public run = () => {
        const app = express()
        const port = process.env.PORT || 5000

        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))
        app.use("/yt", yt.listener())
        YoutubeOnline.youtubeRoutes(app)

        app.get("/reddit", async (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            if (req.query.code) {
                try {
                    if (!await this.checkState(req.query.state)) return res.status(400).sendFile(path.join(__dirname, "../assets/html/expired.html"))
                    await SQLQuery.redditOuath(req.query.code)
                    res.status(200).sendFile(path.join(__dirname, "../assets/html/authorized.html"))
                } catch {
                    res.status(400).sendFile(path.join(__dirname, "../assets/html/rejected.html"))
                }

            } else {
                res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
            }
        })

        app.get("/twitter", async (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            if (req.query.oauth_token) {
                try {
                    await SQLQuery.twitterOauth(req.query.oauth_token, req.query.oauth_verifier)
                    res.status(200).sendFile(path.join(__dirname, "../assets/html/authorized.html"))
                } catch {
                    res.status(400).sendFile(path.join(__dirname, "../assets/html/rejected.html"))
                }
            } else {
                res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
            }
        })

        app.get("/discord", async (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            if (req.query.code) {
                if (!await this.checkState(req.query.state)) return res.status(400).sendFile(path.join(__dirname, "../assets/html/expired.html"))
                await SQLQuery.initOauth2(req.query.code)
                res.status(200).sendFile(path.join(__dirname, "../assets/html/authorized.html"))
            } else {
                res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
            }
        })

        app.get("/", (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
        })

        app.get("*", (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            res.status(404).sendFile(path.join(__dirname, "../assets/html/404.html"))
        })

        app.listen(port)
        Logger.log(`Started the web server!`)
    }
}

/*if (config.testing === "off") {
    const server = new Server()
    server.run()
}*/

export {yt}
