import { Context, createContext, useContext } from "solid-js";
import { State } from "./domain/state.js";

export const CtxMenuContext = createContext<State<any>>();

export const useCtxMenuContext = <T>() => useContext(CtxMenuContext as Context<State<T>>);
