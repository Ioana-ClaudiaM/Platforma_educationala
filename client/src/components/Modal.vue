<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">{{ title }}</h3>

      <form @submit.prevent="handleSubmit">
        <div v-for="field in fields" :key="field.id" class="form-group">
          <template v-if="['text', 'number'].includes(field.type)">
            <label :for="field.id">{{ field.label }}</label>
            <input :type="field.type" :id="field.id" v-model="formData[field.id]" :min="field.min" :max="field.max"
              :placeholder="field.placeholder" :required="field.required" />
          </template>

          <template v-else-if="field.type === 'select'">
            <label :for="field.id">{{ field.label }}</label>
            <select :id="field.id" v-model="formData[field.id]" :required="field.required">
              <option value="" disabled>{{ field.placeholder }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </template>

          <template v-else-if="field.type === 'date'">
            <label :for="field.id">{{ field.label }}</label>
            <input type="date" :id="field.id" v-model="formData[field.id]" :min="field.min" :max="field.max"
              :required="field.required" />
          </template>

          <template v-else-if="field.type === 'textarea'">
            <label :for="field.id">{{ field.label }}</label>
            <textarea :id="field.id" v-model="formData[field.id]" :placeholder="field.placeholder"
              :required="field.required" :rows="field.rows || 3"></textarea>
          </template>

          <template v-else-if="field.type === 'array'">
            <label>{{ field.label }}</label>
            <div class="array-group">
              <div v-for="(item, index) in formData[field.id]" :key="index" class="array-item">
                <div class="array-inputs">
                  <div v-for="subField in field.fields" :key="subField.id" class="sub-field">
                    <label :for="`${field.id}-${index}-${subField.id}`">
                      {{ subField.label }}
                    </label>
                    <input :type="subField.type" :id="`${field.id}-${index}-${subField.id}`"
                      v-model="formData[field.id][index][subField.id]" :min="subField.min" :max="subField.max"
                      :placeholder="subField.placeholder" :required="subField.required" />
                  </div>
                </div>
                <button type="button" class="remove-btn" @click="removeArrayItem(field.id, index)">
                  ❌
                </button>
              </div>
              <button type="button" class="add-btn" @click="addArrayItem(field.id, field.defaultItem)">
                ➕ Adaugă {{ field.itemLabel || 'Item' }}
              </button>
            </div>
          </template>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="handleClose">
            Anulează
          </button>
          <button type="submit" class="submit-btn">
            Salvează
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'DynamicFormModal',

  props: {
    isOpen: Boolean,
    title: String,
    fields: Array,
    initialData: {
      type: Object,
      default: () => ({})
    },
  },

  emits: ['submit', 'close'],

  setup(props, { emit }) {
    const formData = ref({ ...props.initialData })

    const handleSubmit = () => {
      emit('submit', { ...formData.value })
    }

    const handleClose = () => {
      emit('close')
    }

    const addArrayItem = (fieldId, defaultItem) => {
      if (!formData.value[fieldId]) {
        formData.value[fieldId] = []
      }
      formData.value[fieldId] = [...formData.value[fieldId], { ...defaultItem }]
    }

    const removeArrayItem = (fieldId, index) => {
      formData.value[fieldId].splice(index, 1)
    }

    watch(() => props.initialData, (newVal) => {
      formData.value = { ...newVal }
    }, { deep: true })

    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        formData.value = { ...props.initialData }
      }
    })
    
    return {
      formData,
      handleSubmit,
      handleClose,
      addArrayItem,
      removeArrayItem
    }
  }
}
</script>

<style scoped>
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
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.array-group .array-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.array-inputs {
  display: flex;
  flex: 1;
  gap: 10px;
}

.sub-field {
  flex: 1;
}

.array-item button {
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
}

.add-btn {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  position:relative;
}

.add-btn:hover {
  background-color: #e0e0e0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn {
  background-color: #7f73bf;
  color: white;
}

.submit-btn:hover {
  background-color: #6a5fa3;
}

.cancel-btn {
  background-color: #f0f0f0;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}
</style>