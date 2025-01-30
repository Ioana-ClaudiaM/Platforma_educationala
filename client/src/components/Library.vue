<template>
  <div class="digital-library">
    <h2>📓 Biblioteca Mea Digitală de Resurse </h2>

    <div class="category-selector">
      <button v-for="category in categories" :key="category" @click="setCategory(category)"
        :class="{ active: selectedCategory === category }">
        {{ category }}
      </button>
    </div>

    <button class="add-resource-btn" @click="showModal = true">
      ➕ Adaugă Resursă
    </button>

    <div v-if="resources.length" class="resources-grid">
      <div v-for="resource in resources" :key="resource.id" class="resource-card">
        <div class="resource-header">
          <div class="resource-title">
            <span class="resource-icon">{{ getResourceTypeIcon(resource.type) }}</span>
            <h3>{{ resource.title }}</h3>
          </div>

          <div class="action-buttons">
            <button @click="deleteResource(resource.id)">❌</button>
            <button @click="updateResource(resource.id, resource)">✏️</button>
          </div>
        </div>

        <div class="resource-details">
          <p>{{ resource.description }}</p>
          <div class="resource-links">
            <a v-for="link in resource.links" :key="link.url" :href="link.url" target="_blank"
              title="Apasă pentru a deschide link-ul">
              {{ link.type }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-resources"> Momentan nu sunt resurse disponibile pentru această disciplină❕</div>

    <Modal :isOpen="showModal" :title="isEditing ? 'Editează Resursă' : 'Adaugă Resursă Nouă'" :fields="modalFields"
      :initialData="initialResourceData" @submit="handleSubmit" @close="closeModal" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
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
    const showModal = ref(false)
    const isEditing = ref(false);
    const editingResourceId = ref(null);

    const userId = computed(() => store.getters['user/userId']);

    const resourceTypes = computed(() => store.getters['library/resourceTypes']);

    const selectedCategory = computed(() => {
      return store.getters['library/selectedCategory'] ? store.getters['library/selectedCategory'] : categories.value[0];
    });

    const resources = computed(() => store.getters['library/filteredResources'])

    const categories = computed(() => store.getters['timetable/schedule']
      ? [...new Set(Object.values(store.getters['timetable/schedule']).flat().filter(Boolean))]
      : []
    )

    const initialResourceData = ref({
      title: '',
      type: '',
      category: '',
      description: '',
      links: []
    })

    const modalFields = computed(() => [
      {
        id: 'title',
        type: 'text',
        label: 'Titlu',
        required: true,
        placeholder: 'Introdu titlul resursei',
        min: 3,
        max: 50,
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
        rows: 4,
        min: 10,
        max: 500
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


    function closeModal() {
      showModal.value = false;
      isEditing.value = false;
      editingResourceId.value = null;

      if (!isEditing.value) {
        initialResourceData.value = {
          title: '',
          type: '',
          category: '',
          description: '',
          links: []
        };
      }
    }


    function getResourceTypeIcon(type) {
      return resourceTypes.value[type] || '📁'
    }

    function setCategory(category) {
      store.dispatch('library/setSelectedCategory', category)
    }

    async function loadResources() {
      if (!userId.value) return;
      try {
        await store.dispatch('library/loadResources', userId.value)
      } catch (error) {
        console.error("Eroare la încărcarea resurselor:", error)
      }
    }

    async function deleteResource(resourceId) {
      try {
        await store.dispatch('library/deleteResource', {
          userId: userId.value,
          resourceId
        });
        toast.success('Resursa a fost ștearsă cu succes!');
      } catch (error) {
        toast.error('A apărut o eroare la ștergerea resursei.');
      }
    }

    async function updateResource(resourceId, resource) {
      isEditing.value = true;
      editingResourceId.value = resourceId;

      initialResourceData.value = { ...resource };

      showModal.value = true;
    }

    async function saveResource(resourceData) {
      try {
        await store.dispatch('library/addResource', {
          userId: userId.value,
          resource: {
            ...resourceData,
            createdAt: new Date().toISOString()
          }
        });
        toast.success('Resursa a fost adăugată cu succes!');
        closeModal();
      } catch (error) {
        const errors = error.response.data.errors;
        for (const error of errors) {
          toast.error(error.msg);
        }
      }
    }

    async function updateExistingResource(resourceData) {
      try {
        await store.dispatch('library/updateResource', {
          userId: userId.value,
          resourceId: editingResourceId.value,
          resourceData: resourceData,
        });
        toast.success('Resursa a fost actualizată cu succes!');
        closeModal();
        loadResources()
      } catch (error) {
        const errors = error.response.data.errors;
        for (const error of errors) {
          toast.error(error.msg);
        }
      }
    }

    async function handleSubmit(resourceData) {
      if (isEditing.value) {
        await updateExistingResource(resourceData);
      } else {
        await saveResource(resourceData);
      }
    }

    onMounted(async () => {
      if (userId.value)
        await loadResources();

      if (categories.value.length > 0) {
        setCategory(categories.value[0])
      }
    })

    return {
      categories,
      selectedCategory,
      resources,
      resourceTypes,
      getResourceTypeIcon,
      setCategory,
      showModal,
      modalFields,
      initialResourceData,
      saveResource,
      deleteResource,
      updateResource,
      closeModal,
      handleSubmit,
      Modal
    }
  }
}
</script>

<style scoped>
.digital-library {
  width: 95%;
  max-width: 1200px;
  min-height: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fffefece;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.action-buttons button {
  background-color: #998a572d;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.category-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin: 1.25rem 0;
}

.category-selector button {
  background-color: #cecece;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.category-selector button.active {
  background-color: #7f73bf;
  color: #ffffff;
}

.resources-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  max-height: 400px;
  overflow-y: scroll;
}

.resource-card {
  background-color: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  font-family: "Sour Gummy";
}

.resource-card:hover {
  transform: translateY(-2px);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
  color: #7f73bf;
}

.resource-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  word-break: break-word;
}

.resource-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.resource-details p {
  color: #555;
  margin-bottom: 0.625rem;
  line-height: 1.4;
}

.resource-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.resource-links a {
  text-decoration: none;
  color: #2980b9;
  background-color: #f1f1f1;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.resource-links a:hover {
  background-color: #e4e4e4;
}

.add-resource-btn {
  margin: 2rem auto;
  display: block;
  padding: 0.75rem 1.5rem;
}

.no-resources {
  color: #4d4d4d;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Sour Gummy";
  text-align: center;
  margin: 2.5rem auto;
  width: 90%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 20px;
  padding: 1.25rem;
}

@media screen and (max-width: 768px) {
  .digital-library {
    padding: 1rem;
    margin: 1rem auto;
    min-width: unset;
  }

  .category-selector button {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }

  .resource-card {
    padding: 0.875rem;
  }

  .resource-links {
    flex-direction: column;
  }

  .resource-links a {
    text-align: center;
  }

  .no-resources {
    width: 95%;
    font-size: 1.1rem;
    padding: 1rem;
  }
}

@media screen and (max-width: 480px) {
  .digital-library {
    padding: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .category-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .resource-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>