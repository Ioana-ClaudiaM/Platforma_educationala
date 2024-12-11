<template>
  <div class="education-page">
    <Timetable/>
  </div>
</template>

<script>
import Timetable from '@/components/Timetable.vue';

export default {
    name:'Education-Page',
    components:{
        Timetable
    }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.education-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #b0c4e4 100%);
  padding: 20px;
}

</style>