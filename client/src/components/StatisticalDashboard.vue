<template>
    <div class="statistical-dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>Total Evenimente</h3>
            <p class="stat-value">{{ events.length }}</p>
          </div>
        </div>
  
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Task-uri Finalizate</h3>
            <p class="stat-value">{{ completedTasksCount }}</p>
          </div>
        </div>
  
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>Task-uri în Desfășurare</h3>
            <p class="stat-value">{{ inProgressTasksCount }}</p>
          </div>
        </div>
  
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>Rata de Finalizare</h3>
            <p class="stat-value">{{ completionRate }}%</p>
          </div>
        </div>
      </div>
  
      <div class="charts-grid">
        <div class="chart-card">
          <h3>Distribuția Task-urilor</h3>
          <div ref="pieChartRef" class="chart-container"></div>
        </div>
  
        <div class="chart-card">
          <h3>Evenimente pe Lună</h3>
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch,computed } from 'vue';
  import * as echarts from 'echarts';
  
  export default {
    name: 'StatisticalDashboard',
    props: {
      events: {
        type: Array,
        required: true
      },
      allTasks: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const pieChartRef = ref(null);
      const barChartRef = ref(null);
      let pieChart = null;
      let barChart = null;
  
      const completedTasksCount = computed(() =>
        props.allTasks.filter(task => task.status === 'Completed').length
      );
      const inProgressTasksCount = computed(() =>
        props.allTasks.filter(task => task.status === 'In Progress').length
      );
      const completionRate = computed(() =>
        props.allTasks.length > 0
          ? Math.round((completedTasksCount.value / props.allTasks.length) * 100)
          : 0
      );
  
      const initCharts = () => {
        if (pieChartRef.value) {
          pieChart = echarts.init(pieChartRef.value);
          pieChart.setOption({
            tooltip: { trigger: 'item' },
            legend: { top: '5%' },
            series: [
              {
                name: 'Task-uri',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: completedTasksCount.value, name: 'Finalizate' },
                  { value: inProgressTasksCount.value, name: 'În Desfășurare' },
                  {
                    value:
                      props.allTasks.length -
                      completedTasksCount.value -
                      inProgressTasksCount.value,
                    name: 'În Așteptare'
                  }
                ]
              }
            ]
          });
        }
  
        if (barChartRef.value) {
          barChart = echarts.init(barChartRef.value);
          const eventsPerMonth = props.events.reduce((acc, event) => {
            const month = new Date(event.date).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, []);
          barChart.setOption({
            xAxis: { type: 'category', data: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
            yAxis: { type: 'value' },
            series: [
              {
                data: eventsPerMonth,
                type: 'bar',
                itemStyle: { color: '#4CAF50' }
              }
            ]
          });
        }
      };
  
      onMounted(() => {
        initCharts();
      });
  
      watch(
        () => [props.allTasks, props.events],
        () => {
          if (pieChart) pieChart.dispose();
          if (barChart) barChart.dispose();
          initCharts();
        }
      );
  
      return {
        pieChartRef,
        barChartRef,
        completedTasksCount,
        inProgressTasksCount,
        completionRate
      };
    }
  };
  </script>
  
  <style scoped>
  .statistical-dashboard {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  .stat-card {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .stat-icon {
    font-size: 24px;
  }
  .stat-content h3 {
    margin: 0;
    font-size: 16px;
    color: #555;
  }
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  .chart-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .chart-container {
    height: 300px;
    width: 100%;
  }
  </style>
  