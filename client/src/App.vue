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
  height: 100vh;
  display: flex; /* Activează Flexbox pentru rând */
  flex-direction: row; /* Aranjează elementele pe orizontală (rând) */
  align-items: center; /* Centrează elementele pe verticală */
  justify-content: center; /* Distribuie elementele la distanță egală pe rând */
}

</style>
