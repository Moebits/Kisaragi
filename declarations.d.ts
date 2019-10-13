import {ClientBase} from "pg"

declare module "redis" {
    export interface RedisClient extends Commands<boolean>, NodeJS.EventEmitter {
        setAsync(key: string, value: string): Promise<void>
        getAsync(key: string): Promise<string>
        flushdbAsync(): Promise<void>
    }
}

declare module "pg" {
    export interface PoolClient extends ClientBase {
        release(err?: Error | boolean): void
    }    
}

declare module "syllable" {
    export default function syllable(value: string): number
}