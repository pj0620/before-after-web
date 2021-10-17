<template>
    <div class="card bg-white">
        <div class="flex flex-column card-container green-container">
            <div class="flex  flex-wrap card-container">
                <div class="flex flex-column md:flex-row align-items-center justify-content-center
                  m-2">
                    <h3 style="color: black;" class="mr-3">Start Weight</h3>
                    <InputNumber v-model="startWeight" class="mr-3" showButtons suffix=" lbs"/>
                    <h3 style="color: black;" class="mr-3">End Weight</h3>
                    <InputNumber v-model="endWeight" showButtons suffix=" lbs"/>
                    <Button label="Find Photos" class="ml-3" @click="search"/>
                </div>
            </div>
            <div class="flex flex-row flex-wrap card-container h-5rem">
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5">
                    <label for="nsfw-select" class="mr-1">NSFW</label>
                    <TreeSelect id="nsfw-select" v-model="nsfwSelected"
                        :options="nsfwOptions" placeholder="Both NSFW/SFW"/>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5">
                    <label for="gender-select" class="mr-1">Gender</label>
                    <TreeSelect id="gender-select" v-model="genderSelected"
                        :options="genderOptions" placeholder="Both"/>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5">
                    <label for="startRange" class="mr-1">Start Weight Range</label>
                    <TreeSelect id="startRange" v-model="startWeightRangeSelected"
                        :options="weightRangeOptions" placeholder="Start Weight Range"/>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox">
                    <label for="endRange" class="mr-1">End Weight Range</label>
                    <TreeSelect id="endRange" v-model="endWeightRangeSelected"
                        :options="weightRangeOptions" placeholder="End Weight Range"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
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

const startWeightRangeSelected = ref({ 5: true });
const endWeightRangeSelected = ref({ 5: true });
const weightRanges = [1, 3, 5, 10, 50];
const weightRangeOptions = weightRanges.map(
  (weight:number) => ({
    key: weight.toString(),
    label: `±${weight} lbs`,
    data: weight.toString(),
  }),
);

const search = () => {
  const searchParams:Partial<SearchParams> = {
    start_weight: startWeight.value,
    start_weight_range: parseInt(Object.getOwnPropertyNames(startWeightRangeSelected.value)[0], 10),
    end_weight: endWeight.value,
    end_weight_range: parseInt(Object.getOwnPropertyNames(endWeightRangeSelected.value)[0], 10),
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
    button.p-tree-toggler {
        display: none;
    }

    .p-tree {
        padding: 0 !important;
    }
</style>
