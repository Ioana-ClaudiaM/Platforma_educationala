<template>
  <div class="card diet-card">
    <div class="diet-header">
      <h2 class="card-title">
        <i class="diet-icon">🥗</i>
        Plan Nutrițional Zilnic
      </h2>
    </div>
    <div class="meals-container">
      <div
        v-for="(meal, index) in meals"
        :key="index"
        class="meal-card"
      >
        <div class="meal-header">
          <div class="meal-icon">{{ meal.icon }}</div>
          <h3 class="meal-title">{{ meal.name }}</h3>
          <div class="meal-calories">{{ meal.calories }} kcal</div>
        </div>

        <div class="meal-description">
          {{ meal.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const dailyCalorieTarget = ref(2500);
    const meals = ref([
      {
        name: "Mic Dejun",
        icon: "🥞",
        description: "Fulgi de ovăz cu fructe și iaurt",
        calories: 450,
        proteins: 18,
        carbs: 55,
        fats: 12,
        ingredients: [
          "Fulgi de ovăz",
          "Iaurt grecesc",
          "Afine",
          "Banană",
          "Miere",
        ],
      },
      {
        name: "Prânz",
        icon: "🍴",
        description: "Salată cu pui la grătar și avocado",
        calories: 650,
        proteins: 45,
        carbs: 25,
        fats: 35,
        ingredients: [
          "Piept de pui",
          "Salată verde",
          "Avocado",
          "Roșii cherry",
          "Ulei de măsline",
          "Semințe de susan",
        ],
      },
      {
        name: "Cină",
        icon: "🍽",
        description: "Somon la cuptor cu legume",
        calories: 550,
        proteins: 35,
        carbs: 20,
        fats: 30,
        ingredients: [
          "Somon",
          "Sparanghel",
          "Cartof dulce",
          "Lămâie",
          "Usturoi",
          "Cimbru",
        ],
      },
    ]);

    const totalCalories = computed(() =>
      meals.value.reduce((sum, meal) => sum + meal.calories, 0)
    );
    const totalProteins = computed(() =>
      meals.value.reduce((sum, meal) => sum + meal.proteins, 0)
    );
    const totalCarbs = computed(() =>
      meals.value.reduce((sum, meal) => sum + meal.carbs, 0)
    );
    const calorieProgressPercentage = computed(() =>
      (totalCalories.value / dailyCalorieTarget.value) * 100
    );

    return {
      dailyCalorieTarget,
      meals,
      totalCalories,
      totalProteins,
      totalCarbs,
      calorieProgressPercentage,
    };
  },
};
</script>
  
  <style scoped>
  .diet-card {
    background-color: #faf5bc;
    border:10px solid #faf07f;
  }
  
  .diet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
  }
  
  .diet-icon {
    margin-right: 12px;
  }

  .meals-container {
    display: flex;
    flex-direction: column;
    gap:15px;
  }
  
  .meal-card {
    background-color: #f8f9fa;
    border-radius: 12px;
    padding: 6px;
  }
  
  .meal-card:hover {
    background-color: #f0f1f3;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .meal-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-family: 'Sour Gummy';
    font-size: 12px;
  }
  
  .meal-icon {
    margin-right: 12px;
    font-size: 1rem;
  }
  
  .meal-title {
    flex-grow: 1;
    font-size: 0.9rem;
    color: #4e4d4d;
    margin: 0;
  }
  
  .meal-calories {
    font-weight: 600;
    color: #4c4c4c;
  }
  
  .meal-description {
    color: #000000;
    font-family: "Playwrite HR Lijeva";
    font-size: 14px;
  }

  .diet-footer {
    margin-top: 20px;
  }
  
  </style>