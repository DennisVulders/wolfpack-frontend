<template>
  <div class="wolves-list">
    <h2>List of Wolves</h2>
    <ul>
      <!-- Loop through the wolves and display their data -->
      <li v-for="wolf in wolves" :key="wolf.id" class="wolf-item">
        <div v-if="editingWolfId !== wolf.id" class="wolf-info">
          <span class="wolf-name">{{ wolf.name }}</span>
          <span class="wolf-identity">({{ wolf.gender }}) - Born: {{ wolf.birthday }}</span>
          <div class="btn-container">
            <button type="button" class="edit-button small-btn" @click="editWolf(wolf.id)">Edit</button>
            <button type="button" class="delete-button small-btn" @click="deleteWolf(wolf.id)">Delete</button>
          </div>
        </div>
        <div v-else>
          <!-- Edit form for the currently selected wolf -->
          <form @submit.prevent="updateWolf(wolf)" class="edit-form">
            <label class="form-label">Name:</label>
            <input class="form-input" type="text" v-model="wolf.name" required>
            <label class="form-label">Gender:</label>
            <select class="form-input" v-model="wolf.gender" required>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
            <label class="form-label">Birthday:</label>
            <input type="date" v-model="wolf.birthday" required class="form-input">
            <div class="btn-wrapper">
              <button type="submit" class="submit-button big-btn">Save</button>
              <button type="button" class="cancel-button big-btn" @click="cancelEdit">Cancel</button>
            </div>
          </form>
        </div>
      </li>
    </ul>
    <button type="submit" class="create-button big-btn" @click="showCreateForm = !showCreateForm">Create New Wolf</button>
    <WolfCreate v-if="showCreateForm" @wolfCreated="handleWolfCreated" @cancelCreate="showCreateForm = !showCreateForm" />
  </div>
</template>

<script>
import axiosInstance from '@/services/api.js';
import WolfCreate from '@/components/WolfCreate.vue';
import '@/assets/main.css'

export default {
  data() {
    return {
      wolves: [],
      editingWolfId: null, // Track the ID of the wolf being edited
      showCreateForm: false, // Control whether to show the creation form
    };
  },
  mounted() {
    this.fetchWolves();
  },
  components: {
    WolfCreate,
  },
  methods: {
    fetchWolves() {
      // Make an API GET request to fetch all wolves using axiosInstance
      axiosInstance.get('/wolves')
        .then((response) => {
          this.wolves = response.data;
        })
        .catch((error) => {
          console.error('Error fetching wolves:', error);
        });
    },
    editWolf(wolfId) {
      this.editingWolfId = wolfId;
    },
    cancelEdit() {
      this.editingWolfId = null;
    },
    updateWolf(wolf) {
      // Make an API PUT request to update the wolf's data using axiosInstance
      axiosInstance.put(`/wolves/${wolf.id}`, wolf)
        .then(() => {
          // Clear the editing state
          this.editingWolfId = null;
        })
        .catch((error) => {
          console.error('Error updating wolf:', error);
        });
    },
    deleteWolf(wolfId) {
      // Make an API DELETE request to delete a wolf by ID using axiosInstance
      axiosInstance.delete(`/wolves/${wolfId}`)
        .then(() => {
          // Remove the deleted wolf from the local list
          this.wolves = this.wolves.filter(wolf => wolf.id !== wolfId);
        })
        .catch((error) => {
          console.error('Error deleting wolf:', error);
        });
    },
      handleWolfCreated() {

      // Work-around to hide the creation form
      this.$emit('cancelCreate');

      // Fetch the updated list of wolves
      this.fetchWolves();
    },
  },
};
</script>

<style scoped>
  .wolves-list {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .wolves-list h2 {
    font-size: 24px;
    color: #333;
  }

  .wolves-list ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .wolf-item {
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  .wolf-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .wolf-name {
    font-size: 20px;
    font-weight: bold;
    width: 20%;
    text-align: left;
  }

  .wolf-identity {
    text-align: start;
    width: 40%;
  }

  .wolf-details {
    font-size: 16px;
    color: #555;
  }

  .btn-container {
    display: flex;
    gap: 1rem;
  }
</style>

