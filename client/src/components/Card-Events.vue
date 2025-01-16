<template>
    <div class="calendar-summary-card">
        <div class="card-header">
            <h2>Evenimente Viitoare</h2>
        </div>

        <div class="events-timeline">
            <div v-if="upcomingEvents.length > 0" class="events-list">
                <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
                    <div class="event-date">
                        <span class="date">{{ new Date(event.date).toLocaleDateString('ro-RO')}}</span>
                        <div class="event-tag" :style="{ backgroundColor: getEventColor(event.type) }">
                            {{ event.type }}
                        </div>
                    </div>
                    <div class="event-content">
                        <h3 class="event-title">{{ event.title }}</h3>
                        <p v-if="event.description" class="event-description">{{ event.description }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="no-events">
                <p>Nu ai evenimente programate în perioada următoare</p>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router/router';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'CardEvents',
    setup() {
        const store = useStore();

        const userId = computed(() => store.getters['user/userId']);

        const eventTypes = {
            'Examen final': '#FF6B6B',
            'Test de seminar': '#FF9800',
            'Test parțial': '#FFC107',
            'Colocviu': '#FF5722',
            'Deadline proiect': '#4CAF50',
            'Prezentare proiect': '#8BC34A',
            'Vizită secretariat': '#E91E63',
            'Depunere cereri': '#F44336',
            'Întâlnire de grup': '#795548',
            'Workshop': '#607D8B',
            'Career fair': '#3F51B5',
            'Concurs academic': '#FFEB3B',
            'Voluntariat': '#4CAF50',
            'Eveniment sportiv': '#9E9E9E'
        };


        const upcomingEvents = computed(() => {
            const allEvents = store.getters['events/allEvents'] || [];
            const now = new Date();
            return allEvents
                .filter(event => event && event.date && new Date(event.date) >= now)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        const getEventColor = (type) => {
            return eventTypes[type] || '#9E9E9E';
        };

        const goToLogin = () => {
            router.push('/login');
        }

        onMounted(async () => {
            if (userId.value) {
                await store.dispatch('events/fetchEvents', userId.value);
            }
        });

        return {
            upcomingEvents,
            userId,
            getEventColor,
            goToLogin,
        };
    }
};
</script>

<style scoped>
.calendar-summary-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}


.card-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    text-align: center;
    margin-bottom: 20px;
}

.view-all {
    color: #4F46E5;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.event-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #F9FAFB;
    border-radius: 12px;
    transition: transform 0.2s ease;
}

.event-item:hover {
    transform: translateX(4px);
}

.event-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
}

.date {
    font-weight: 600;
    color: #111827;
}

.event-content {
    flex: 1;
    text-align: center;
    margin-left: -80px;
}

.event-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 500;
    color: white;
    margin-bottom: 0.5rem;
}

.event-description {
    font-size: 0.875rem;
    color: #6B7280;
    margin: 0;
}

.no-events {
    text-align: center;
    padding: 2rem;
    color: #303338;
}

@media (max-width: 640px) {
    .event-item {
        flex-direction: column;
    }

    .event-date {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
}
</style>