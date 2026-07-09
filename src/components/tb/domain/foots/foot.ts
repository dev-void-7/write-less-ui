import { FootGroup, FootGroupArg } from "./foot-group.js";
import { FootLeaf, FootLeafArg } from "./foot-leaf.js";

export type Foot = FootGroup | FootLeaf;
export type FootArg = string | (() => string) | FootGroupArg | FootLeafArg;
