<template>
  <div>
    <h2>Create a New Wolf</h2>
    <form class="edit-form">
      <label class="form-label">Name:</label>
      <input type="text" class="form-input" v-model="newWolf.name" required>
      <label>Gender:</label>
        <select class="form-input" v-model="newWolf.gender" required>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
      <label class="form-label">Birthday:</label>
      <input class="form-input" type="date" v-model="newWolf.birthday" required>
      <div class="btn-wrapper">
        <button type="submit" class="submit-button big-btn" @click="createWolf">Save</button>
        <button type="button" class="cancel-button big-btn" @click="cancelCreation">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import axiosInstance from '@/services/api.js';
import '@/assets/main.css'

export default {
  props: {
  },
  data() {
    return {
      newWolf: {
        name: '',
        gender: '',
        birthday: '',
      },
    };
  },
  methods: {
    createWolf() {
      // Make an API POST request to create a new wolf using axiosInstance
      axiosInstance.post('/wolves', this.newWolf)
        .then(() => {
          // Clear the form after successful creation
          this.newWolf = {
            name: '',
            gender: '',
            birthday: '',
          };
          // Emit an event to notify the parent component that a new wolf has been created
          this.$emit('wolfCreated');
          this.$emit('cancelCreate');
        })
        .catch((error) => {
          console.error('Error creating wolf:', error);
        });
    },
    cancelCreation() {
      this.newWolf = {
        name: '',
        gender: '',
        birthday: '',
      };
      // Close the form by setting showCreateForm to false
      this.$emit('cancelCreate');
    },
  },
};
</script>

<style scoped>

</style>