<script setup>
import { onBeforeMount, ref, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMode } from '../stores/getMode';
const mode = getMode()
const fetchback = import.meta.env.VITE_ROOT_API
const { params } = useRoute()
const router = useRouter() 


    const showToUser = ref([])

    onBeforeMount(async() => {
        showToUser.value = await getUserDetail(mode.setMode)
        // console.log(showToUser.value)
        
    })

    const getUserDetail = async(x) => {
        const res = await fetch(`${fetchback}/api/announcements/${params.id}?mode=${x}`)
        try{
            if(res.ok){
                const show = await res.json()
                return show
            }
            if(res.status === 404){
                const notFound = await res.json()
                alert(notFound.message)
                router.push({ name:'announcement' })
            }
        }
        catch(err){
            alert(err)
        }
    }

</script>
 
<template>
<div class="w-screen h-screen bg-[#1C191C] pt-16 text-gray-300">
    <div class="p-5">
        <div class="border-2 border-gray-300 rounded-md p-5 space-y-3 h-auto">
            <p class="ann-title font-bold text-3xl">{{ showToUser.announcementTitle }}</p>
            <div class="flex flex-row w-full">
                <div class="flex justify-start w-1/2">
                    <span class="ann-category font-semibold text-md text-gray-300">{{ showToUser.announcementCategory }}</span>
                </div>
                <div class="flex justify-end w-1/2" v-if="mode.setMode === 'close'">
                    <span class="font-semibold text-md text-red-400">Closed on:</span>
                    <span class="ann-close-date pl-2 font-semibold text-gray-300">{{ showToUser.closeDate }}</span>
                </div>
            </div>
            <p class="ann-description font-normal text-md">{{ showToUser.announcementDescription }}</p>
            <div>
            <router-link to="/announcement">
                <button class="ann-button bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-300 hover:border-transparent rounded-md duration-200">
                    Back
                </button>
            </router-link>
            </div>
        </div>
    </div>
</div>
</template>
 
<style scoped>
 p{
        color:#24BB78;
    }

</style>