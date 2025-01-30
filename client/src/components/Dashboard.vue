<template>
    <div v-show="!selectedEventId" class="dashboard-view">
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

        <div class="upcoming-events">
            <h3>Evenimente Apropiate</h3>
            <div class="events-list">
                <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
                    <div class="event-date">{{ formatDate(event.date) }}</div>
                    <div class="event-details">
                        <h4>{{ event.title }}</h4>
                        <div class="event-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: getEventProgress(event) + '%' }"></div>
                            </div>
                            <span>{{ getEventProgress(event) }}% completat</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
export default {
    name: "DashboardComp",

    props: {
        selectedEventId: String,
    },

    setup(props) {
        const store = useStore();
        const userId = computed(() => store.getters['user/userId']);
        const events = computed(() => store.getters['events/allEvents']);
        const allTasks = computed(() => store.getters['tasks/allTasks']);

        const pieChartRef = ref(null);
        const barChartRef = ref(null);
        let pieChart = null;
        let barChart = null;

        const completedTasksCount = computed(() =>
            allTasks.value.filter(task => task.status === 'Completed').length
        );

        const inProgressTasksCount = computed(() =>
            allTasks.value.filter(task => task.status === 'In Progress').length
        );

        const completionRate = computed(() => {
            if (allTasks.value.length === 0) return 0;
            return Math.round((completedTasksCount.value / allTasks.value.length) * 100);
        });

        const upcomingEvents = computed(() => {
            const today = new Date();
            return events.value
                .filter(event => new Date(event.date) >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
        });


        const getEventProgress = (event) => {
            const eventTasks = allTasks.value.filter(task => task.eventId === event.id);
            if (eventTasks.length === 0) return 0;
            const completed = eventTasks.filter(task => task.status === 'Completed').length;
            return Math.round((completed / eventTasks.length) * 100);
        };

        const formatDate = (date) => new Date(date).toLocaleDateString('ro-RO');


        const initializeCharts = () => {
            console.log('initializeCharts');
            console.log("Ref" + pieChartRef.value);
            if (pieChartRef.value) {
                pieChart = echarts.init(pieChartRef.value);
                updatePieChart();
            }

            if (barChartRef.value) {
                barChart = echarts.init(barChartRef.value);
                updateBarChart();
            }
        };

        const updatePieChart = () => {
            const option = {
                tooltip: { trigger: 'item' },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [{
                    type: 'pie',
                    radius: '70%',
                    data: [
                        { value: completedTasksCount.value, name: 'Finalizate', itemStyle: { color: '#7f73bf' } },
                        { value: inProgressTasksCount.value, name: 'În Desfășurare', itemStyle: { color: '#9f97c9' } },
                        {
                            value: allTasks.value.length - completedTasksCount.value - inProgressTasksCount.value,
                            name: 'În Așteptare',
                            itemStyle: { color: '#bfb8d9' }
                        }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            pieChart?.setOption(option);
        };

        const updateBarChart = () => {
            const monthlyData = getMonthlyEventDistribution();
            const option = {
                tooltip: { trigger: 'axis' },
                xAxis: {
                    type: 'category',
                    data: monthlyData.map(item => item.month)
                },
                yAxis: { type: 'value' },
                series: [{
                    data: monthlyData.map(item => item.count),
                    type: 'bar',
                    itemStyle: { color: '#7f73bf' }
                }]
            };
            barChart?.setOption(option);
        };

        const getMonthlyEventDistribution = () => {
            const monthCounts = {};
            events.value.forEach(event => {
                const month = new Date(event.date).toLocaleDateString('ro-RO', { month: 'short' });
                monthCounts[month] = (monthCounts[month] || 0) + 1;
            });
            return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
        };


        watch(allTasks, () => {
            if (pieChart && barChart) {
                updatePieChart();
                updateBarChart();
            }
        }, { deep: true });

        watch(() => props.selectedEventId, () => {
            if (!props.selectedEventId) {

                initializeCharts();

            }
        });
        onMounted(async () => {
            await store.dispatch('events/fetchEvents', userId.value);
            await store.dispatch('tasks/fetchAllTasks', userId.value);
            initializeCharts();
        });

        onUnmounted(() => {
            if (pieChart) {
                pieChart.dispose();
            }
            if (barChart) {
                barChart.dispose();
            }
        });

        return {
            events,
            completedTasksCount,
            inProgressTasksCount,
            completionRate,
            upcomingEvents,
            formatDate,
            getEventProgress,
            pieChartRef,
            barChartRef
        }
    }
}
</script>

<style scoped>
.dashboard-view {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: auto;
    min-height: calc(100vh - 250px);
    overflow-y: auto;
    padding: 0 1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: "Sour Gummy", sans-serif;
}

.stat-icon {
    font-size: clamp(1.5rem, 2vw, 2rem);
}

.stat-content h3 {
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    color: #525151;
    margin: 0;
}

.stat-value {
    font-size: clamp(1.5rem, 2vw, 1.8rem);
    font-weight: bold;
    color: #7f73bf;
    margin: 0.5rem 0 0 0;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    flex: 1;
    margin-bottom: 2rem;
}

.chart-card {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: auto;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    font-family: "Playwrite HR Lijeva", sans-serif;
}

.chart-card h3 {
    margin: 0 0 1rem 0;
    color: #3b9eba;
    font-size: clamp(1rem, 1.5vw, 1.25rem);
}

.chart-container {
    height: 100%;
    min-height: 300px;
    width: 100%;
}

.upcoming-events {
    text-align: center;
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    font-family: "Sour Gummy";
}

.events-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    width: 100%;
    padding: 1rem;
}

.event-card {
    background: white;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    font-size: clamp(0.75rem, 1.5vw, 0.8rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: "Playwrite HR Lijeva", sans-serif;
}

.event-date {
    font-weight: bold;
    color: #7f73bf;
    width: 100%;
}

.event-details h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
}

@media screen and (max-width: 768px) {
    .dashboard-view {
        margin-top: 0.5rem;
        gap: 0.5rem;
    }

    .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .chart-card {
        min-height: 350px;
    }

    .upcoming-events {
        width: 100%;
        padding: 0.5rem;
    }
}

@media screen and (max-width: 480px) {
    .stat-card {
        flex-direction: column;
        text-align: center;
        padding: 0.75rem;
    }

    .events-list {
        grid-template-columns: 1fr;
        padding: 0.5rem;
    }

    .chart-container {
        min-height: 250px;
        width: 250px;
    }
}
</style>