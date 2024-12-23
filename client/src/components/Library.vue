<template>
  <div class="digital-library">
    <h2>📚 Biblioteca Mea Digitală de Resurse 🧠</h2>
    
    <div class="category-selector">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        :class="{ active: selectedCategory === category }"
      >
        {{ category }}
      </button>
    </div>

    <div class="resources-grid">
      <div 
        v-for="resource in paginatedResources" 
        :key="resource.id" 
        class="resource-card"
      >
        <div class="resource-header">
          <span class="resource-icon">{{ getResourceTypeIcon(resource.type) }}</span>
          <h3>{{ resource.title }}</h3>
        </div>
        <div class="resource-details">
          <p>{{ resource.description }}</p>
          <div class="resource-links">
            <a 
              v-for="link in resource.links" 
              :key="link.url"
              :href="link.url"
              target="_blank"
            >
              {{ link.type }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredResources.length > resourcesPerPage" class="pagination">
      <button 
        v-if="!showAllResources" 
        @click="showAllResources = true"
      >
        Arată Toate Resursele
      </button>
      <button 
        v-else 
        @click="showAllResources = false"
      >
        Ascunde Resurse
      </button>
    </div>

    <button 
      class="add-resource-btn" 
      @click="showAddResourceModal = true"
    >
      Adaugă Resursă
    </button>

    <div 
      v-if="showAddResourceModal" 
      class="modal-overlay"
      @click.self="showAddResourceModal = false"
    >
      <div class="modal-content">
        <h3>Adaugă Resursă Nouă</h3>
        <form @submit.prevent="addResource">
          <input v-model="newResource.title" placeholder="Titlu" required />
          <select v-model="newResource.type" required>
            <option value="" disabled hidden>Alege tipul resursei</option>
            <option 
              v-for="(icon, type) in resourceTypes" 
              :key="type" 
              :value="type"
            >
              {{ type }}
            </option>
          </select>
          <select v-model="newResource.category" required>
            <option value="" disabled hidden>Alege o materie</option>
            <option 
              v-for="category in categories" 
              :key="category"
            >
              {{ category }}
            </option>
          </select>
          <textarea 
            v-model="newResource.description" 
            placeholder="Descriere" 
            required
          ></textarea>
          <div class="links-input">
            <div 
              v-for="(link, index) in newResource.links" 
              :key="index" 
              class="link-input"
            >
              <input 
                v-model="link.type" 
                placeholder="Tip Link" 
                required 
              />
              <input 
                v-model="link.url" 
                placeholder="URL" 
                required 
              />
              <button 
              type="button" 
              @click="addLink"
            >
            ➕ 
            </button>
              <button 
                type="button" 
                @click="removeLink(index)"
              >
              ❌
              </button>
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit">💾 Salvează Resursă</button>
            <button 
              type="button" 
              @click="showAddResourceModal = false"
            >
            ❌ Anulează
            </button>
          </div>
        </form>
      </div>
    </div>

    <div 
      v-if="showAllResources" 
      class="modal-overlay"
      @click.self="showAllResources = false"
    >
      <div class="modal-content all-resources">
        <h3>Toate Resursele</h3>
        <div class="resources-grid">
          <div 
            v-for="resource in filteredResources" 
            :key="resource.id" 
            class="resource-card"
          >
            <div class="resource-header">
              <span class="resource-icon">{{ getResourceTypeIcon(resource.type) }}</span>
              <h3>{{ resource.title }}</h3>
            </div>
            <div class="resource-details">
              <p>{{ resource.description }}</p>
              <div class="resource-links">
                <a 
                  v-for="link in resource.links" 
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                >
                  {{ link.type }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <button 
          class="close-modal-btn"
          @click="showAllResources = false"
        >
          Închide
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';

export default {
  name: 'DigitalLibrary',
  setup() {
    const categories = ref([]);
    const selectedCategory = ref(null);
    const resourcesPerPage = 2;
    const showAddResourceModal = ref(false);
    const showAllResources = ref(false);

    const resourceTypes = {
      'Notă': '📝',
      'Carte': '📖',
      'Articol': '📄',
      'Exerciții': '✏️',
      'Video': '🎥',
      'Prezentare': '📊',
      'Podcast': '🎧'
    };

    const resources = ref([]); 

    const newResource = ref({
      title: '',
      type: '',
      category: '',
      description: '',
      links: [{ type: '', url: '' }]
    });

    const filteredResources = computed(() => 
      resources.value.filter(resource => 
        resource.category === selectedCategory.value
      )
    );

    const paginatedResources = computed(() => 
      showAllResources.value 
        ? filteredResources.value 
        : filteredResources.value.slice(0, resourcesPerPage)
    );

    const loadUniqueSubjects = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await axios.get(`http://localhost:8000/loadTimetable/${userId}`);
        
        const allSubjects = [];
        Object.values(response.data.schedule).forEach(daySchedule => {
          daySchedule.forEach(subject => {
            if (subject && !allSubjects.includes(subject)) {
              allSubjects.push(subject);
            }
          });
        });

        categories.value = allSubjects;
        selectedCategory.value = allSubjects[0];
      } catch (error) {
        console.error("Eroare la încărcarea materiilor:", error);
      }
    };

    const getUserIdFromToken = () => {
      const token = localStorage.getItem('user_token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.id;
      }
      return null;
    };

    const loadResources = async () => {
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = await axios.get(`http://localhost:8000/getUserResources/${userId}`);
      resources.value = response.data; 
    } else {
      console.error("Utilizatorul nu este logat!");
    }
  } catch (error) {
    console.error("Eroare la încărcarea resurselor:", error);
  }
};

    onMounted(async () => {
      await loadUniqueSubjects();
      await loadResources();
    });

    function getResourceTypeIcon(type) {
      return resourceTypes[type] || '📁';
    }

    function addResource() {
  const resource = {
    title: newResource.value.title,
    type: newResource.value.type,
    category: newResource.value.category,
    description: newResource.value.description,
    links: JSON.parse(JSON.stringify(newResource.value.links)), 
    userId: getUserIdFromToken(), 
  };


  axios.post('http://localhost:8000/addResource', resource)
    .then(response => {
      resources.value.push(response.data);
      newResource.value = {
        title: '',
        type: '',
        category: '',
        description: '',
        links: [{ type: '', url: '' }]
      };
      showAddResourceModal.value = false;
    })
    .catch(error => {
      console.error('Eroare la adăugarea resursei:', error);
    });
}



    function addLink() {
      newResource.value.links.push({ type: '', url: '' });
    }

    function removeLink(index) {
      newResource.value.links.splice(index, 1);
    }

    return {
      categories,
      selectedCategory,
      resources,
      filteredResources,
      paginatedResources,
      resourceTypes,
      newResource,
      showAddResourceModal,
      showAllResources,
      resourcesPerPage,
      getResourceTypeIcon,
      addResource,
      addLink,
      removeLink
    };
  }
};
</script>

<style scoped>
.digital-library {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f1d0b6;  
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2, h3 {
  color: #7f73bf;
    font-size: 1.5em;
    font-weight: 600;
    letter-spacing: -0.5px;
    font-family:"Sour Gummy";
    text-align: center;
}

.category-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; 
  margin-bottom: 20px;
  gap: 10px;
}


.category-selector button {
  padding: 8px 15px;
  border: 2px solid #d7bfef;
background-color: #f9f0fe; 
 color: #63c1fc;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Playwrite HR Lijeva", sans-serif;
  font-weight: bold;
}

.category-selector button.active {
  background-color: #f9f0fe;  
  color: rgb(65, 50, 236);
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


.add-resource-btn {
  background-color: #d0cbec;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: "Sour Gummy", sans-serif;
  width: 100%;
  display: block;
  margin-top: 20px;
  font-size: 1rem;
  padding: 5px;
}

button:hover {
  background-color: #dbf2fc;
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

input, select, textarea{
  width: 90%;
    border: 2px solid #e0e0e036;
    transition: all 0.3s ease;
    font-family: "Sour Gummy";
    text-align: left;
    border-radius: 3px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button, .close-modal-btn, .pagination-button, .links-input button {
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