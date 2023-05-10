<script setup>
import { onBeforeMount, reactive,ref  } from 'vue';
const fetchback = import.meta.env.VITE_ROOT_API
const isFetch = ref(true);
const isFetchFailed = ref(false)
const isDeleteComplete=ref(false)
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

    const showAllAnnouncement = reactive([])
 
    onBeforeMount(async()=> {
       await allAnnouncements()
    })

    const allAnnouncements = async() => {
        isFetch.value = true
    const res = await fetch(`${fetchback}/api/announcements`)
    try{
        if(res.ok){
            const all = await res.json()
            showAllAnnouncement.push(...all)
            isFetch.value = false
        }
    }
    catch(err){
        alert(err)
    }
}

const deleteMethod = async (id) => {
    const msg = "Do you want to delete"
    if(confirm(msg) === true){
        try{
        const del = await fetch(`${fetchback}/api/announcements/${id}`, {
            method: 'DELETE',
        })
            if(del.status === 200){
                document.location.reload()
            }
            if(del.status === 404){
                const texterror = await del.json() 
                alert(texterror.message)
                document.location.reload()
            }
        }
        catch(err){
        alert("Delete failed:" + err)
        }
    }
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

        <div>
            <div class="flex flex-row pt-5 px-2 w-full">  
                <div class="w-1/2 flex flex-row justify-start">
                <p class="pl-3 text-md font-bold text-gray-300">Date/Time shown in Timezone : </p> 
                <p class="pl-1 text-md font-normal"> <span class="text-[#24BB78]">{{ timezone }}</span></p>
                </div>
                <div class="w-1/2 flex justify-end">
                <router-link to="/admin/announcement/add" class="ann-button bg-transparent hover:bg-[#24e78f] text-[#24e78f] font-semibold hover:text-black py-2 px-4 border border-[#24e78f] hover:border-transparent rounded duration-200 mr-5">
                    Add Announcement
                </router-link>
                </div>
            </div>

            <div v-if="showAllAnnouncement.length === 0" class="pt-5 pl-5 w-screen h-full">
                <p class="text-red-500 text-3xl font-medium text-center mt-36">No Announcement</p>
            </div>
            
            <div v-else class="p-5 w-full h-full bg-[#1C191C]">
                <table class="w-full h-full">
                    <thead>
                    <tr class="border-grey-300 border-b rounded-2xl h-14">
                        <th class="text-center w-24">No</th>
                        <th class="text-start w-64">Title</th>
                        <th class="text-start w-36">Category</th>
                        <th class="text-start w-32">Publish Date</th>
                        <th class="text-start w-32">Close Date</th>
                        <th class="text-center w-24">Display</th>
                        <th class="text-center w-32">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="ann-item h-20 border-b border-grey" v-for="(announcement, index) in showAllAnnouncement" :key="announcement.announcementId">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td class="ann-title">{{ announcement.announcementTitle }}</td>
                        <td class="ann-category">{{ announcement.announcementCategory }}</td>
                        <td v-if = "announcement.publishDate" class="ann-publish-date">{{ new Date(announcement.publishDate).toLocaleString("en-GB",{dateStyle: "medium", timeStyle: "short"}) }}</td>
                        <td v-else class="ann-publish-date">-</td>
                        <td v-if="announcement.closeDate" class="ann-close-date">{{ new Date(announcement.closeDate).toLocaleString("en-GB",{dateStyle: "medium", timeStyle: "short"}) }}</td>
                        <td v-else class="ann-close-date">-</td>
                        <td class="ann-display text-center">{{ announcement.announcementDisplay }}</td>
                        <td class="text-center flex flex-row justify-center mt-5 gap-x-3">
                            <router-link :to="{ name: 'detailAnnouncement', params: { id: announcement.id}}">
                                <button class="ann-button bg-transparent hover:bg-[#24e78f] text-[#24e78f] font-semibold hover:text-black py-2 px-4 border border-[#24e78f] hover:border-transparent rounded duration-200">view</button>
                            </router-link>
                            <button class="ann-button bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-300 hover:border-transparent rounded duration-200" @click="deleteMethod(announcement.id)">Delete</button>
                        </td>
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

