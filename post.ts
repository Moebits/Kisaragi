import fs from "fs"
import path from "path"

fs.copyFileSync(path.join(__dirname, "../structures/CreateDB.sql"), path.join(__dirname, "./structures/CreateDB.sql"))
fs.mkdirSync(path.join(__dirname, "./assets/images"), {recursive: true})
fs.copyFileSync(path.join(__dirname, "../assets/images/heart.png"), path.join(__dirname, "./assets/images/heart.png"))