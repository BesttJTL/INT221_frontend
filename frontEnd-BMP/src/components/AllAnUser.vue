<script setup>
import { mergeProps, onBeforeMount, onMounted, reactive, ref, watch} from 'vue';
import MakiDanger11Vue from './MakiDanger11.vue'
import { getMode } from '../stores/getMode';
const mode = getMode()
const fetchback = import.meta.env.VITE_ROOT_API
const isFetch = ref(true);
const isFetchFailed = ref(false)
const propsMode = ref('active')
const showButton = reactive([])
const categoryId = ref(0)
const allcategory = reactive([])
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const showIndex = ref(0)
const showUserAllAnnouncement = reactive([])
const getTotal = ref(false)
const getButton = ref(0)
const uiShowButton = ref('Closed Announcements')

    // Fetching Timeout in 10 seconds (if exceed or more will hide)
    const fetchTimeout = () =>{
        setTimeout(() => {
            if(isFetch.value === true){
                isFetch.value = false
                isFetchFailed.value = true
            }
        },10000)
    }
    fetchTimeout()

    onBeforeMount(async() => {
        showUserAllAnnouncement.length = 0
        await getCategory()
        categoryId.value = mode.getCategory
        await getPageAnnouncement(mode.setMode,mode.getPageNumber)
        await chcekModeButton()
    })

    onMounted(async() => {
        if(mode.setMode === 'close'){
            uiShowButton.value = 'Active Announcements'
        }else {
            uiShowButton.value = 'Closed Announcements'
        }
        //fix
    })


    const getPageAnnouncement = async(x,y) => {
        isFetch.value = true
        let textCategory = ''
        if(categoryId.value !== 0){
            textCategory = `&category=${mode.getCategory}`
        }
    
        const res = await fetch(`${fetchback}/api/announcements/pages?mode=${x}&page=${y}${textCategory}`)
        try{
            if(res.ok){
                const all = await res.json()
                // console.log(all[0].totalPages)
                showIndex.value = mode.getPageNumber*5
                if(all.totalElements > 5){
                    getTotal.value = true
                    getButton.value = all.totalPages
                }else{
                    getTotal.value = false
                }
                showUserAllAnnouncement.push(...all.content)
                isFetch.value = false
            }
        }
        catch(err){
            alert(err)
        }
    }

    const chcekModeButton = async() => {
        showButton.length = 0
        if(getTotal.value === true){
            if(mode.getPageNumber > 9){
            let num = (mode.getPageNumber+1)-10
            await checkButtonPage(getButton.value,num)
        } 
        if(mode.getPageNumber < 9){
            for(let i = 1 ; i <= getButton.value ; ++i){
            if(i <= 10){
            showButton.push(i)
            }
        }
    }
}
    }
    
    const changeView = async() => {
        showUserAllAnnouncement.length = 0 
        mode.setUishow()
        if(mode.checkUishow === true){
            // await allUserAnnouncement('close')
            mode.getSetMode('close')
            // await allUserAnnouncement(mode.setMode)
            mode.setGetPage(0)
            await getPageAnnouncement(mode.setMode,mode.getPageNumber)
            await chcekModeButton()
            if(mode.setMode === 'close'){
                uiShowButton.value = 'Active Announcements'
            }
            
        }
        else {
            // await allUserAnnouncement('active')
            mode.getSetMode('active')
            // await allUserAnnouncement(mode.setMode)
            await getPageAnnouncement(mode.setMode,mode.getPageNumber)
            await chcekModeButton()
            if(mode.setMode === 'active'){
                uiShowButton.value = 'Closed Announcements'
            }
        }
    }

    const disablePrev = ref(false)
    const disableNext = ref(false)
    const activeButton = ref(null)

    const getId = async(num) => {
        mode.setGetPage(num-1)
        showUserAllAnnouncement.length = 0 
        await getPageAnnouncement(mode.setMode,mode.getPageNumber)
        activeButton.value = num;
    }

    watch(() => mode.getPageNumber, (x) => {
        if(x !== 0){
            disablePrev.value = true // reverse binding :disabled="!disablePrev
        } else if(x === 0){
            disablePrev.value = false
        }
        
        if(x !== getButton.value-1){
            disableNext.value = false
        } else {
            disableNext.value = true
        }
    })


    const nextPage = async() => {
      mode.setGetPage(mode.getPageNumber+1)
      showUserAllAnnouncement.length = 0
      await getPageAnnouncement(mode.setMode,mode.getPageNumber)
      if(mode.getPageNumber >= showButton[showButton.length-1]){
        let num = (mode.getPageNumber+1)-10
        await checkButtonPage(getButton.value,num)
      }
}

const checkButtonPage = async(x,y) => {
        showButton.length = 0
        let num = 10 + y
        for(let i = y+1 ; i <= num ; ++i){
                // if(i <= num){
                showButton.push(i)
                // }
            }
    }


const prevPage = async() => {
      mode.setGetPage(mode.getPageNumber-1)
      showUserAllAnnouncement.length = 0
      await getPageAnnouncement(mode.setMode,mode.getPageNumber)
      if(mode.getPageNumber <= showButton[0]){
        await checkButtonPage(getButton.value,mode.getPageNumber)
      }
}




    const getCategory = async() => {
            const res = await fetch(`${fetchback}/api/category`)
            try{
                const category = await res.json()
                allcategory.push(...category)
                
            }
            catch(err){
                alert(err)
            }
    }


    const selectCategory = async() => {
        showUserAllAnnouncement.length = 0
        mode.setCategory(categoryId.value)
        mode.setGetPage(0)
        await getPageAnnouncement(mode.setMode,mode.getPageNumber)
        await chcekModeButton()
    }
</script>
 
<template>
<div class="w-screen h-screen bg-[#1C191C] pt-16 text-gray-300">
    <div class="pt-5">
            <div class="space-y-5">
                    <h1 class="flex text-4xl font-bold mt-5 justify-center text-[#24BB78] ">SIT Announcement System (SAS)</h1>
                <h1 class="text-2xl flex justify-center text-center"></h1>
                <div class="flex justify-center text-center">
                    <div v-show="isFetch" class="flex flex-col gap-y-3">
                        <img src="/loading.gif">
                        <p>Fetching...</p>
                    </div>
                    <p v-show="isFetchFailed" class="text-red-400 text-xl flex flex-row gap-x-4 "> <MakiDanger11Vue class="mt-1"/> Fetch Timeout Exceeded, Try again.</p>
                </div>
            </div>
    </div>
    <div class="flex flex-row pt-5 px-2 w-full">  
        <div class="w-1/2 flex flex-col justify-start space-y-3">
            <div class="flex flex-row" >
            <p class="pl-3 text-md font-bold text-gray-300">Date/Time shown in Timezone : </p> 
            <p class="pl-1 text-md font-normal"> <span class="text-[#24BB78]">{{ timezone }}</span></p>
            </div>
            <div class="pl-3 text-md font-bold text-gray-300 flex flex-row space-x-3">
                <p class="pt-1">Choose Category : </p>
                <select class="ann-category-filter  px-4 py-2 border-2 border-gray-200 rounded-md text-sm font-normal flex justify-center text-center" 
                v-model="categoryId" v-on:change="selectCategory">
                        <option :value="0">ทั้งหมด</option> 
                        <option v-for="showcat in allcategory" :key="showcat.categoryId" :value="showcat.categoryId">{{ showcat.categoryName }}</option> 
                </select>
            </div>
        </div>
        <div class="w-1/2 flex justify-end">
            <button class="ann-button h-12 bg-transparent hover:bg-[#24e78f] text-[#24e78f] font-semibold hover:text-black py-2 px-2 border border-[#24e78f] hover:border-transparent rounded duration-200 mr-5" @click="changeView">
                    {{ uiShowButton }}
            </button>
        </div>
     </div>
    
     <div>
        <div v-if="showUserAllAnnouncement.length === 0" class="pt-5 pl-5 w-screen h-full">
                <p class="text-red-500 text-3xl font-medium text-center mt-36">No Announcement</p>
        </div>

        <div v-else class="p-5 w-full h-full bg-[#1C191C]">
                <table class="w-full h-full">
                    <thead>
                    <tr class="border-grey-300 border-b rounded-2xl h-14">
                        <th class="text-center w-1/12">No</th>
                        <th class="text-start w-7/12">Title</th>
                        <th class="text-start w-2/12" v-if="mode.setMode === 'close'">Closed Date</th>
                        <th class="text-start w-1/12">Category</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="ann-item h-20 border-b border-gray" v-for="(showUser, index) in showUserAllAnnouncement" :key="showUser.id" >
                        <td class="text-center">{{ showIndex + index + 1 }}</td>
                        <td class="ann-title"><router-link :to="{ name: 'userDetailAnnouncement', params: { id: showUser.id}}" :mode="propsMode">{{ showUser.announcementTitle }}</router-link></td>
                        <td class="ann-close-date" v-if="mode.setMode === 'close'">{{ new Date(showUser.closeDate).toLocaleString("en-GB",{dateStyle: "medium", timeStyle: "short"})  }}</td>
                        <td class="ann-category">{{ showUser.announcementCategory }}</td>
                    </tr>
                </tbody>
                </table>
                <div class="flex justify-start mt-5 gap-x-2" v-if="getTotal">
                 <button class="ann-page-prev w-20 mr-2 rounded-md border-gray-300 py-1 px-2" :disabled="!disablePrev" @click="prevPage">Prev</button>
                 <button class="w-20 border-gray-300 py-1 px-2" :class="[mode.getPageNumber === num-1 ? 'bg-[#24e78f] border-2 border-green-300 rounded-md text-black' :  'bg-red border-2 border-green-300 rounded-md',`ann-page-${index}`]" 
                 v-for="(num,index) in showButton" :key="num" @click="getId(num)">{{ num }}</button>
                 <button class="ann-page-next w-20 rounded-md border-gray-300 py-1 px-2" :disabled="disableNext" @click="nextPage">Next</button>   
               </div>
        </div>
    </div>
</div>
</template>
 
<style scoped>
td{
    color: #24e78f ;
}
tr:hover{
    background-color:rgb(36, 231, 143,0.05) ;
    transition-duration: 200ms;
}
/* .num {
    background-color:#24e78f;
} */
</style>