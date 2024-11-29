<template>
  <div id="app">
    <router-view />  
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app .content {
  user-select: none;
  caret-color: transparent; 
  background-color: rgba(180, 168, 136, 0.288);
  height: 100vh;
  display: flex; /* Activează Flexbox pentru centrare */
  flex-direction: column; /* Aranjează conținutul pe verticală */
  align-items: center; /* Centrează pe orizontală */
  justify-content: center; 
}

.card{
  width: 350px;
  height: 350px;
  border-radius: 20px;
}

.card:hover{
  transform: scale(1.1);
}

.card .card-title{
  font-family: 'Poppins';
}
</style>
