<script setup>
import { Quill, QuillEditor } from '@vueup/vue-quill';
import { onBeforeMount, reactive, ref, watch, computed, onMounted,onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const fetchback = import.meta.env.VITE_ROOT_API
const { params } = useRoute() 
const router = useRouter()

    const showOneDetail = ref([]) // json data of each announcement.
    const allcategory = reactive([])
    const categoryVmodel = ref(0)
    const publishDateIso = ref()
    const closeDateIso = ref()
    const disableButton = ref(true)
    const vModelData = ref({})
    const initialData = ref({})

    onBeforeMount(async()=> {
       showOneDetail.value =  await getOneAnnouncement()
       if(!showOneDetail.value){
            alert('The request page is not available')
            router.push('/admin/announcement')
            showOneDetail.value = []
        } // before mount, fetch data and when user call not exist path, will show error alert.

        if(showOneDetail.value.publishDate !== null){
        showOneDetail.value.publishDate = await getDateTime(showOneDetail.value.publishDate)
        }
        else{
            showOneDetail.value.publishDate = { date: null, time: null }
        }
        if(showOneDetail.value.closeDate !== null){
        showOneDetail.value.closeDate = await getDateTime(showOneDetail.value.closeDate)
        }
        else{
            showOneDetail.value.closeDate= { date: null, time: null }
        }
        //check close and publish date when fetch from backend. If not null, get it. If null, set as null


        //API GET เพื่อหา categoryall เเละเชื่อม v-model 
        await getCategory()

        //Set display
        await setDisplay()


        vModelData.value = {
            announcementTitle: showOneDetail.value.announcementTitle,
            announcementDescription: showOneDetail.value.announcementDescription,
            pubDate: showOneDetail.value.publishDate.date,
            pubTime: showOneDetail.value.publishDate.time,
            closeDate: showOneDetail.value.closeDate.date,
            closeTime: showOneDetail.value.closeDate.time,
            announcementDisplay: showOneDetail.value.announcementDisplay,
            categoryId: categoryVmodel.value
        } // data in input which has been tracked real-time.

        initialData.value = {
            announcementTitle: showOneDetail.value.announcementTitle,
            announcementDescription: showOneDetail.value.announcementDescription,
            pubDate: showOneDetail.value.publishDate.date,
            pubTime: showOneDetail.value.publishDate.time,
            closeDate: showOneDetail.value.closeDate.date,
            closeTime: showOneDetail.value.closeDate.time,
            announcementDisplay: showOneDetail.value.announcementDisplay,
            categoryId: categoryVmodel.value
        } // initial/original data.


        checkTitle()
        checkDesc()
        await validateTime()
    })

    onUpdated(async() => {
        await validateTime()
    })
    
    //pass
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

    //pass
    const getDateTime = async(dateTime) => {
            const format = new Date(dateTime)
            const dateDisplay = format.toLocaleDateString('en-CA', {dateStyle: "short"})
            const timeDisplay = format.toLocaleTimeString('it-IT',{ hour: "2-digit", minute: "2-digit" })
            return { date: dateDisplay, time: timeDisplay }
    }

    //pass
    const getCategory = async() => {
        const res = await fetch(`${fetchback}/api/category`)
        try{
            const category = await res.json()
            allcategory.push(...category)
            categoryVmodel.value = allcategory.filter(x  => x.categoryName === showOneDetail.value.announcementCategory)[0].categoryId
        }
        catch(err){
            alert(err)
        }
    }
    
    const setDisplay = async() => {
        if(showOneDetail.value.announcementDisplay === 'N'){
            showOneDetail.value.announcementDisplay = false
        }
        else{
            showOneDetail.value.announcementDisplay = true
        }
    }

    const isPubTimeDisabled = ref(false)
    const isCloseTimeDisabled = ref(false)
    
    const validateTime = async() => {
        isPubTimeDisabled.value = vModelData.value.pubDate === null ? true : false
        isCloseTimeDisabled.value = vModelData.value.closeDate === null ? true : false
    }


    //เช็คค่าขยับหรือไม่ เเละทำให้ปุ่ม on-off
    const fixdata = () => {
        vModelData.value.categoryId = categoryVmodel.value;
        if (JSON.stringify(initialData.value) === JSON.stringify(vModelData.value)) {
            disableButton.value = true;
         } else {
            //เช็คค่าถ้าเกิน 10000 ห้ามส่ง
            if(minDesc.value > maxDesc.value){
                disableButton.value = true;
            }else{
                disableButton.value = false;
            }

    };

    const currentDate = new Date();
    const publishDate = new Date(`${vModelData.value.pubDate} ${vModelData.value.pubTime}`);
    const closeDate = new Date(`${vModelData.value.closeDate} ${vModelData.value.closeTime}`);

        if (vModelData.value.pubDate && publishDate > currentDate) {
            showErrorpub.value = true;
            displayErrorpub.value = "Publish date should be earlier than or equal to the current date.";
            disableButton.value = true;
        } else {
            showErrorpub.value = false;
            if(vModelData.value.pubDate !== null){
                isPubTimeDisabled.value = false;
                vModelData.value.pubTime = '06:00'
            }
    }

        if (vModelData.value.closeDate && currentDate >= closeDate) {
            showErrorclose.value = true;
            displayErrorclose.value = "Close date should be later than the current date.";
            disableButton.value = true;
        } else {
            showErrorclose.value = false;
            if(vModelData.value.closeDate !== null){
                isCloseTimeDisabled.value = false;
                vModelData.value.closeTime = '18:00'
            }
    }
}
        
    const truepub = ref(false)
    const trueclose = ref(false)
    const showErrorpub = ref(false)
    const showErrorclose = ref(false)
    const displayErrorpub = ref()
    const displayErrorclose = ref()

    const submitEdit = async() => {
        publishDateIso.value = await setTimeFn(vModelData.value.pubDate,vModelData.value.pubTime)
        closeDateIso.value = await setTimeFn(vModelData.value.closeDate,vModelData.value.closeTime)
        
        setInsertFuc()

        //set display
        vModelData.value.announcementDisplay = vModelData.value.announcementDisplay === false ? 'N' : 'Y';
        truepub.value = publishDateIso.value !== 'date' && publishDateIso.value !== 'time';
        trueclose.value = closeDateIso.value !== 'date' && closeDateIso.value !== 'time';

        if(truepub.value === true && trueclose.value === true){
          updateDetails()
        }
    }
    //pass
    const setTimeFn = async(date,time) => {
        if(date !== null && time.length !== null){
            if(date.length !== 0 && time.length !== 0){
                const x = new Date(`${date} ${time}`)
                return x.toISOString()
            }
        }
        else if(date === null && time !== null){
            return 'date'
        }
        else if(time === null && date !== null){
            return 'time'
        }
        else{
            return null
        }
    }

    const setInsertFuc = () => {
        if(publishDateIso.value === 'date' || publishDateIso.value === 'time'){
            showErrorpub.value = true
            displayErrorpub.value = publishDateIso.value
    }
        if(closeDateIso.value === 'date' || closeDateIso.value === 'time'){
            showErrorclose.value = true
            displayErrorclose.value = closeDateIso.value
        }   
    }

    const updateDetails = async() => {
        const res = await fetch(`${fetchback}/api/announcements/${params.id}`,{
          method:'PUT',
          headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
                announcementTitle:vModelData.value.announcementTitle,
                categoryId:categoryVmodel.value,
                announcementDescription:vModelData.value.announcementDescription,
                publishDate:publishDateIso.value,
                closeDate:closeDateIso.value,
                announcementDisplay:vModelData.value.announcementDisplay})
         })
         if(res.ok){
          router.push(`/admin/announcement/${params.id}`)
         } 
         else if(res.status === 400){
            const msg = await res.json()
            const text = msg.detail
            for(let i = 0; i < msg.detail.length ; i++){
                alert(`${text[i].field} = ${text[i].errorMessage}`)
            }
        }
         else {
          alert('Failed to update announcement')
         }

    }

// pbi12
    const maxtitle = ref(200)
    const mintitle = ref(0)

    const checkTitle = () => {
        mintitle.value = vModelData.value.announcementTitle.trim().length
    }

    const maxDesc = ref(10000)
    const minDesc = ref(0)
    const checkDesc = () => {
        minDesc.value = vModelData.value.announcementDescription.trim().length
    }
    
   

</script>
 
<template>
    <div class="w-full h-full bg-[#1C191C] text-white">
        <h1 class="flex text-3xl font-semibold p-5 ">Edit Announcement: </h1>
        <div class="flex flex-row p-5 ml-8 w-5/6 h-auto rounded-lg text-start">
        <div class="flex flex-col space-y-4 ">
            <p>Title       
                <span class="text-white pl-3">{{ maxtitle - mintitle }}</span>
                <span class="text-red-400 pl-3" v-if="mintitle >= maxtitle">ห้ามเกิน 200 ตัวอักษร</span> 
            </p>
            <input class="ann-title w-1/2" type="text" v-model="vModelData.announcementTitle" v-on:input="fixdata" :maxlength="maxtitle" v-on:keydown="checkTitle"/>
            <p>Category</p>
            <select class="ann-category w-1/2" v-model="categoryVmodel" v-on:change="fixdata">
                <option v-for="showcat in allcategory" :key="showcat.categoryId" :value="showcat.categoryId">{{ showcat.categoryName }}</option> 
            </select>
            
            <p>Description
                <span class="text-red-400 pl-3" v-if="minDesc > maxDesc">ห้ามเกิน 10,000 ตัวอักษร, ไม่งั้นจะส่งไม่ได้</span>
            </p>

            <QuillEditor class="ann-description"  theme="snow" toolbar="full" contentType="html" v-model:content="vModelData.announcementDescription"
             v-on:input="fixdata" :maxlength="maxDesc" v-on:keydown="checkDesc" />
           
           <p class="mt-5">
            Publish Date  <p id="err" class="pt-3 font-normal text-red-400" v-show="showErrorpub">Please enter {{ displayErrorpub }}...</p>
           </p>
            <div class="flex flex-row items-center">
                <input class="ann-publish-date mr-2" type="date" v-model="vModelData.pubDate" v-on:change="fixdata"/>
                <input class="ann-publish-time mr-2" type="time" v-model="vModelData.pubTime" v-on:change="fixdata" :disabled="isPubTimeDisabled" />
            </div>
            <p class="mt-5">
            Close Date   <p id="err" class="pt-3 font-normal text-red-400" v-show="showErrorclose">Please enter {{ displayErrorclose }}...</p>
           </p>
            <div class="flex flex-row items-center">
                <input class="ann-close-date mr-2" type="date"  v-model="vModelData.closeDate" v-on:change="fixdata"/>
                <input class="ann-close-time mr-2" type="time"  v-model="vModelData.closeTime" v-on:change="fixdata" :disabled="isCloseTimeDisabled" />
            </div>
            <p class="mt-5">
            Announcement Status
           </p>
            <div class="flex gap-x-2 pt-3">
                    <input type="checkbox" checked="checked" class="checkbox checkbox-success ann-display " v-model="vModelData.announcementDisplay" v-on:change="fixdata" />
                    <span class="label-text text-white mt-2 ml-3">Checked a checkbox to display an announcement</span> 
                </div>
        </div>
    </div>
        <div class="flex flex-row gap-x-5 ml-14 mt-5">
            <router-link :to="{ name: 'detailAnnouncement', params: { id: params.id}}"><button class="ann-button bg-transparent hover:bg-red-500 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-300 hover:border-transparent rounded-md duration-200">Back</button></router-link>
            <button class="ann-button bg-transparent hover:bg-[#24e78f] text-[#24e78f] font-semibold hover:text-black py-2 px-3 border border-[#24e78f] hover:border-transparent rounded-md duration-200 mb-5" :disabled="disableButton" @click="submitEdit">Submit</button>
        </div>
    </div>
    </template>
     
    <style scoped>
    p{
        color:#24BB78;
    }
    input, textarea, select{
        border-radius: 10px;
        padding:1rem;
    }
    #err{
        color:#ff5959;
    }
    </style>