<template>
    <div class="card bg-primary">
        <div class="flex flex-column card-container green-container">
            <div class="flex flex-wrap card-container">
                <div class="flex flex-row align-items-center justify-content-center
                  pl-3 mt-1 mb-3">
                    <h3 class="entry-label-unit">Select Unit: </h3>
                    <ToggleButton 
                      class="toggle-unit p-1" 
                      @change="updateUseLbs(true)" 
                      v-model="lbsSelected"
                      :class="{'toggle-selected': lbsSelected}"
                      onLabel="lbs" 
                      offLabel="lbs"/>
                    <ToggleButton 
                      class="toggle-unit p-1" 
                      @change="updateUseLbs(false)" 
                      v-model="kgSelected"
                      :class="{'toggle-selected': kgSelected}"
                      onLabel="kgs" 
                      offLabel="kgs"/>
                    <div 
                      style="border-left: 1px solid white;height: 1.2rem;"
                      class="mr-2 ml-0"></div>
                    <ToggleButton 
                      class="toggle-unit p-1" 
                      @change="updateUseFt(true)" 
                      v-model="ftSelected" 
                      :class="{'toggle-selected': ftSelected}"
                      onLabel="ft/inch" 
                      offLabel="ft/inch"/>
                    <ToggleButton 
                      class="toggle-unit p-1" 
                      @change="updateUseFt(false)" 
                      v-model="cmSelected" 
                      :class="{'toggle-selected': cmSelected}"
                      onLabel="cm" 
                      offLabel="cm"/>
              </div>
            </div>
            <div class="flex flex-wrap card-container">
                <div class="flex flex-row align-items-center justify-content-center
                  pl-2 pb-2">
                    <h3 class="entry-label-weight">Start Weight</h3>
                    <InputNumber v-model="startWeight" v-on:keyup.enter="search" class="mr-4" showButtons :suffix="useLbs ? ' lbs' : ' kg'"/>
                    <h3 class="entry-label-weight">End Weight</h3>
                    <InputNumber v-model="endWeight" v-on:keyup.enter="search" showButtons :suffix="useLbs ? ' lbs' : ' kg'" />
                    <Button label="Find Photos" class="ml-3 border-white border-3 border-round text-lg font-bold" @click="search"/>
                </div>
            </div>
            <div class="flex flex-row flex-wrap card-container h-full pl-2 pb-2">
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5 entry-label">
                    <label for="nsfw-select" class="mr-1">NSFW / SFW</label>
                    <TreeSelect id="nsfw-select" v-model="nsfwSelected"
                        :options="nsfwOptions" placeholder="Both"/>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5 entry-label">
                    <label for="gender-select" class="mr-1">Gender</label>
                    <TreeSelect id="gender-select" v-model="genderSelected"
                        :options="genderOptions" placeholder="Both"/>
                </div>
                <div class="flex align-items-center justify-content-center p-field-checkbox mr-5 entry-label">
                    <label for="height-select" class="mr-1">Height</label>
                    <TreeSelect id="height-select" v-model="heightSelected"
                        :options="useFt ? heightOptionsFt : heightOptionsCm" placeholder="Any"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import ToggleButton from 'primevue/togglebutton';
import { useGtag } from 'vue-gtag-next';
import { ref, defineEmits, Ref, inject } from 'vue';
import { SearchParams } from '@/models/search-params.model';
import { Constants, Environment } from '@/constants';

const emit = defineEmits(['search']);

const { event } = useGtag();

const startWeight = ref(200);
const endWeight = ref(100);

const nsfwSelected = ref({ Both: true });
const nsfwOptions = [
  { key: 'NSFW', label: '🌶️ NSFW' },
  { key: 'SFW', label: '😇 SFW' },
  { key: 'Both', label: 'Both' },
];

const genderSelected = ref({ B: true });
const genderOptions = [
  { key: 'M', label: '👨 Male' },
  { key: 'F', label: '👩 Female' },
  { key: 'B', label: 'Both' },
];

// height input
const heightSelected = ref({ Any: true });

const heightOptionsFt = [
  { key: 'Any', label: 'Any' },
  { key: `< 4''`, label: `< 4'` },
];
for (let ft=4; ft < 7; ft++) {
  for (let inch=0; inch < 12; inch++) {
    heightOptionsFt.push({ 
      key: inch ? `${ft}'${inch}` : `${ft}'`, 
      label: inch ? `${ft}'${inch}` : `${ft}'`
    });
  }
}
heightOptionsFt.push({ key: `> 6'11`, label: `> 6'11` });

const heightOptionsCm = [
  { key: 'Any', label: 'Any' },
  { key: `< 122cm`, label: `< 122cm` },
];
for (let cm=123; cm < 214; cm++) {
  heightOptionsCm.push({ 
    key: `${cm}cm`, 
    label: `${cm}cm`
  });
}
heightOptionsCm.push({ key: `> 214cm`, label: `> 214cm` });

const useLbs:Ref<boolean> = inject('useLbs') || ref(true);
const lbsSelected = ref(useLbs.value);
const kgSelected = ref(!useLbs.value);
const setUseLbs:any = inject('setUseLbs')!;
const updateUseLbs = (newV: boolean) => {
  if (Constants.ENV === Environment.WEB) {
    event(newV ? 'set-to-lbs' : 'set-to-kg');
  }
  if (newV) {
    lbsSelected.value = true;
    kgSelected.value = false;
  }
  else {
    lbsSelected.value = false;
    kgSelected.value = true;
  }
  setUseLbs(newV);
} 

const useFt:Ref<boolean> = inject('useFt') || ref(true);
const ftSelected = ref(useFt.value);
const cmSelected = ref(!useFt.value);
const setUseFt:any = inject('setUseFt')!;
const updateUseFt = (newV: boolean) => {
  if (Constants.ENV === Environment.WEB) {
    event(newV ? 'set-to-ft' : 'set-to-cm');
  }
  if (newV) {
    ftSelected.value = true;
    cmSelected.value = false;
  }
  else {
    ftSelected.value = false;
    cmSelected.value = true;
  }
  setUseFt(newV);
} 

const search = () => {
  const searchParams: Partial<SearchParams> = {};

  if (useLbs.value) {
    searchParams.start_weight = startWeight.value;
    searchParams.end_weight = endWeight.value;
  }
  else {
    searchParams.start_weight = Math.round(startWeight.value * 2.205);
    searchParams.end_weight = Math.round(endWeight.value * 2.205);
  }

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

  if (!Object.prototype.hasOwnProperty.call(heightSelected.value, 'Any')) {
    let heightStr = Object.keys(heightSelected.value)[0];
    let lt = heightStr.includes('<');
    let gt = heightStr.includes('>');
    heightStr = heightStr.replaceAll('< ', '').replaceAll('> ', '');
    if (heightStr.includes('cm')) {
      searchParams.height = Math.round(
        parseInt(heightStr.replace('cm', '')) / 2.54
      );
    }
    else {
      const split = heightStr.split("'");
      if (!split[1]) {
        searchParams.height = parseInt(split[0]) * 12;
      }
      else {
        searchParams.height = parseInt(split[0]) * 12 + parseInt(split[1]);
      }
    }
  }
  
  emit('search', searchParams);
};
</script>

<style>
  .toggle-selected {
    background-color: white !important; 
    color: var(--color-primary) !important;
  }

  .toggle-unit {
    color: white;
    font-weight: 900;
    font-size: 0.8rem;
    margin-right: 0.5rem;
  }

  .entry-label-unit {
    color: white;
    font-weight: 900;
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }

  .p-treeselect-label {
    color: #6c757d;
  }

  button.p-tree-toggler {
      display: none;
  }

  .p-tree {
      padding: 0 !important;
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
    margin-right: 0.5rem;
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
