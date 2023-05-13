import { defineStore, acceptHMRUpdate } from "pinia";
import {ref, reactive} from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const getMode = defineStore('mode', () => {
    const setMode = useLocalStorage('mode','active')
    const checkUishow = useLocalStorage('uiShow', false)
    const getSetMode = (X) => {
        setMode.value = X
    }
    const setUishow = () => {
        checkUishow.value = !checkUishow.value
    } 
    return { setMode, getSetMode, checkUishow, setUishow }
})

// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(getMode, import.meta.hot))
// }