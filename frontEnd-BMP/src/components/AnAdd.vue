<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
const fetchback = import.meta.env.VITE_ROOT_API
const router = useRouter()

    const allcategory = reactive([])
    
    onBeforeMount(async() => {
        await getCategory()
    })
    
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

    const title = ref('')
    const category = ref(0)
    const desc = ref('')
    const pdate = ref()
    const ptime = ref()
    const cdate = ref()
    const ctime = ref()
    const display = ref(false)
    
    const publishDateiso = ref()
    const closeDateiso = ref()
    const truepub = ref(false)
    const trueclose = ref(false)
    const showErrorpub = ref(false)
    const showErrorclose = ref(false)
    const displayErrorpub = ref()
    const displayErrorclose = ref()


    const addAnnouncement = () => {
    
    //display default setting to 'N'
    if(display.value === false){
        display.value = 'N'
    }
    else {
        display.value = 'Y'
    }

    publishDateiso.value = setTimeFuc(pdate.value,ptime.value)
    closeDateiso.value = setTimeFuc(cdate.value,ctime.value)
    
    //show display date and time if not insert
    setInsertFuc()

    if(publishDateiso.value !== 'date' && publishDateiso.value !== 'time'){
        truepub.value = true
    }
    else if(publishDateiso.value === undefined){
        truepub.value = true
    }
    else{
        truepub.value = false
    }

    if(closeDateiso.value !== 'date' && closeDateiso.value !== 'time'){
        trueclose.value = true
    }
    else if(closeDateiso.value === undefined){
        trueclose.value = true
    }
    else{
        trueclose.value = false
    }

    if(truepub.value === true && trueclose.value === true){
        addToBackend()
    }
}

    const setTimeFuc = (date,time) => {
        if(date !== undefined && time !== undefined){
            const x = new Date(`${date} ${time}`)
            return x.toISOString()
        }
        else if(date === undefined && time !== undefined){
            return 'date'
        }
        else if(time === undefined && date !== undefined){
            return 'time'
        }
    }

    const setInsertFuc = () => {
        if(publishDateiso.value === 'date' || publishDateiso.value === 'time'){
            showErrorpub.value = true
            displayErrorpub.value = publishDateiso.value
    }
        if(closeDateiso.value === 'date' || closeDateiso.value === 'time'){
            showErrorclose.value = true
            displayErrorclose.value = closeDateiso.value
        }   
    }

    
    const addToBackend = async() => {
        try{
        const res = await fetch(`${fetchback}/api/announcements`,{
            method: 'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                announcementTitle:title.value,
                categoryId:category.value,
                announcementDescription:desc.value,
                publishDate:publishDateiso.value,
                closeDate:closeDateiso.value,
                announcementDisplay:display.value
            })
        })
        if(res.ok){
            console.log('okay')
            router.push('/')
        }
        if(res.status === 404){
            const one = await res.json()
            alert(one.message)
        }
        if(res.status === 400){
            const msg = await res.json()
            const text = msg.detail
            for(let i = 0; i < msg.detail.length ; i++){
                alert(`${text[i].field} = ${text[i].errorMessage}`)
            }
        }
    }
    catch(err){
        alert(err)
    }
}
//pbi12
    const showNumtitle = ref(0)
    const showErrortitle = ref(false)
    const maxtitle = ref(200)
    const checkTitle = () => {
        const counttilte = title.value.trim()
        if(counttilte.length >= 200){
            showErrortitle.value = true
        }else{
             showErrortitle.value = false
        }
        showNumtitle.value = counttilte.length
    }


    const validateTime = () => {
        const currentDate = new Date();
        const publishDate = setTimeFuc(pdate.value,ptime.value)
        const closeDate = setTimeFuc(cdate.value,ctime.value)
        

        if (pdate.value && publishDate > currentDate.toISOString()) {
            showErrorpub.value = true;
            displayErrorpub.value = "Publish date should be earlier than or equal to the current date.";
        } else {
            showErrorpub.value = false;
    }

        if (cdate.value && currentDate >= closeDate) {
            showErrorclose.value = true;
            displayErrorclose.value = "Close date should be later than the current date.";
        } else {
            showErrorclose.value = false;
    }
    }

    const maxDesc = ref(100)
    const minDesc = ref(0)
    const disDesc = ref()
    const checkDesc = () => {
        minDesc.value = desc.value.trim().length
        if(minDesc.value <= maxDesc.value){
            disDesc.value = false
        }
        else if(minDesc.value > maxDesc.value){
            disDesc.value = true
        }
    }

</script>
 
<template>
    <div class="text-white w-full h-full ">
        <div class="bg-[#1C191C] w-full h-screen text-gray-300">
            <h1 class="flex text-5xl font-bold text-[#24e78f] pl-5 pt-10 text-sanfi">ANNOUNCEMENT DETAIL:</h1>
            <div class="p-5 space-y-1 ">
        
                <p class="font-semibold">
                    Title
                    <span class="text-white pl-3">{{ maxtitle - showNumtitle }}</span>
                      <span class="text-red-400 pl-3" v-if="showErrortitle">ห้ามเกิน 200 ตัวอักษร</span>
                </p>
                <input type="text" class="ann-title border-2 border-gray-200 rounded-md text-lg w-[70%] h-full p-2 font-normal" v-model="title" v-on:keydown="checkTitle" :maxlength="maxtitle">
                <p class="pt-3 font-semibold">Category</p>
                <select class="ann-category w-1/3 h-full p-2 border-2 border-gray-200 rounded-md text-md font-normal" v-model="category">
                        <option v-for="showcat in allcategory" :key="showcat.categoryId" :value="showcat.categoryId">{{ showcat.categoryName }}</option> 
                </select>
        
                <p class="pt-3 font-semibold">
                    Description
                      <span class="text-red-400 pl-3" v-if="minDesc > maxDesc">ห้ามเกิน 10,000 ตัวอักษร, ไม่งั้นจะส่งไม่ได้</span>
                </p>
 
                <QuillEditor class="ann-description w-[100%] border-2 border-gray-200 rounded-md p-2 text-md font-normal h-auto" v-model:content="desc" :maxlength="maxDesc" v-on:keydown="checkDesc" theme="snow" toolbar="full" contentType="html"/>
            
                <div class="flex flex-row space-x-3">
                    <p class="pt-3 font-semibold">Publish Date</p>
                    <p id="err" class="pt-3 font-normal text-red-400" v-show="showErrorpub">Please enter {{ displayErrorpub }}...</p>
                </div>  
                <div class="space-x-5">
                    <input type="date" class="ann-publish-date w-48 h-auto p-2 border-2 border-gray-200 rounded-md text-md font-normal" v-model="pdate" v-on:change="validateTime">
                    <input type="time" class="ann-publish-time w-48 h-auto p-2 border-2 border-gray-200 rounded-md text-md font-normal" v-model="ptime" v-on:change="validateTime">
                </div>
                
                <div class="flex flex-row space-x-3">
                    <p class="pt-3 font-semibold">Close Date</p>
                    <p id="err" class="pt-3 font-normal text-red-400" v-show="showErrorclose">Please enter {{ displayErrorclose }}...</p>
                </div>  
                <div class="space-x-5">
                    <input type="date" class="ann-close-date w-48 h-auto p-2 border-2 border-gray-200 rounded-md text-md font-normal" v-model="cdate" v-on:change="validateTime">
                    <input type="time" class="ann-close-time w-48 h-auto p-2 border-2 border-gray-200 rounded-md text-md font-normal" v-model="ctime" v-on:change="validateTime">
                </div>
                <p class="pt-2 text-sm text-red-400">Note: The publish date and close date are optional. If you don't want to insert, consider leaving a blank.</p>
        
        
                <p class="pt-3 font-semibold">Display</p>
                <div class="flex gap-x-2 pt-3">
                    <input type="checkbox" checked="checked" class="checkbox checkbox-accent ann-display" v-model="display" />
                    <span class="label-text text-white mt-0.5 ml-3">Checked a checkbox to display an announcement</span> 
                </div>
                <div class="pt-3 space-x-2">
                <input type="submit" value="Submit" :disabled="disDesc" class="ann-button bg-transparent hover:bg-[#24e78f] text-[#24e78f] font-semibold hover:text-black p-3 border border-[#24e78f] hover:border-transparent rounded-md duration-200 " @click="addAnnouncement">
                <RouterLink to="/">
                <input type="button" value="Cancel" class="ann-button bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white p-3 border border-red-300 hover:border-transparent rounded-md duration-200">
                </RouterLink>
                </div>
            </div>
        </div>
        
    </div>
</template>
 
<style scoped>

input{
    color:white;
}

*{
    background-color:#1C191C;
}

input:focus-within, textarea:focus-within{
    background-color: rgba(60, 255, 112, 0.1);
    transition-duration: 200ms;
}
p{
    color:#24e78f;
}

#err{
    color:rgb(248 113 113);
}

</style>