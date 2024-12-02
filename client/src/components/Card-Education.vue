<template>
  <div class="card card-education">
    <div class="education-header">
      <h2 class="card-title">
        📘 Educație 
      </h2>
    </div>
    <ul class="tasks-list">
      <li v-for="(task, index) in todaysTasks" :key="index">
        <strong>📘 {{ task.type }}:</strong> {{ task.description }} <span class="time">({{ task.time }})</span>
      </li>
    </ul>
    <p v-if="todaysTasks.length === 0">✨ Astăzi este o zi liberă! Bucură-te de timpul tău. 🎉</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todaysTasks: [],
    };
  },
  mounted() {
    this.fetchTodaysTasks(); 
  },
  methods: {
    fetchTodaysTasks() {
      const tasks = [
        { type: "Temă", description: "Rezolvă exerciții la matematică", time: "10:00 - 11:00", date: "02.12.2024" },
        { type: "Meeting", description: "Discuție cu mentorul", time: "14:00 - 14:30", date: "02.12.2024" },
        { type: "Task", description: "Scrie un eseu la literatură", time: "16:00 - 18:00", date: "02.12.2024" },
        { type: "Curs", description: "Urmărește cursul de fizică", time: "18:00 - 19:00", date: "02.12.2024" },
        { type: "Examen", description: "Pregătire examen", time: "20:00 - 22:00", date: "02.12.2024" },
        { type: "Activitate extra", description: "Meditații la engleză", time: "22:30 - 23:00", date: "02.12.2024" },
        { type: "Temă", description: "Exerciții la chimie", time: "09:00 - 10:00", date: "02.12.2024" },
        { type: "Meeting", description: "Proiect de grup", time: "12:00 - 13:00", date: "02.12.2024" },
      ];

      const today = new Date().toLocaleDateString("ro-RO");
      this.todaysTasks = tasks.filter(task => task.date === today);
    },
  },
};
</script>

<style scoped>
.card-education {
  background-color: #FFE1CB;
  border:10px solid #f5c9aa;

}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.education-icon {
  margin-right: 12px;
  font-size: 1.6rem;
}

.tasks-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}


.tasks-list li {
  font-family: 'Sour Gummy';
  font-size: 0.9rem;
  color: #3a3939;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
}

.tasks-list li .time {
  font-size: 14px;
  color: #898787;
  margin-left: 5px;
}

.tasks-list li:hover {
  transform: scale(1.02);
  transition: 0.2s;
}
</style>
