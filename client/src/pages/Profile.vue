<template>
  <div class="profile">
    <h1>Bine ai venit, user! </h1>
    <div class="content">
      <Navbar />
      <div class="cards">
        <CardEducation />
        <CardBudget />
        <CardDiet />
        <CardShopping />
        <HomepageBar />
      </div>
    </div>
  </div>

</template>

<script>
import Navbar from '@/components/Navbar.vue';
import CardEducation from '@/components/Card-Education.vue';
import CardDiet from '@/components/Card-Diet.vue';
import CardBudget from '@/components/Card-Budget.vue';
import CardShopping from '@/components/Card-Shopping.vue';
import HomepageBar from '@/components/Homepage-Bar.vue';

export default {
  name: "Profile-User",
  components: {
    Navbar,
    CardEducation,
    CardDiet,
    CardBudget,
    CardShopping,
    HomepageBar
  }
};
</script>

<style>
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffe6e6;
}

.profile h1 {
  font-family: 'Sour Gummy', sans-serif;
  text-align: center;
  font-weight: bold;
  color: rgb(145, 202, 145);
  transition: transform 0.3s ease, color 0.3s ease;
  -webkit-text-stroke-color: rgb(33, 122, 93);
  -webkit-text-stroke-width: 0.5px;
}

.profile h1:hover {
  transform: scale(1.05);
  color: rgb(86, 177, 212);
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 35px;
  padding: 20px;
  margin-top: -10px;
  margin-right: 50px;
}

.card {
  width: 350px;
  height: 300px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 5px 5px 8px rgb(147, 137, 137);
  padding: 20px;
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