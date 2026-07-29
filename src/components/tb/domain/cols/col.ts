import { ColGroup, ColGroupArg } from "./col-group.js";
import { ColLeaf, ColLeafArg } from "./col-leaf.js";

export type Col<S = unknown> = ColGroup<S> | ColLeaf<S>;
export type ColArg<S> = string | (() => string) | ColGroupArg<S> | ColLeafArg<S>;
