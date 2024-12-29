<template>
  <div class="education-page">
    <h1 class="page-title">Pagina de studiu</h1>

    <nav class="navigation">
      <button 
        v-for="item in menuItems" 
        :key="item.id"
        @click="setCurrentComponent(item.component)"
        :class="['nav-button', { active: currentComponent === item.component }]"
      >
        {{ item.name }}
      </button>
    </nav>

    <div class="content">
      <component :is="currentComponent" />
    </div>
    <button @click="goToProfilePage()" class="goToProfile">Mergi pe pagina de profil</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import CalculatorNote from '@/components/CalculatorNote.vue';
import Library from '@/components/Library.vue';
import SchoolCalendar from '@/components/SchoolCalendar.vue';
import Timetable from '@/components/Timetable.vue';
import TaskManager from '@/components/TaskManager.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'EducationPage',
  components: {
    Timetable,
    CalculatorNote,
    SchoolCalendar,
    Library,
    TaskManager,
  },
  setup() {
    const currentComponent = ref('Timetable'); 
    const router=useRouter();
    const menuItems = [
      { id: 1, name: 'Orar', component: 'Timetable' },
      { id: 2, name: 'Bibliotecă', component: 'Library' },
      { id: 3, name: 'Calendar', component: 'SchoolCalendar' },
      { id: 4, name: 'Calculator Note', component: 'CalculatorNote' },
      { id: 5, name: 'Manager Sarcini', component: 'TaskManager' },
    ];

    const setCurrentComponent = (component) => {
      currentComponent.value = component; 
    };

    const goToProfilePage = () => {
      router.push('/profile');
    }

    return {
      currentComponent,
      menuItems,
      setCurrentComponent,
      goToProfilePage
    };
  },
};
</script>


<style scoped>
.education-page {
  background-image: url("../assets/4028065.jpg");
  background-position: center;
  background-size: cover;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

.page-title {
  color: #7f73bf;
  font-size: 2.5em;
  font-weight: 600;
  font-family: "Sour Gummy";
  background-color: #ffffffe9;
  text-align: center;
  border-radius: 20px;
  padding: 5px;
  margin-bottom: 2rem;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  max-width: 80%;
  margin: 0 auto; 
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
}
.nav-button {
  padding: 10px 20px;
  background-color: #faebb1;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Sour Gummy";
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: #7f73bf;
  color: white;
}

.nav-button.active {
  background-color: #7f73bf;
  color: white;
}

.content {
  padding: 0;
  flex: 1;
  margin-top: 20px;
}

.goToProfile{
width: fit-content;
font-size: 1.2rem;
margin-top: 20px;
}

@media (min-width: 1025px) {
  .navigation {
    gap: 20px;
  }

  .nav-button {
    font-size: 1.1em;
  }
}
</style>
