<template>
    <Searchbar @search="search"/>

    <div id="photos" v-if="!loading">
      <PostsCardView :posts="posts"/>
    </div>
    <div id="loading-bar" v-else>
      <h1>Loading...</h1>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { BeforeAfterPicture } from '@/models';
import { BeforeAfterPicsService } from '../services';
import Searchbar from './Searchbar.vue';
import PostsCardView from './PostsCardView.vue';
import { SearchParams } from '@/models/search-params.model';

const posts = reactive<BeforeAfterPicture[]>([]);
const loading = ref(true);
BeforeAfterPicsService.getPosts().then((resp:BeforeAfterPicture[]) => {
  loading.value = false;
  posts.splice(0, posts.length, ...resp);
});

const search = (searchParams:Partial<SearchParams>) => {
  const loading = ref(true);
  BeforeAfterPicsService.getPosts(searchParams).then((resp:BeforeAfterPicture[]) => {
    loading.value = false;
    posts.splice(0, posts.length, ...resp);
  });
};
</script>
