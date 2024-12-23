<template>
  <div class="card budget-card">
    <div class="budget-header">
      <h2 class="card-title">💰 Monitorizare Buget</h2>
    </div>
    <div class="budget-metrics">
      <div class="metric-grid">
        <div class="metric-item">
          <div class="metric-icon">📊</div>
          <div class="metric-content">
            <span class="metric-label">Buget Total</span>
            <span class="metric-value">{{ formatCurrency(availableBudget) }}</span>
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-icon">💸</div>
          <div class="metric-content">
            <span class="metric-label">Cheltuieli Azi</span>
            <span class="metric-value">{{ formatCurrency(expensesToday) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="budget-progress">
      <div class="progress-container">
        <div class="progress-bar" :class="progressColorClass" :style="{ width: `${progressPercentage.toFixed(1)}%` }"></div>
      </div>
      <div class="progress-details">
        <span class="progress-percentage">{{ progressPercentage.toFixed(1) }}%</span>
        <span class="progress-remaining">
          Rămas: {{ formatCurrency(remainingBudget) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const availableBudget = ref(5000);
    const expensesToday = ref(1250);

    const remainingBudget = computed(() =>
      Math.max(availableBudget.value - expensesToday.value, 0)
    );

    const progressPercentage = computed(() => 
      (expensesToday.value / availableBudget.value) * 100
    );

    const progressColorClass = computed(() => {
      if (progressPercentage.value < 30) return "progress-low";
      if (progressPercentage.value < 60) return "progress-medium";
      return "progress-high";
    });

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("ro-RO", {
        style: "currency",
        currency: "RON",
      }).format(amount);
    };

    return {
      availableBudget,
      expensesToday,
      remainingBudget,
      progressPercentage,
      progressColorClass,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.budget-card {
  background-color: #e4d1fb;
  border: 10px solid #d9bff9;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.budget-icon {
  margin-right: 10px;
}

.budget-metrics {
  margin-bottom: 20px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-bottom: 20px;
}

.metric-item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  text-align: left;
}

.metric-icon {
  font-size: 2rem;
  margin-right: 12px;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.8rem;
  color: #4e4d4d;
  margin-bottom: 4px;
  font-family: 'Sour Gummy';
  font-weight: bold;
}

.metric-value {
  font-size: 0.7rem;
  color: #333;
  font-family: 'Playwrite HR Lijeva';
  font-weight: bold;
}

.budget-progress {
  background-color: #f7f7f9;
  border-radius: 10px;
  padding: 12px;
}

.progress-container {
  background-color: #e0e0e6;
  height: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s ease;
}

.progress-low {
  background-color: #4caf50;
}

.progress-medium {
  background-color: #ff9800;
}

.progress-high {
  background-color: #f44336;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.progress-percentage {
  color: #666;
  font-weight: 500;
  font-family: 'Playwrite HR Lijeva';

}

.progress-remaining {
  color: #333;
  font-weight: 600;
  font-family: 'Playwrite HR Lijeva';
  font-size: 0.7rem;
}
</style>