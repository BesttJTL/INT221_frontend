<script setup>
import { onBeforeMount, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router'
const fetchback = import.meta.env.VITE_ROOT_API
    const { params } = useRoute()   
    const showOneDetail = ref([])
    const router = useRouter()
    
    onBeforeMount(async()=> {
        showOneDetail.value =  await getOneAnnouncement()
        if(!showOneDetail.value){
            alert('The request page is not available')
            router.push('/admin/announcement')
            showOneDetail.value = []
        }
    })
    
    const getOneAnnouncement = async() => {
        const res = await fetch(`${fetchback}/api/announcements/${params.id}`)
        try{
            if(res.ok){
                const one  = await res.json()
                return one 
            }
        }
        catch(err){
            alert(err)
        }
    }
    
    const editAnnouncement = () => {
        router.push({ name: 'editDetail', params: { id: params.id }})
    }
    
</script>

<template>
    <div class= "w-full h-screen bg-[#1C191C] text-white">
        <h1 class="flex text-2xl font-semibold p-5 ">Announcement Details</h1>
        <p class="border-b-2 border-white"></p>
        <div class="flex flex-row p-5 ml-8 w-5/6 h-auto text-start">
           <div class="ann-details flex flex-col gap-y-5 shadow-slate-400">
            <p class="ann-category border-2 border-blue-300 rounded-xl p-1 w-36 h-12 text-center flex justify-center break-words pt-1 ">
                {{ showOneDetail.announcementCategory }}</p>
               <div class="heading-body flex flex-col gap-y-1">
                   <p class="ann-title font-bold text-xl">{{ showOneDetail.announcementTitle }} 
                   </p>
                <p class="ann-description" v-html="showOneDetail.announcementDescription"></p>
            </div>
            <div class="others">
                <div class="date">
                    <span>📅 Publish Date:
                    <span v-if="showOneDetail.publishDate" class="ann-publish-date">{{ new Date(showOneDetail.publishDate).toLocaleString("en-GB",{dateStyle: "medium", timeStyle: "short"}) }}</span>
                    <span v-else class="ann-publish-date">-</span></span>
                    <br>
                    <span>
                    📅 Close Date:
                    <span v-if="showOneDetail.closeDate" class="ann-close-date">{{ new Date(showOneDetail.closeDate).toLocaleString("en-GB",{dateStyle: "medium", timeStyle: "short"}) }}</span>
                    <span v-else class="ann-close-date">-</span>
                    </span>
                </div>
                <p class="ann-display">Announcement Status: {{ showOneDetail.announcementDisplay }}</p>
            </div>
           </div>
        </div>
        <div class="ml-8 mt-5 flex gap-x-5">
            <router-link to="/"><button class="ann-button bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-300 hover:border-transparent rounded-md duration-200">Back</button></router-link>
            <button class="ann-button bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-300 hover:border-transparent rounded-md duration-200" @click="editAnnouncement">Edit</button>
        </div>
    </div>
    </template>
     
    <style scoped>
    p,span{
        color:#24BB78;
    }
    p,span,button{
        font-size:20px;
    }
    
    </style>