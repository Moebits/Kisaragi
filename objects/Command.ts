export class Command {
    public readonly aliases: string[];
    public readonly cooldown: number;
    protected constructor(aliases: string[], cooldown: number) {
        this.aliases = aliases;
        this.cooldown = cooldown;
    }
}