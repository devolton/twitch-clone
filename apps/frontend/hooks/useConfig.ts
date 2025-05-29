import {configStore} from "@/store/config/config.store";

export function useConfig() {
    const {theme,setTheme} = configStore();
    return {theme,setTheme};
}