<script setup>
import { ref } from 'vue';
const fetchback = import.meta.env.VITE_ROOT_API
const isFetch = ref(true);
const isFetchFailed = ref(false)
import MakiDanger11Vue from './MakiDanger11.vue'
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

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
        <div class="w-1/2 flex flex-row justify-start">
            <p class="pl-3 text-md font-bold text-gray-300">Date/Time shown in Timezone : </p> 
            <p class="pl-1 text-md font-normal"> <span class="text-[#24BB78]">{{ timezone }}</span></p>
        </div>
        <div class="w-1/2 flex justify-end">
            <button class="ann-button bg-transparent hover:bg-[#24e78f] text-[#24e78f] font-semibold hover:text-black py-2 px-4 border border-[#24e78f] hover:border-transparent rounded duration-200 mr-5">
                    Closed Announcement
            </button>
        </div>
     </div>
    
     <div>
        <div v-if="false" class="pt-5 pl-5 w-screen h-full">
                <p class="text-red-500 text-3xl font-medium text-center mt-36">No Announcement</p>
        </div>
        <div v-else class="p-5 w-full h-full bg-[#1C191C]">
                <table class="w-full h-full">
                    <thead>
                    <tr class="border-grey-300 border-b rounded-2xl h-14">
                        <th class="text-center w-1/12">No</th>
                        <th class="text-start w-9/12">Title</th>
                        <th class="text-start w-2/12">Category</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="ann-item h-20 border-b border-grey">
                        <td class="text-center">dd</td>
                        <td class="ann-title">dd</td>
                        <td class="ann-category">dd</td>
                    </tr>
                </tbody>
                </table>
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
</style>