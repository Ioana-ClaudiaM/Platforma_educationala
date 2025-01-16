<template>
  <div class="profile">
    <Navbar class="navbar" />
    <div class="main-content">
      <h1>Bine ai venit, {{ username }}!</h1>
      <div class="content">
        <CardEvents />
        <CardTasks />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { useStore } from 'vuex';
import CardTasks from '@/components/Card-Tasks.vue';
import CardEvents from '@/components/Card-Events.vue';

export default {
  name: "Profile-User",
  components: {
    Navbar,
    CardTasks,
    CardEvents,
  },
  setup() {
    const store = useStore();
    const username = computed(() => store.getters['user/username']);

    return { username };
  }
};
</script>

<style scoped>
.profile {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(../assets/4028065.jpg);
  background-position:center;
  background-size: cover;
  padding: 5% 0%;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile h1 {
  font-family: 'Sour Gummy', sans-serif;
  text-align: center;
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  font-size: 30px;
  color: rgb(167, 154, 253);
  background-color: #ffffffe9;
  border-radius: 20px;
  width: fit-content;
  padding: 20px;
}

.profile h1:hover {
  transform: scale(1.05);
  color: rgb(86, 177, 212);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}

.card img {
  width: 35px;
  height: 35px;
  margin-left: 5px;
}

.card:hover {
  transform: scale(1.01);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Sour Gummy';
}
</style>