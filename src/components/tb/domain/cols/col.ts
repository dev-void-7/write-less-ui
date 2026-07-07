import { ColGroup, ColGroupArg } from "./col-group.js";
import { ColLeaf, ColLeafArg } from "./col-leaf.js";

export type Col = ColGroup | ColLeaf;
export type ColArg = string | (() => string) | ColGroupArg | ColLeafArg;
