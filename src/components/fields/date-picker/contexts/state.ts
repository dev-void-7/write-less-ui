import { Context, createContext, useContext } from "solid-js";
import { State } from "../domain/state.js";
import { Output } from "../domain/props.js";

export const DatePickerContext = createContext<State<any>>();

export const useDatePickerContext = <T extends Output>() =>
    useContext(DatePickerContext as Context<State<T>>);
