import { Context, createContext, useContext } from "solid-js";
import { State } from "../domain/state.js";

export const TbContext = createContext<State>();

export const useTbContext = <S>() => useContext(TbContext as Context<State<S> | undefined>);
