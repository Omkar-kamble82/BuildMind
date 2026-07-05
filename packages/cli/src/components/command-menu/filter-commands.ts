import { COMMANDS } from "./commands";
import { type Command } from "./command-types";

export function filterCommands(input: string): Command[] {
    if (input.length === 0) return COMMANDS;
    return COMMANDS
    .filter((cmd) => cmd.name.toLowerCase().startsWith(input.toLocaleLowerCase()));
}