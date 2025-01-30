<template>
  <div class="grade-tracking-container">
    <h2>📝 Evidență Note</h2>
    <div class="subject-selection">
      <select id="subject-select" v-model="selectedSubject" @change="openEditModal">
        <option value="" disabled>Selectează o materie</option>
        <option v-for="subject in subjects" :key="subject" :value="subject">
          {{ subject }}
        </option>
      </select>
    </div>

    <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? "Editare Notă" : "Adăugare Notă" }}</h3>
        <div class="weights-container">
          <div class="weight-input">
            <label>Pondere Seminar/Laborator:</label>
            <div class="componente-seminar">
              <div class="seminar-components-wrapper">
                <div v-for="(component, index) in seminarComponents" :key="index" class="seminar-component-row">
                  <div class="component-inputs">
                    <div>
                      <label for="component-name">Denumire</label>
                      <input type="text" v-model="component.name" placeholder="Nume componentă" id="component-name" />
                    </div>
                    <div>
                      <label for="component-weight">Pondere</label>
                      <input type="number" v-model="component.weight" min="0" max="100" placeholder="Pondere %"
                        id="component-weight" />
                    </div>
                    <div>
                      <label for="component-grade">Notă</label>
                      <input type="number" v-model="component.grade" min="0" max="10" placeholder="Notă"
                        id="component-grade" />
                    </div>
                    <button @click="removeComponent(index)" class="delete-component">❌ Șterge</button>
                  </div>
                </div>
              </div>
            </div>
            <button @click="addComponent" class="add-component">➕ Adaugă o nouă componentă la seminar</button>
          </div>

          <div class="weight-input examen">
            <label>Pondere Examen:</label>
            <div class="component-inputs">
              <div>
                <label for="exam-weight">Pondere</label>
                <input type="number" v-model="examWeight" min="0" max="100" placeholder="Pondere Examen %"
                  id="exam-weight" />
              </div>
              <div>
                <label for="exam-grade">Notă</label>
                <input type="number" v-model="examGrade" min="0" max="10" placeholder="Notă Examen" id="exam-grade" />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="handleSubmit(subject)" class="save-grades">💾 Salvează</button>
          <button @click="closeEditModal" class="cancel-button">❌ Închide</button>
        </div>
      </div>
    </div>

    <div class="subjects-overview">
      <h3>Vedere de Ansamblu Note</h3>
      <table>
        <thead>
          <tr>
            <th>Materie</th>
            <th>Medie Finală</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subject, index) in savedGrades" :key="index">
            <td>{{ subject.name }}</td>
            <td>{{ subject.finalGrade.toFixed(2) }}</td>
            <td class="actions">
              <button @click="setEditingSubject(subject)">✏️</button>
              <button @click="deleteSubjectGrade(subject.name)"> ❌</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'Calculator-Note',
  setup() {
    const store = useStore();
    const toast = useToast();

    const userId = computed(() => store.getters['user/userId']);
    const selectedSubject = ref('');
    const subjects = ref([]);
    const isEditing = ref(false);

    const uniqueSubjects = async () => {
      if (!userId.value) return;
      try {
        await store.dispatch('timetable/loadTimetable', userId.value);
        const storeSchedule = store.getters['timetable/schedule'];
        subjects.value = [...new Set(Object.values(storeSchedule).flat().filter(Boolean))];
      }
      catch (error) {
        if (error.status === 404)
          toast.warning('Nu ai adăugat încă nicio materie în orar!');
      }
    }

    const isEditModalOpen = ref(false);
    const seminarComponents = ref([{ name: '', weight: 0, grade: 0 }]);
    const examWeight = ref(0);
    const examGrade = ref(0);

    const loadGrades = async () => {
      if (!userId.value) return;
      try {
        await store.dispatch('grades/loadGrades', userId.value);
      }
      catch (error) {
        if (error.status === 404) {
          toast.warning("Încă nu ai adăugat nicio notă!")
        }
      }
    }

    const savedGrades = computed(() => store.getters['grades/savedGrades']);

    const openEditModal = () => {
      const existingGrade = savedGrades.value.find(grade => grade.name === selectedSubject.value);
      if (existingGrade) {
        seminarComponents.value = existingGrade.seminarComponents.map(component => ({ ...component }));
        examWeight.value = existingGrade.examWeight;
        examGrade.value = existingGrade.examGrade;
        isEditing.value = true;
      } else {
        seminarComponents.value = [{ name: '', weight: 0, grade: 0 }];
        examWeight.value = 0;
        examGrade.value = 0;
        isEditing.value = false;
      }
      isEditModalOpen.value = true;
    }

    const closeEditModal = () => {
      selectedSubject.value = '';
      seminarComponents.value = [{ name: '', weight: 0, grade: 0 }];
      examGrade.value = 0;
      examWeight.value = 0;
      isEditModalOpen.value = false;
      isEditing.value = false;
    }

    const setEditingSubject = (subject) => {
      selectedSubject.value = subject.name;
      isEditing.value = true;
      openEditModal();
    };


    const addComponent = () => {
      seminarComponents.value.push({ name: '', weight: 0, grade: 0 });
    }

    const removeComponent = (index) => {
      seminarComponents.value.splice(index, 1);
    }

    const calculateFinalGrade = () => {
      const seminarAverage = seminarComponents.value.reduce((sum, component) => {
        return sum + (component.grade * (component.weight / 100));
      }, 0);

      const examAverage = examGrade.value * (examWeight.value / 100);

      return seminarAverage + examAverage;
    }

    const saveGrades = async () => {
      isEditing.value = false;
      const finalGrade = calculateFinalGrade();

      const gradeData = {
        name: selectedSubject.value,
        seminarComponents: seminarComponents.value,
        examWeight: examWeight.value,
        examGrade: examGrade.value,
        finalGrade
      };

      try {
        await store.dispatch('grades/saveSubjectGrades', {
          userId: userId.value,
          gradeData
        });
        toast.success('Note salvate cu succes!');
        await loadGrades();
        closeEditModal();
      } catch (error) {
        const errors = error.response.data.errors;
        for(const error of errors) {
          toast.error(error.msg);
        }
      }
    }

    const updateSubjectGrades = async () => {
      if (!selectedSubject.value) {
        toast.error('Selectează o materie!');
        return;
      }

      try {
        const finalGrade = calculateFinalGrade();
        await store.dispatch('grades/updateSubjectGrades', {
          userId: userId.value,
          gradeData: {
            name: selectedSubject.value,
            seminarComponents: seminarComponents.value,
            examWeight: examWeight.value,
            examGrade: examGrade.value,
            finalGrade
          }
        });
        toast.success('Note actualizate cu succes!');
        await loadGrades();
        closeEditModal();
      } catch (error) {
        const errors = error.response.data.errors;
        for(const error of errors) {
          toast.error(error.msg);
        }
      }
    }

    const handleSubmit = async () => {
      if (isEditing.value) {
        await updateSubjectGrades();
      } else {
        await saveGrades();
      }
    }

    const deleteSubjectGrade = async (subjectName) => {
      if (!confirm('Ești sigur că vrei să ștergi notele asociate acestei materii?')) return;

      try {
        await store.dispatch('grades/deleteSubjectGrade', {
          userId: userId.value,
          subjectName
        });
        toast.success('Notă ștearsă cu succes!');
      } catch (error) {
        toast.error('Eroare la ștergerea notei');
      }
    }

    onMounted(async () => {
      if (userId.value) {
        await uniqueSubjects();
        await loadGrades();
      }
    });

    return {
      subjects,
      savedGrades,
      selectedSubject,
      isEditModalOpen,
      openEditModal,
      closeEditModal,
      seminarComponents,
      examWeight,
      examGrade,
      addComponent,
      removeComponent,
      saveGrades,
      updateSubjectGrades,
      deleteSubjectGrade,
      handleSubmit,
      setEditingSubject,
      isEditing
    };
  }
};
</script>

<style scoped>
.grade-tracking-container {
  width: 60%;
  max-width: 1200px;
  min-width: auto;
  margin: 20px auto;
  padding: 20px;
  background-color: #fffefece;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.subject-selection {
  margin-bottom: 20px;
  font-family: "Sour Gummy", sans-serif;
}

.subject-selection select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  border: 1px solid #c8e1ff;
  border-radius: 8px;
  font-family: "Playwrite HR Lijeva", sans-serif;
  font-size: 1rem;
}

.grade-input-section {
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.weights-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: "Sour Gummy", sans-serif;
}

.weight-input {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.seminar-components-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.seminar-component-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.component-inputs {
  display: flex;
  gap: 15px;
  flex: 1;
  flex-wrap: wrap;
}

.component-inputs input {
  flex: 1;
  min-width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background-color: #fff;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

table th {
  background-color: #7f73bf;
  color: white;
  white-space: nowrap;
}

table td button {
  margin: 2px;
  padding: 5px 10px;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 15px 0;
}

.subjects-overview {
  margin-top: 80px;
}

.subjects-overview table {
  font-family: "Sour Gummy", sans-serif;
}

.examen {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  padding: 15px;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 95%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.no-grades {
  text-align: center;
  font-size: 1.1rem;
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .grade-tracking-container {
    padding: 15px;
    margin: 10px auto;
  }

  .grade-input-section {
    padding: 10px;
  }

  .component-inputs {
    flex-direction: column;
    gap: 10px;
  }

  .component-inputs input {
    width: 100%;
  }

  .modal-content {
    padding: 15px;
  }

  table td,
  table th {
    padding: 8px 5px;
    font-size: 0.85rem;
  }
}

@media screen and (max-width: 480px) {
  .grade-tracking-container {
    padding: 10px;
  }

  .subject-selection select {
    font-size: 0.9rem;
  }

  .seminar-component-row {
    flex-direction: column;
    align-items: stretch;
  }

  table {
    font-size: 0.8rem;
  }

  table td button {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .modal-actions button {
    width: 100%;
  }

  .no-grades {
    font-size: 1rem;
  }
}
</style>