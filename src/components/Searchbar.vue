<template>
    <div class="card bg-white">
        <div class="flex flex-column card-container green-container">
            <div class="flex flex-row flex-wrap card-container h-5rem">
                <div class="flex align-items-center justify-content-center h-5rem m-2">
                    <h3 style="color: black;" class="mr-3">Start Weight</h3>
                    <InputNumber v-model="startWeight" class="mr-3" showButtons suffix=" lbs"/>
                    <h3 style="color: black;" class="mr-3">End Weight</h3>
                    <InputNumber v-model="endWeight" showButtons suffix=" lbs"/>
                    <Button label="Find Photos" class="ml-3" @click="f"/>
                </div>
            </div>
            <div class="flex flex-row flex-wrap card-container h-5rem">
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-2">
                    <Checkbox id="male" name="male" value="Male" v-model="searchOptions"
                        class="mr-1"/>
                    <label for="male">Male</label>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5">
                    <Checkbox id="female" name="female" value="Female" v-model="searchOptions"
                        class="mr-1" />
                    <label for="female">Female</label>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5">
                    <Checkbox id="nsfw" name="nsfw" value="NSFW" v-model="searchOptions"
                        class="mr-1" />
                    <label for="nsfw">Include NSFW?</label>
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
import { ref } from 'vue';

const startWeight = ref(200);
const endWeight = ref(100);

const searchOptions = ref([]);

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
</script>

<style>
    button.p-tree-toggler {
        display: none;
    }

    .p-tree {
        padding: 0 !important;
    }
</style>
