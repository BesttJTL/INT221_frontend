<script setup>
    import { ref } from 'vue'
    import AnBar from '../components/AnBar.vue';
    import AllAnUser from '../components/AllAnUser.vue';
    const propsMode = ref('active')
</script>
 
<template>
<div>
    <AnBar class="fixed w-[100%]  "/>
    <AllAnUser :mode="propsMode"/>
</div>
</template>
 
<style scoped>

</style>