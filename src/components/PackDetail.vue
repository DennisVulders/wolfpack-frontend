<template>
  <div class="pack-wrapper">
    <div class="main-info">
      <h3>{{ pack.name }}</h3>
      <p>Latitude: {{ pack.lat }}</p>
      <p>Longitude: {{ pack.lng }}</p>
    </div>
    <div v-if="packWolves && packWolves.length > 0" class="wolves-wrapper">
      <h3>Wolves in the Pack:</h3>
      <ul>
        <li v-for="wolf in packWolves" :key="wolf.id">
          {{ wolf.name }}
          <button @click="removeWolfFromPack(wolf)">X</button>
        </li>
      </ul>
    </div>
    <div class="add-wolf-wrapper">
      <div class="add-wolf-controls">
        <h3>Select a Wolf to Add:</h3>
        <select class="form-input" v-model="selectedWolfToAdd">
          <option value="" disabled>Select a wolf</option>
          <option v-for="wolf in allWolves" :key="wolf.id" :value="wolf">
            {{ wolf.name }}
          </option>
        </select>
        <button class="form-input submit-button big-btn" type="submit" @click="addWolfToPack(selectedWolfToAdd)">Add Wolf to Pack</button>
        <button class="form-input delete-button big-btn spacing-left" @click="removePack">X</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/api.js';
import '@/assets/main.css'

export default {
  props: {
    pack: Object,
  },
  data() {
    return {
      selectedWolfToAdd: null,
      allWolves: [],
      packWolves: [],
    };
  },
  mounted() {
    this.fetchAllWolves();
    this.fetchWolvesForPack();
  },
  methods: {
    fetchAllWolves() {
      // Make an API GET request to fetch all wolves
      axiosInstance.get('/wolves')
        .then((response) => {
          this.allWolves = response.data;
        })
        .catch((error) => {
          console.error('Error fetching all wolves:', error);
        });
    },
    fetchWolvesForPack() {
      const packId = this.pack.id;

      // Make an API GET request to fetch the list of wolves for the current pack
      axiosInstance.get(`/packs/${packId}`)
        .then((response) => {
          this.packWolves = response.data.wolves;
        })
        .catch((error) => {
          console.error('Error fetching wolves for pack:', error);
        });
    },
    addWolfToPack(selectedWolf) {
      if (selectedWolf) {
        const selectedWolfId = selectedWolf.id;
        const packId = this.pack.id;

        // Make an API POST request to add the selected wolf to the pack
        axiosInstance.post(`/packs/${packId}/wolf/${selectedWolfId}`)
          .then(() => {
            // If successful, you can update the local state or re-fetch packs to reflect the change
            this.$emit('wolfAddedToPack'); // Emit an event to notify the parent component
            this.fetchWolvesForPack();
          })
          .catch((error) => {
            console.error('Error adding wolf to pack:', error);
          });
      } else {
        console.warn('No wolf selected to add to the pack.');
      }
    },
    removeWolfFromPack(wolf) {
      const wolfId = wolf.id;
      const packId = this.pack.id;

      // Make an API DELETE request to remove the wolf from the pack
      axiosInstance.delete(`/packs/${packId}/wolf/${wolfId}`)
        .then(() => {
          // If successful, you can update the local state or re-fetch packs to reflect the change
          this.$emit('wolfRemovedFromPack'); // Emit an event to notify the parent component
          this.fetchWolvesForPack();
        })
        .catch((error) => {
          console.error('Error removing wolf from pack:', error);
        });
    },
    removePack() {
      const packId = this.pack.id;

      // Make an API DELETE request to remove the pack
      axiosInstance.delete(`/packs/${packId}`)
        .then(() => {
          // Emit an event to notify the parent component that the pack has been removed
          this.$emit('packRemoved');
        })
        .catch((error) => {
          console.error('Error removing pack:', error);
        });
    },
  },
};
</script>

<style scoped>
.pack-wrapper {
  display: flex;
  border-radius: 16px;
  border: 1px #000 solid;
  padding: 1rem;
  text-align: start;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}
.main-info {
  min-width: 20%;
}
.add-wolf-wrapper {
  display: flex;
  align-items: center;
}

.add-wolf-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.wolves-wrapper {
  flex: 1;
}
.wolves-wrapper > ul {
  display: flex;
  gap: 1rem;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.wolves-wrapper > ul > li {
  background-color: #007bff;
  border-radius: 16px;
  color: #fff;
  margin-bottom: 10px;
  padding: 1rem;
  width: fit-content;
}

.wolves-wrapper > ul > li > button {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  margin-left: 10px;
}
.add-wolf-wrapper > select {
  margin-right: 1rem;
}
</style>
