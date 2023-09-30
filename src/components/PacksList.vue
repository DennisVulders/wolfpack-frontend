<template>
  <div class="packs">
    <h2>List of Packs</h2>
    <!-- Render each pack using the Pack component -->
    <div v-for="pack in packs" :key="pack.id" class="pack-container">
      <PackDetail :pack="pack" @packRemoved="refreshPackList"/>
    </div>
    <div class="create-pack-form">
      <button class="form-input create-button big-btn" type="submit" @click="showCreateForm = !showCreateForm">Create New Pack</button>
      <!-- Form for creating packs (conditionally rendered) -->
      <form class="edit-form" v-if="showCreateForm">
        <label class="form-label">Name:</label>
        <input type="text" class="form-input" v-model="newPack.name" required>
        <label class="form-label">Latitude:</label>
        <input type="number" class="form-input" v-model="newPack.lat" required>
        <label class="form-label">Longitude:</label>
        <input type="number" class="form-input" v-model="newPack.lng" required>
        <div class="btn-wrapper">
          <button class="form-input submit-button big-btn" type="submit" @click ="createPack">save</button>
          <button type="button" class="cancel-button big-btn" @click="cancelCreate">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/api.js'; // Update the path as needed
import PackDetail from "@/components/PackDetail.vue";

export default {
  data() {
    return {
      packs: [],
      wolves: [],
      selectedWolfToAdd: null,
      newPack: {
        name: '',
        lat: '',
        lng: '',
      },
      showCreateForm: false,
    };
  },
  mounted() {
    this.fetchPacks();
    this.fetchWolves();
  },
  components: {
    PackDetail,
  },
  methods: {
    fetchPacks() {
      // Make an API GET request to fetch all packs
      axiosInstance.get('/packs')
        .then((response) => {
          this.packs = response.data;
        })
        .catch((error) => {
          console.error('Error fetching packs:', error);
        });
    },
    fetchWolves() {
      // Make an API GET request to fetch all wolves
      axiosInstance.get('/wolves')
        .then((response) => {
          this.wolves = response.data;
        })
        .catch((error) => {
          console.error('Error fetching wolves:', error);
        });
    },
    addWolfToPack(selectedWolf) {
      if (selectedWolf) {
        const selectedWolfId = selectedWolf.id;
        const packId = this.selectedPack.id;
        // Make an API POST request to add the selected wolf to the pack
        axiosInstance.post(`/packs/${packId}/wolf/${selectedWolfId}`)
          .then(() => {
            // If successful, you can update the local state or re-fetch packs to reflect the change
            this.fetchPacks();
            this.fetchWolves(); // Optionally fetch wolves to reflect the change
          })
          .catch((error) => {
            console.error('Error adding wolf to pack:', error);
          });
      } else {
        console.warn('No wolf selected to add to the pack.');
      }
    },
    removeWolfFromPack(pack) {
      if (this.selectedWolf) {
        const selectedWolfId = this.selectedWolf.id;
        const packId = pack.id;

        // Make an API DELETE request to remove the selected wolf from the pack
        axiosInstance.delete(`/packs/${packId}/wolf/${selectedWolfId}`)
          .then(() => {
            // If successful, you can update the local state or re-fetch packs to reflect the change
            this.fetchPacks();
            this.fetchWolves(); // Optionally fetch wolves to reflect the change
          })
          .catch((error) => {
            console.error('Error removing wolf from pack:', error);
          });
      } else {
        console.warn('No wolf selected to remove from the pack.');
      }
    },
    createPack() {
      // Make an API POST request to create a new pack using axiosInstance
      axiosInstance.post('/packs', this.newPack)
        .then(() => {
          // Clear the form after successful creation
          this.newPack = {
            name: '',
            lat: '',
            lng: '',
          };
          // Emit an event to notify the parent component that a new pack has been created
          this.$emit('packCreated');
          this.$emit('cancel')
          // Optionally, you can also refresh the list of packs by calling a method to fetch packs
          this.fetchPacks();
        })
        .catch((error) => {
          console.error('Error creating pack:', error);
        });
    },
    cancelCreate() {
      // Clear the form fields
      this.newPack = {
        name: '',
        lat: '',
        lng: '',
      };
      // Close the form by setting showCreateForm to false
      this.showCreateForm = false;
    },
    refreshPackList() {
      this.fetchPacks();
    },
  },
};
</script>

<style scoped>
.packs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.pack-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.create-pack-form {
  min-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
