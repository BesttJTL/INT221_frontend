import { defineStore, acceptHMRUpdate } from "pinia";
import {ref, reactive} from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const getMode = defineStore('mode', () => {
    const setMode = useLocalStorage('mode','active')
    const checkUishow = useLocalStorage('uiShow', false)
    const getPageNumber = useLocalStorage('pageNumber', 0)
    const getCloseMode = useLocalStorage('closePage',0)
    const getCategory = useLocalStorage('categoryId',0)
    const getSetMode = (X) => {
        setMode.value = X
    }
    const setUishow = () => {
        checkUishow.value = !checkUishow.value
    } 
    const setGetPage = (X) => {
        getPageNumber.value = X
    }
    const setCategory = (x) => {
        getCategory.value = x
    }
    return { setMode, getSetMode, checkUishow, setUishow, setGetPage, getPageNumber, getCloseMode, getCategory, setCategory }
})

// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(getMode, import.meta.hot))
// }