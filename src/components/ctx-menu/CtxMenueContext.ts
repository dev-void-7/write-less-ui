import { Accessor, Context, createContext, useContext } from "solid-js";

export const CtxMenuContext = createContext<Accessor<any>>();

export const useCtxMenuContext = <T>() => useContext(CtxMenuContext as Context<Accessor<T>>);
