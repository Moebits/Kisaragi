import child_process from "child_process"
import {Message, Util} from "discord.js"
import * as stream from "stream"
import * as config from "../config.json"

export class Functions {
    private static readonly colors: string[] = config.colors
    constructor(private readonly message?: Message) {}

    // Timeout
    public static timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    // Reject Promise after timeout
    public static promiseTimeout = (ms: number, promise: Promise<any>) => {

        const timeout = new Promise((resolve, reject) => {
          const id = setTimeout(() => {
            clearTimeout(id)
            reject("Timed out in "+ ms + "ms.")
          }, ms)
        })

        return Promise.race([
          promise,
          timeout
        ])
    }

    // Await Pipe
    public static awaitPipe = async (readStream: stream.Readable, writeStream: stream.Writable) => {
        return new Promise((resolve) => {
            readStream.pipe(writeStream)
            readStream.on("end", () => {
                resolve()
            })
        })
    }

    // Execute File
    public static execFile = async (file: string, args?: string[]) => {
        child_process.execFile(`../assets/tools/${file}`, args)
        return console.log("finished")
    }

    // Random Number
    public static getRandomNum = (min: number, max: number) => {
        return Math.random() * (max - min) + min
    }

    // Response Time
    public responseTime = () => {
        if (this.message) {
            return `${Date.now() - this.message.createdTimestamp} ms`
        }
    }

    // Format Date
    public static formatDate = (inputDate: Date) => {
        const monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ]
        const date = new Date(inputDate)
        const day = date.getDate()
        const monthIndex = date.getMonth()
        const year = date.getFullYear()

        return `${monthNames[monthIndex]} ${day}, ${year}`
      }

    // Clean HTML
    public static cleanHTML = (str: string) => {
        return str.replace(/<\/?[^>]+(>|$)/g, "")
    }

    // Multi Trim
    public static multiTrim = (str: string) => {
        return str.replace(/^\s+/gm, "").replace(/\s+$/gm, "").replace(/newline/g, " ")
    }

    // Trim Punctuation
    public static punctuationTrim = (str: string) => {
        return str.replace(/[.,\[\]\|\/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/ +/g, " ")
    }

    // Proper Case
    public static toProperCase = (str: string) => {
        return str.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            }
        )
    }

    // Shuffle an array
    public static shuffleArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    // Check Message Characters
    public static checkChar = (message: string, num: number, char: string): string => {
        const splitText = Util.splitMessage(message, {maxLength: num, char})
        if (splitText[0]) {
            return splitText[0]
        } else {
            return String(splitText)
        }
    }

    // Remove duplicates
    public static removeDuplicates = <T>(array: T[]) => {
        return array.filter((a, b) => array.indexOf(a) === b)
    }

    // Remove duplicate object keys
    public static removeDuplicateObjectKeys = <T>(array: any[], key: string): T[] => {
        return Array.from(new Set(array.map((a) => a[key])))
        .map((k) => {
          return array.find((a: any) => a[key] === k)
        })
    }

    // Fill Array
    public static fillArray<T>(arr: T[], value: T, len: number) {
        while (arr.length !== len) {
          arr.push(value)
        }
        return arr
      }

    // Remove from Array
    public static arrayRemove = (arr: string[], val: string) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
              arr.splice(i, 1)
              i--
            }
         }
    }

    // Random Color
    public static randomColor = () => {
        return Number(Functions.colors[Math.floor(Math.random() * Functions.colors.length)])
    }

    // Combine args after an index
    public static combineArgs = (args: string[], num: number) => {
        let combined = ""
        for (let i = num; i < args.length; i++) {
            combined += args[i] + " "
        }
        return combined
    }

    // Check args
    public static checkArgs = (args: string[], num: string) => {
        switch (num) {
            case "single": {
                if (!args[0]) {
                    return false
                } else {
                    return true
                }

            }
            case "multi": {
                if (!args[0] || !Functions.combineArgs(args, 1)) {
                    return false
                } else {
                    return true
                }
            }
            default: return false
        }
    }

    // Sort object array
    public static sortObjectArray = (array: any[], key: string, order: "desc" | "asc", type?: "number" | "string") => {
        if (!type) type = "number"
        const compare = (key: string, order = "asc", type = "number") => {
            return function innerSort(a: any, b: any) {
              if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0
              }
              let varA: any
              let varB: any
              if (type === "number") {
                varA = a[key].match(/\d+/) ? Number(a[key].replace(/,/g, "").match(/\d+/)[0]) : 0
                varB = b[key].match(/\d+/) ? Number(b[key].replace(/,/g, "").match(/\d+/)[0]) : 0
              } else {
                varA = a[key].toUpperCase()
                varB = b[key].toUpperCase()
              }

              let comparison = 0
              if (varA > varB) {
                comparison = 1
              } else if (varA < varB) {
                comparison = -1
              }
              return (
                (order === "desc") ? (comparison * -1) : comparison
              )
            }
        }
        return array.sort(compare(key, order, type))
    }

}
