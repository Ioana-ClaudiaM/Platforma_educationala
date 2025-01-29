<template>
  <div class="education-page">
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
    <button @click="goToProfilePage()" class="goToProfile">Mergi pe pagina de profil 👤</button>
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
  background-image: url("../assets/workplace-items-arrangement-flat-lay.jpg");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 80px; 
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-button {
  padding: 10px 20px;
  background-color: #cecece;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Sour Gummy";
  transition: all 0.3s ease;
  font-size: 1rem;
  min-width: 120px;
}

.nav-button:hover {
  background-color: #7f73bf;
  color: white;
  transform: translateY(-2px);
}

.nav-button.active {
  background-color: #7f73bf;
  color: white;
}

.content {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  flex: 1;
}

.page-title {
  color: #7f73bf;
  font-size: 2.5em;
  font-weight: 600;
  font-family: "Sour Gummy";
  background-color: #ffffffaf;
  text-align: center;
  border-radius: 20px;
  padding: 10px 20px;
  margin: 20px 0;
}

.goToProfile {
  width: fit-content;
  font-size: 1rem;
  margin: 20px 0;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #7f73bf;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.goToProfile:hover {
  transform: translateY(-2px);
  background-color: #6a5fa3;
}

@media (max-width: 768px) {
  .education-page {
    padding-top: 120px; 
  }

  .navigation {
    padding: 10px;
  }

  .nav-button {
    padding: 8px 15px;
    font-size: 0.9rem;
    min-width: 100px;
  }

  .content {
    padding: 0 10px;
  }

  .page-title {
    font-size: 2em;
    padding: 8px 15px;
  }
}

@media (max-width: 480px) {
  .education-page {
    padding-top: 150px; 
  }

  .navigation {
    padding: 8px;
  }

  .nav-button {
    padding: 6px 12px;
    font-size: 0.8rem;
    min-width: 80px;
  }

  .page-title {
    font-size: 1.5em;
    padding: 6px 12px;
  }

  .content {
    padding: 0 5px;
  }

  .goToProfile {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>
