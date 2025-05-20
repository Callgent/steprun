import { create } from "zustand"
import { GlobalStore } from "../types/global";

export const useGlobalStore = create<GlobalStore>()(
    (set, get) => ({
        params: {}
    })
)
