<template>
    <div class="content">
      <Navbar />
      <div class="cards">
        <CardEducation/>
        <CardDiet/>
        <CardBudget/>
        <CardShopping/>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Navbar.vue';
  import CardEducation from '@/components/Card-Education.vue';
  import CardDiet from '@/components/Card-Diet.vue';
  import CardBudget from '@/components/Card-Budget.vue';
  import CardShopping from '@/components/Card-Shopping.vue';

  export default {
    name: "HomePage",
    components: {
      Navbar,
      CardEducation,
      CardDiet,
      CardBudget,
      CardShopping
    }
  };
  </script>
  
<style scoped>
.cards{
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 25px; 
  padding: 20px;
}
 </style>
  