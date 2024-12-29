<template>
  <div class="grade-tracking-container">
    <h2><i class="fa-solid fa-book"></i>📝 Evidență Note</h2>
    <div class="subject-selection">
      <select id="subject-select" v-model="selectedSubject" @change="openEditModal">
        <option value="" disabled>Selectează o materie</option>
        <option v-for="subject in uniqueSubjects" :key="subject" :value="subject">
          {{ subject }}
        </option>
      </select>

    </div>

    <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h3><i class="fa-solid fa-cogs"></i> Editare Notă pentru {{ selectedSubject }}</h3>

        <div class="weights-container">
          <div class="weight-input">
            <label><i class="fa-solid fa-weight-scale"></i> Pondere Seminar/Laborator:</label>
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
                      <input type="number" v-model.number="component.weight" min="0" max="100" placeholder="Pondere %"
                        id="component-weight" />
                    </div>
                    <div>
                      <label for="component-grade">Notă</label>
                      <input type="number" v-model.number="component.grade" min="0" max="10" placeholder="Notă"
                        id="compoennt-grade" />
                    </div>
                    <button @click="removeComponent(index, 'seminar')" class="delete-component">
                    <i class="fa-solid fa-trash"></i>❌ Șterge
                  </button>
                  </div>
                </div>
              </div>
            </div>
            <button @click="addComponent('seminar')" class="add-component">
              <i class="fa-solid fa-plus"></i>➕ Adaugă o nouă componentă la seminar
            </button>
          </div>

          <div class="weight-input examen">
            <label><i class="fa-solid fa-file-alt"></i> Pondere Examen:</label>
            <div class="component-inputs">
              <div>
                <label for="exam-weight">Pondere</label>
                <input type="number" v-model.number="examWeight" min="0" max="100" placeholder="Pondere Examen %"
                  id="exam-weight" />
              </div>
              <div>
                <label for="exam-grade">Notă</label>
                <input type="number" v-model.number="examGrade" min="0" max="10" placeholder="Notă Examen"
                  id="exam-grade" />
              </div>
            </div>

          </div>
        </div>

        <div class="calculation-result">
          <h4><i class="fa-solid fa-calculator"></i> Calcul Medie Finală</h4>
          <p>Media Seminar: {{ seminarAverage.toFixed(2) }}</p>
          <p>Notă Finală: {{ finalGrade.toFixed(2) }}</p>
        </div>

        <div class="modal-actions">
          <button @click="saveSubjectGrades" class="save-grades">
            <i class="fa-solid fa-save"></i>💾 Salvează
          </button>
          <button @click="closeEditModal" class="cancel-button">
            <i class="fa-solid fa-times"></i>❌ Închide
          </button>
        </div>
      </div>
    </div>

    <div class="subjects-overview">
      <h3><i class="fa-solid fa-eye"></i> Vedere de Ansamblu Note</h3>
      <table>
        <thead>
          <tr>
            <th>Materie</th>
            <th>Medie Finală</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subject, index) in savedSubjects" :key="index">
            <td>{{ subject.name }}</td>
            <td>{{ subject.finalGrade.toFixed(2) }}</td>
            <td class="actions">
              <button @click="updateSubjectGrades(subject)">
                <i class="fa-solid fa-edit"></i> ✏️
              </button>
              <button @click="deleteSubjectGrade(subject)">
                <i class="fa-solid fa-trash"></i> ❌
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: 'Calculator-Note',
  setup() {
    const store = useStore();
    const userId = computed(() => store.getters['user/userId']);  
    const uniqueSubjects = ref([]);
    const selectedSubject = ref('');
    const savedSubjects = ref([]);
    const isEditModalOpen = ref(false);

    const seminarComponents = ref([{ name: '', weight: 0, grade: 0 }]);

    const examWeight = ref(60);
    const examGrade = ref(0);

    const addComponent = (type) => {
      if (type === 'seminar') {
        seminarComponents.value.push({ name: '', weight: 0, grade: 0 });
      }
    };

    const removeComponent = (index, type) => {
      if (type === 'seminar') {
        seminarComponents.value.splice(index, 1);
      }
    };

    const seminarAverage = computed(() => {
      const totalWeight = seminarComponents.value.reduce((sum, comp) => sum + comp.weight, 0);
      if (totalWeight === 0) return 0;

      const weightedSum = seminarComponents.value.reduce((sum, comp) =>
        sum + (comp.grade * comp.weight / 100), 0);

      return weightedSum;
    });

    const finalGrade = computed(() => {
      const seminarPart = seminarAverage.value;
      const examPart = examGrade.value * examWeight.value / 100;
      console.log(examPart, seminarPart)
      return seminarPart + examPart;
    });

    const openEditModal = () => {
      loadSubjectDetails();
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
      seminarComponents.value = [{ name: '', weight: 0, grade: 0 }];
      examWeight.value = 60;
      examGrade.value = 0;
      selectedSubject.value = '';
    };

    const schedule = computed(() => store.getters['timetable/schedule']);

    watch(schedule, (newSchedule) => {
      if (newSchedule) {
        const allSubjects = [];
        Object.values(newSchedule).forEach(daySchedule => {
          daySchedule.forEach(subject => {
            if (subject && !allSubjects.includes(subject)) {
              allSubjects.push(subject);
            }
          });
        });
        uniqueSubjects.value = allSubjects;
      }
    }, { immediate: true });


    const loadSubjectDetails = () => {
      seminarComponents.value = [{ name: '', weight: 0, grade: 0 }];
      examWeight.value = 60;
      examGrade.value = 0;

      const savedSubject = savedSubjects.value.find(s => s.name === selectedSubject.value);
      if (savedSubject) {
        seminarComponents.value = savedSubject.seminarComponents;
        examWeight.value = savedSubject.examWeight;
        examGrade.value = savedSubject.examGrade;
      }
    };

    const saveSubjectGrades = () => {
      const existingSubjectIndex = savedSubjects.value.findIndex(s => s.name === selectedSubject.value);

      const subjectData = {
        name: selectedSubject.value,
        seminarComponents: seminarComponents.value,
        examWeight: examWeight.value,
        examGrade: examGrade.value,
        finalGrade: finalGrade.value
      };

      if (existingSubjectIndex !== -1) {
        savedSubjects.value[existingSubjectIndex] = subjectData;
      } else {
        savedSubjects.value.push(subjectData);
      }

      persistSubjectGrades(subjectData);
      closeEditModal();
    };

    const persistSubjectGrades = async (subjectData) => {
      try {
        await axios.post('http://localhost:8000/saveSubjectGrades', {
          userId: userId.value,
          subject: subjectData
        });
      } catch (error) {
        console.error("Eroare la salvarea notelor:", error);
      }
    };


    const updateSubjectGrades = async (subjectData) => {
      try {
        selectedSubject.value = subjectData.name;
        seminarComponents.value = subjectData.seminarComponents || [{ name: '', weight: 0, grade: 0 }];
        examWeight.value = subjectData.examWeight || 60;
        examGrade.value = subjectData.examGrade || 0;

        openEditModal();

        await axios.put('http://localhost:8000/updateSubjectGrades', {
          userId: userId.value,
          subject: subjectData
        });
      } catch (error) {
        console.error("Eroare la actualizarea notelor:", error);
      }
    };

    const deleteSubjectGrade = async (subject) => {
      try {
        await axios.delete('http://localhost:8000/deleteSubjectGrade', {
          data: {
            userId: userId.value,
            subjectName: subject.name
          }
        });

        const index = savedSubjects.value.findIndex(s => s.name === subject.name);
        if (index !== -1) {
          savedSubjects.value.splice(index, 1);
        }
      } catch (error) {
        console.error("Eroare la ștergerea notei:", error);
      }
    };

    onMounted(async () => {
      try {
        const response = await axios.get(`http://localhost:8000/loadSubjectGrades/${userId.value}`);
        savedSubjects.value = response.data.subjects || [];
      } catch (error) {
        console.error("Eroare la încărcarea notelor:", error);
      }
    });

    return {
      uniqueSubjects,
      selectedSubject,
      seminarComponents,
      examWeight,
      examGrade,
      savedSubjects,
      seminarAverage,
      finalGrade,
      isEditModalOpen,
      addComponent,
      removeComponent,
      openEditModal,
      closeEditModal,
      loadSubjectDetails,
      saveSubjectGrades,
      updateSubjectGrades,
      deleteSubjectGrade,
    };
  }
};
</script>

<style scoped>
.grade-tracking-container {
  min-width: 600px;
  margin: 0px auto;
  padding: 40px;
  background-color: #f9f1d0b6;
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
  padding: 20px;
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
  flex-direction: row;
  gap: 10px;
  width: 100%;
}

.component-inputs {
  display: flex;
  gap: 25px;
  flex-direction: row;
}

.component-inputs input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.calculation-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-family: "Playwrite HR Lijeva", sans-serif;

}

.calculation-result h4 {
  margin-bottom: 10px;
  font-size: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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
}

table td button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
}

.actions{
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
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
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

</style>