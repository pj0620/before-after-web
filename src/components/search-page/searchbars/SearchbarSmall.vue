<template>
  <div class="card bg-primary pt-2">
    <div class="flex flex-column card-container green-container">
      <div class="flex flex-row justify-content-end align-content-end input-row-weight mb-2">
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
          class="mr-2"></div>
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
      <div class="flex flex-row justify-content-between align-content-between input-row-weight mb-3">
        <h3 class="flex align-items-center justify-content-center entry-label-weight">Start Weight</h3>
        <InputNumber
          class="flex align-items-center justify-content-center weight-input"
          v-model="startWeight"
          v-on:keyup.enter="search" 
          showButtons
          :suffix="useLbs ? ' lbs' : ' kgs'"
        />
      </div>
      <div class="flex flex-row justify-content-between align-content-center input-row-weight mb-3">
        <h3 class="align-items-center justify-content-center entry-label-weight">End Weight</h3>
        <InputNumber
          class="align-items-center justify-content-center weight-input"
          v-model="endWeight"
          v-on:keyup.enter="search" 
          showButtons
          :suffix="useLbs ? ' lbs' : ' kgs'"
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
        
        <!-- <TreeSelect
          id="nsfw-select"
          v-model="nsfwSelected"
          :options="nsfwOptions"
          placeholder="Both NSFW/SFW"
        /> -->
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
      <div class="flex input-row align-items-center justify-content-between p-field-checkbox entry-label">
        <label for="height-select" class="mr-1">Height</label>
        <TreeSelect id="height-select" v-model="heightSelected"
            :options="useFt ? heightOptionsFt : heightOptionsCm" placeholder="Any"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import ToggleButton from 'primevue/togglebutton';
import { ref, defineEmits, inject, Ref, computed } from 'vue';
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
heightOptionsFt.push({ key: `>= 7'`, label: `>= 7'` });

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
  console.log('updateUseLbs -> ' + newV);
  if (newV) {
    lbsSelected.value = true;
    kgSelected.value = false;
  }
  else {
    lbsSelected.value = false;
    kgSelected.value = true;
  }
  setUseLbs(useLbs.value);
} 

const useFt:Ref<boolean> = inject('useFt') || ref(true);
const ftSelected = ref(useFt.value);
const cmSelected = ref(!useFt.value);
const setUseFt:any = inject('setUseFt')!;
const updateUseFt = (newV: boolean) => {
  if (newV) {
    ftSelected.value = true;
    cmSelected.value = false;
  }
  else {
    ftSelected.value = false;
    cmSelected.value = true;
  }
  setUseFt(useFt.value);
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
.toggle-unit {
  color: white;
  font-weight: 900;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  height: 1.2rem;
}

.entry-label-unit {
  color: white;
  font-weight: 900;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  height: 1.2rem;
  margin-top: 0;
  margin-bottom: 0;
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
