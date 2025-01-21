<template>
  <div class="digital-library">
    <h2>📚 Biblioteca Mea Digitală de Resurse 🧠</h2>

    <div class="category-selector">
      <button v-for="category in categories" :key="category" @click="setCategory(category)"
        :class="{ active: selectedCategory === category }">
        {{ category }}
      </button>
    </div>

    <button class="add-resource-btn" @click="showModal = true">
      Adaugă Resursă
    </button>

    <div v-if="resources.length" class="resources-grid">
       <div  v-for="resource in resources" :key="resource.id" class="resource-card">
        <div class="resource-header">
          <div class="resource-title">
            <span class="resource-icon">{{ getResourceTypeIcon(resource.type) }}</span>
            <h3>{{ resource.title }}</h3>
          </div>

          <div class="action-buttons">
            <button @click="deleteResource(resource.id)">❌</button>
            <button @click="updateResource(resource.id,resource)">✏️</button>
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
    <div v-else class="no-resources"> Momentan nu sunt resurse disponibile pentru această disciplină.</div>

    <Modal :isOpen="showModal" 
           :title="isEditing ? 'Editează Resursă' : 'Adaugă Resursă Nouă'" 
           :fields="modalFields" 
           :initialData="initialResourceData" 
           @submit="handleSubmit" 
           @close="closeModal" />
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
      ? (Object.values(store.getters['timetable/schedule']).flat().filter(Boolean))
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

    
    function closeModal() {
      showModal.value = false;
      isEditing.value = false;
      editingResourceId.value = null;

      initialResourceData.value = {
        title: '',
        type: '',
        category: '',
        description: '',
        links: []
      };
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

    async function saveResource(resource) {
      try {
        await store.dispatch('library/addResource', {
          userId:userId.value,
          resource: {
            ...resource,
            createdAt: new Date().toISOString()
          }
        });
        toast.success('Resursa a fost adăugată cu succes!');
        showModal.value = false;
      } catch (error) {
        toast.error('A apărut o eroare la adăugarea resursei.');
      }
    }

    async function deleteResource(resourceId) {
      try {
        await store.dispatch('library/deleteResource', {
          userId:userId.value,
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

    async function handleSubmit(resourceData) {
      try {
        if (isEditing.value) {
          await store.dispatch('library/updateResource', {
            userId: userId.value,
            resourceId: editingResourceId.value,
            resourceData: resourceData,
          });
          toast.success('Resursa a fost actualizată cu succes!');
        } else {
          await store.dispatch('library/addResource', {
            userId: userId.value,
            resource: {
              ...resourceData,
              createdAt: new Date().toISOString()
            }
          });
          toast.success('Resursa a fost adăugată cu succes!');
        }
        closeModal();
      } catch (error) {
        toast.error(isEditing.value ? 
          'A apărut o eroare la actualizarea resursei.' : 
          'A apărut o eroare la adăugarea resursei.'
        );
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
.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons button {
  background-color: #998a572d;
  border: none;
}

.resource-title {
  display: flex;
}

.digital-library {
  min-width: 600px;
  max-height: 400px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f1d0b6;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: scroll;
}

.category-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 10px;
}

.category-selector button {
  background-color: #92e7ac;
  font-size: 1.2rem;
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
  justify-content: space-between;
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

.add-resource-btn {
  margin-left: 40%;
  margin-bottom: 5%;
}

.no-resources{
  color: #513cc9;
  font-size: 1.5em;
  font-weight: 600;
  font-family: "Sour Gummy";
  text-align: center;
  margin-bottom: 5px;
}
</style>