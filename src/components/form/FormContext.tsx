import { createContext, useContext } from "solid-js";
import { FormState } from "./state.js";

export const FormContext = createContext<FormState>();

export const useFormContext = () => useContext(FormContext);
