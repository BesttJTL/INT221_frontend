import { defineStore, acceptHMRUpdate } from "pinia";
import {ref, reactive} from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const getMode = defineStore('mode', () => {
    const setMode = useLocalStorage('mode','active')
    const getSetMode = (X) => {
        setMode.value = X
    }
    return { setMode, getSetMode }
})

// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(getMode, import.meta.hot))
// }