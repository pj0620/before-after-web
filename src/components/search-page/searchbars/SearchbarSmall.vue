<template>
  <div class="card bg-primary pt-2">
    <div class="flex flex-column card-container green-container">
      <div class="flex flex-row justify-content-between align-content-between input-row-weight">
        <h3 class="flex align-items-center justify-content-center entry-label-weight">Start Weight</h3>
        <InputNumber
          class="flex align-items-center justify-content-center weight-input"
          v-model="startWeight"
          v-on:keyup.enter="search" 
          showButtons
          suffix=" lbs"
        />
      </div>
      <div class="flex flex-row justify-content-between align-content-center input-row-weight">
        <h3 class="align-items-center justify-content-center entry-label-weight">End Weight</h3>
        <InputNumber
          class="align-items-center justify-content-center weight-input"
          v-model="endWeight"
          v-on:keyup.enter="search" 
          showButtons
          suffix=" lbs"
        />
      </div>
      <Button
        label="Find Photos"
        id="search-button"
        class="flex border-white border-3 border-round text-lg font-bold"
        @click="search"
      />
      <div class="flex input-row align-items-center justify-content-between p-field-checkbox entry-label">
        <label for="nsfw-select" class="mr-1">NSFW</label>
        <TreeSelect
          id="nsfw-select"
          v-model="nsfwSelected"
          :options="nsfwOptions"
          placeholder="Both NSFW/SFW"
        />
      </div>
      <div class="flex input-row align-items-center justify-content-between p-field-checkbox entry-label">
        <label for="gender-select" class="mr-1">Gender</label>
        <TreeSelect
          id="gender-select"
          v-model="genderSelected"
          :options="genderOptions"
          placeholder="Both"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import { ref, defineEmits } from 'vue';
import { SearchParams } from '@/models/search-params.model';

const emit = defineEmits(['search']);

const startWeight = ref(200);
const endWeight = ref(100);

const nsfwSelected = ref({ Both: true });
const nsfwOptions = [
  { key: 'NSFW', label: 'NSFW' },
  { key: 'SFW', label: 'SFW' },
  { key: 'Both', label: 'Both NSFW/SFW' },
];

const genderSelected = ref({ B: true });
const genderOptions = [
  { key: 'M', label: 'Male' },
  { key: 'F', label: 'Female' },
  { key: 'B', label: 'Both' },
];

const search = () => {
  const searchParams: Partial<SearchParams> = {
    start_weight: startWeight.value,
    end_weight: endWeight.value,
  };

  if (Object.prototype.hasOwnProperty.call(genderSelected.value, 'M')) {
    searchParams.gender = 'M';
  } else if (Object.prototype.hasOwnProperty.call(genderSelected.value, 'F')) {
    searchParams.gender = 'F';
  }

  if (Object.prototype.hasOwnProperty.call(nsfwSelected.value, 'NSFW')) {
    searchParams.nsfw = true;
  } else if (Object.prototype.hasOwnProperty.call(nsfwSelected.value, 'SFW')) {
    searchParams.nsfw = false;
  }

  emit('search', searchParams);
};
</script>

<style>
.p-treeselect-label {
  color: #6c757d;
}

button.p-tree-toggler {
  display: none;
}

.p-tree {
  padding: 0 !important;
}

.p-inputnumber {
  margin-bottom: 0;
}

.entry-label > label {
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
}

.entry-label-weight {
  color: white;
  font-weight: 900;
  font-size: 1.15rem;
}

.input-row {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.input-row-weight {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

#search-button {
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
