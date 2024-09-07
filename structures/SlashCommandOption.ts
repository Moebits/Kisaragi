import { 
    ApplicationCommandOptionType, 
    SlashCommandStringOption, 
    SlashCommandBooleanOption, 
    SlashCommandAttachmentOption,
    SlashCommandChannelOption, 
    SlashCommandIntegerOption, 
    SlashCommandMentionableOption, 
    SlashCommandNumberOption, 
    SlashCommandRoleOption,
    SlashCommandUserOption 
} from "discord.js"

export type ApplicationCommandOptionStringType =
	| "attachment"
	| "boolean"
	| "channel"
	| "integer"
	| "mentionable"
	| "number"
	| "role"
	| "string"
	| "user"

export type ApplicationCommandOptionEnumTypeMap<OptionType extends ApplicationCommandOptionType | undefined> =
	OptionType extends ApplicationCommandOptionType.Attachment ? SlashCommandAttachmentOption : 
	OptionType extends ApplicationCommandOptionType.Boolean ? SlashCommandBooleanOption : 
	OptionType extends ApplicationCommandOptionType.Channel ? SlashCommandChannelOption : 
	OptionType extends ApplicationCommandOptionType.Integer ? SlashCommandIntegerOption : 
	OptionType extends ApplicationCommandOptionType.Mentionable ? SlashCommandMentionableOption : 
	OptionType extends ApplicationCommandOptionType.Number ? SlashCommandNumberOption : 
	OptionType extends ApplicationCommandOptionType.Role ? SlashCommandRoleOption : 
	OptionType extends ApplicationCommandOptionType.String ? SlashCommandStringOption : 
	OptionType extends ApplicationCommandOptionType.User ? SlashCommandUserOption : never

export type ApplicationCommandOptionStringTypeMap<OptionType extends ApplicationCommandOptionStringType | undefined> =
	OptionType extends "attachment" ? SlashCommandAttachmentOption : 
	OptionType extends "boolean" ? SlashCommandBooleanOption : 
	OptionType extends "channel" ? SlashCommandChannelOption : 
	OptionType extends "integer" ? SlashCommandIntegerOption : 
	OptionType extends "mentionable" ? SlashCommandMentionableOption : 
	OptionType extends "number" ? SlashCommandNumberOption : 
	OptionType extends "role" ? SlashCommandRoleOption : 
	OptionType extends "string" ? SlashCommandStringOption : 
	OptionType extends "user" ? SlashCommandUserOption : never

export type ApplicationCommandOptionTypeMap<OptionType extends ApplicationCommandOptionStringType | ApplicationCommandOptionType | undefined> = 
	OptionType extends ApplicationCommandOptionType ? ApplicationCommandOptionEnumTypeMap<OptionType> : 
	OptionType extends ApplicationCommandOptionStringType ? ApplicationCommandOptionStringTypeMap<OptionType> : 
	SlashCommandStringOption

export class SlashCommandOption {
	public static createOption<OptionType extends ApplicationCommandOptionStringType | ApplicationCommandOptionType | undefined = "string">(type?: OptionType) {
		const typeParam = type ?? ApplicationCommandOptionType.String
		switch (typeParam) {
			case ApplicationCommandOptionType.Attachment:
				return new SlashCommandAttachmentOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.Boolean:
				return new SlashCommandBooleanOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.Channel:
				return new SlashCommandChannelOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.Integer:
				return new SlashCommandIntegerOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.Mentionable:
				return new SlashCommandMentionableOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.Number:
				return new SlashCommandNumberOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.Role:
				return new SlashCommandRoleOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.String:
				return new SlashCommandStringOption() as ApplicationCommandOptionTypeMap<OptionType>
			case ApplicationCommandOptionType.User:
				return new SlashCommandUserOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "attachment":
				return new SlashCommandAttachmentOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "boolean":
				return new SlashCommandBooleanOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "channel":
				return new SlashCommandChannelOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "integer":
				return new SlashCommandIntegerOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "mentionable":
				return new SlashCommandMentionableOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "number":
				return new SlashCommandNumberOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "role":
				return new SlashCommandRoleOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "string":
				return new SlashCommandStringOption() as ApplicationCommandOptionTypeMap<OptionType>
			case "user":
				return new SlashCommandUserOption() as ApplicationCommandOptionTypeMap<OptionType>
			default:
				throw new Error(`Unsupported option type: ${typeParam}`)
		}
	}
}