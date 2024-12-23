<template>
  <div class="education-page">
    <h1 class="page-title">Pagina de studiu</h1>
    <div class="item timetable">
      <Timetable />
    </div>
    <div class="item calculator-note">
      <CalculatorNote />
    </div>
    <div class="item library">
      <Library />
    </div>
    <div class="item school-calendar">
      <SchoolCalendar />
    </div>
    <div class="item task-manager">
      <TaskManager />
    </div>
  </div>
</template>

<script>
import CalculatorNote from '@/components/CalculatorNote.vue';
import Library from '@/components/Library.vue';
import SchoolCalendar from '@/components/SchoolCalendar.vue';
import Timetable from '@/components/Timetable.vue';
import TaskManager from '@/components/TaskManager.vue';

export default {
  name: 'Education-Page',
  components: {
    Timetable,
    CalculatorNote,
    SchoolCalendar,
    Library,
    TaskManager
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.education-page {
  display: grid;
  grid-template-areas:
    "timetable library"
    "calculator-note school-calendar";
  gap: 50px;
  background-image: url("../assets/SL-122720-39270-25.jpg");
  background-position: center;
  background-size: contain;
  position: relative; 
  padding: 70px;
}

.page-title {
  position: absolute; 
  top: 10px; 
  left: 50%; 
  transform: translateX(-50%); 
  color: #7f73bf;
    font-size: 2.5em;
    font-weight: 600;
    letter-spacing: -0.5px;
    font-family:"Sour Gummy";
    background-color: #f9f1d0b6;  
  width: fit-content; 
  text-align: center;
  z-index: 10; 
  border-radius: 20px;
  padding: 5px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timetable {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.library {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.calculator-note {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.school-calendar {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.task-manager {
  grid-column: 1 / 3;  
  grid-row: 3 / 4;    
}

</style>
