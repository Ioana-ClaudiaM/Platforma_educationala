<template>
  <div class="digital-library">
    <h2>📚 Biblioteca Mea Digitală de Resurse 🧠</h2>

    <div class="category-selector">
      <button v-for="category in categories" :key="category" @click="setCategory(category)"
        :class="{ active: selectedCategory === category }">
        {{ category }}
      </button>
    </div>

    <div class="resources-grid">
      <div v-for="resource in paginatedResources" :key="resource.id" class="resource-card">
        <div class="resource-header">
          <span class="resource-icon">{{ getResourceTypeIcon(resource.type) }}</span>
          <h3>{{ resource.title }}</h3>
        </div>
        <div class="resource-details">
          <p>{{ resource.description }}</p>
          <div class="resource-links">
            <a v-for="link in resource.links" :key="link.url" :href="link.url" target="_blank">
              {{ link.type }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredResources.length > resourcesPerPage" class="pagination">
      <button v-if="!showAllResources" @click="showAllResources = true">
        Arată Toate Resursele
      </button>
      <button v-else @click="showAllResources = false">
        Ascunde Resurse
      </button>
    </div>

    <button class="add-resource-btn" @click="showModal = true">
      Adaugă Resursă
    </button>

    <Modal :isOpen="showModal" title="Adaugă Resursă Nouă" :fields="modalFields" :initialData="initialResourceData"
      @submit="handleResourceSubmit" @close="showModal = false" />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification';
import Modal from './Modal.vue'

export default {
  name: 'DigitalLibrary',
  components: {
    Modal
  },
  setup() {
    const store = useStore();
    const toast = useToast();
    const resourcesPerPage = 2
    const showAllResources = ref(false)
    const showModal = ref(false)

    const initialResourceData = {
      title: '',
      type: '',
      category: '',
      description: '',
      links: []
    }

    const modalFields = computed(() => [
      {
        id: 'title',
        type: 'text',
        label: 'Titlu',
        required: true,
        placeholder: 'Introdu titlul resursei'
      },
      {
        id: 'type',
        type: 'select',
        label: 'Tip Resursă',
        required: false,
        placeholder: 'Alege tipul resursei',
        options: Object.keys(store.getters['library/resourceTypes']).map(type => ({
          value: type,
          label: type
        }))
      },
      {
        id: 'category',
        type: 'select',
        label: 'Materie',
        required: false,
        placeholder: 'Alege o materie',
        options: computed(() => store.getters['timetable/schedule']
          ? [...new Set(Object.values(store.getters['timetable/schedule']).flat().filter(Boolean))]
            .map(category => ({
              value: category,
              label: category
            }))
          : []
        ).value
      },
      {
        id: 'description',
        type: 'textarea',
        label: 'Descriere',
        required: true,
        placeholder: 'Introdu descrierea resursei',
        rows: 4
      },
      {
        id: 'links',
        type: 'array',
        label: 'Link-uri',
        itemLabel: 'Link',
        fields: [
          {
            id: 'type',
            type: 'text',
            label: 'Tip Link',
            required: true,
            placeholder: 'Ex: PDF, Video, etc.'
          },
          {
            id: 'url',
            type: 'text',
            label: 'URL',
            required: true,
            placeholder: 'https://...'
          }
        ],
        defaultItem: {
          type: '',
          url: ''
        }
      }
    ])

    const resourceTypes = computed(() => store.getters['library/resourceTypes'])
    const selectedCategory = computed(() => store.getters['library/selectedCategory'])
    const filteredResources = computed(() => store.getters['library/filteredResources'])
    const categories = computed(() => store.getters['timetable/schedule']
      ? [...new Set(Object.values(store.getters['timetable/schedule']).flat().filter(Boolean))]
      : []
    )

    const paginatedResources = computed(() =>
      showAllResources.value
        ? filteredResources.value
        : filteredResources.value.slice(0, resourcesPerPage)
    )

    async function handleResourceSubmit(resource) {
      const userId = store.getters['user/userId'];
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      try {
        await store.dispatch('library/addResource', {
          userId,
          resource: {
            ...resource,
            createdAt: new Date().toISOString()
          }
        });
        toast.success('Resursa a fost adăugată cu succes!');
        showModal.value = false;
      } catch (error) {
        toast.error('A apărut o eroare la adăugarea resursei.');
        console.error("Eroare la adăugarea resursei:", error);
      }
    }

    onMounted(async () => {
      const userId = store.getters['user/userId']
      if (userId) {
        try {
          await store.dispatch('library/loadResources', userId)
          if (categories.value.length > 0 && !selectedCategory.value) {
            setCategory(categories.value[0])
          }
        } catch (error) {
          console.error("Eroare la încărcarea resurselor:", error)
        }
      }
    })

    watch(() => store.getters['timetable/schedule'], (newSchedule) => {
      if (newSchedule && categories.value.length > 0 && !selectedCategory.value) {
        setCategory(categories.value[0])
      }
    })

    function getResourceTypeIcon(type) {
      return resourceTypes.value[type] || '📁'
    }

    function setCategory(category) {
      store.dispatch('library/setSelectedCategory', category)
    }

    return {
      categories,
      selectedCategory,
      filteredResources,
      paginatedResources,
      resourceTypes,
      showAllResources,
      resourcesPerPage,
      getResourceTypeIcon,
      setCategory,
      showModal,
      modalFields,
      initialResourceData,
      handleResourceSubmit,
      Modal
    }
  }
}
</script>

<style scoped>
.digital-library {
  width: fit-content;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f1d0b6;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 10px;
}

.category-selector button.active {
  background-color: #c156aa;
  color: rgb(255, 255, 255);
}

.resources-grid {
  display: grid;
  gap: 15px;
}

.resource-card {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  font-family: "Sour Gummy";
}

.resource-card:hover {
  transform: scale(1.02);
}

.resource-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #7f73bf;
}

.resource-icon {
  font-size: 2em;
  margin-right: 10px;
}

.resource-details p {
  color: #555;
  margin-bottom: 10px;
}

.resource-links {
  display: flex;
  gap: 10px;
}

.resource-links a {
  text-decoration: none;
  color: #2980b9;
  background-color: #f1f1f1;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content.all-resources {
  max-width: 800px;
}

.modal-content form input,
.modal-content form select,
.modal-content form textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.links-input .link-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button,
.close-modal-btn,
.pagination-button,
.links-input button {
  background-color: #d0cbec;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: "Sour Gummy", sans-serif;
  padding: 5px;
  height: fit-content;
}
</style>