import {type TypeBaseColor} from "@/lib/constants/collors.contants";

export interface ConfigStore {
    theme:TypeBaseColor,
    setTheme: (theme:TypeBaseColor) => void;
}