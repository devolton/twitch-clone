import {create} from 'zustand'
import {createJSONStorage, persist} from "zustand/middleware";
import {type ConfigStore} from "@/store/config/config.types";
import {type TypeBaseColor} from "@/lib/constants/collors.contants";

export const configStore = create(persist<ConfigStore>(set => ({
        theme: 'turquoise',
        setTheme: (theme: TypeBaseColor) => set({theme})
    }),
    {
        name: 'config',
        storage: createJSONStorage(()=>localStorage)
    }
))