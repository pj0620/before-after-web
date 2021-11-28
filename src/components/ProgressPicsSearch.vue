<template>
  <div class="ml-3 mr-3 mt-1 shadow-2">
    <SearchbarSmall v-if="mobileMode === 'sm'" @search="search"/>
    <SearchbarMedium v-else-if="mobileMode === 'md'" @search="search"/>
    <Searchbar v-else @search="search" /> 
  </div>

  <!-- Non-empty -->
  <div id="photos" v-if="!loading && posts.length > 0"
    ref='scrollComponent'>
    <div class="grid font-bold text-white border-round m-2" >
      <div class="xl:col-6 lg:col-6 md:col-6 sm:col-12 pb-0 pt-0"
        v-for="post in posts"
        :key="post.id"
      >
        <div class="post border-round shadow-2 w-full mb-3 bg-primary">
          <Post :post="post" />
        </div>

        <div v-if="Math.random() <= adProb" class="in-article-ad w-max h-max">
          <InArticleAd></InArticleAd>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty -->
  <div id="no-results" v-else-if="!loading">
    <h1>No Results</h1>
  </div>
  <div id="loading-bar" v-else>
    <h1>Loading...</h1>
  </div>
</template>

<script setup lang="ts">
import {
computed,
  onMounted, onUnmounted, reactive, ref, watch,
} from 'vue';
import { BeforeAfterPicture } from '@/models';
import { BeforeAfterPicsService } from '../services';
import Searchbar from './searchbars/Searchbar.vue';
import SearchbarMedium from './searchbars/SearchbarMedium.vue';
import SearchbarSmall from './searchbars/SearchbarSmall.vue';
import Post from './Post.vue';
import { SearchParams } from '@/models/search-params.model';
import InArticleAd from './InArticleAd.vue';
import { Constants } from '@/constants';

let postsOffset = 0;
const postsLimit = Constants.POSTS_LIMIT;

const adProb = Constants.AD_PROB;

const posts = reactive<BeforeAfterPicture[]>([]);
const loading = ref(true);
BeforeAfterPicsService.getPosts({ limit: postsLimit }).then((resp: BeforeAfterPicture[]) => {
  loading.value = false;
  posts.splice(0, posts.length, ...resp);
});

// for switiching searchbar
const SM_WIDTH = 576;
const MD_WIDTH = 768;
const mobileMode = ref();
const updateViewMode = () => {
  const width = document.documentElement.clientWidth;
  if (width < SM_WIDTH) {
    console.log('sm');
    mobileMode.value = 'sm';
  }
  else if (width <= MD_WIDTH) {
    console.log('md');
    mobileMode.value = 'md';
  }
  else {
    console.log('lg');
    mobileMode.value = 'lg';
  }
}
updateViewMode();
onMounted(() => window.addEventListener('resize', updateViewMode))
onUnmounted(() => window.removeEventListener('resize', updateViewMode))


let searchParams:Partial<SearchParams>|null = null;
const search = (searchParamsIn: Partial<SearchParams>) => {
  const loading = ref(true);
  postsOffset = 0;
  searchParams = searchParamsIn;
  BeforeAfterPicsService
    .getPosts({ ...searchParamsIn, limit: postsLimit })
    .then((resp: BeforeAfterPicture[]) => {
      loading.value = false;
      console.log(JSON.stringify(resp[0]));
      posts.splice(0, posts.length, ...resp);
    });
};

// Scrolling
const loadingMorePosts = ref(false);
function loadMorePosts(): void {
  if (loadingMorePosts.value) {
    return;
  }

  postsOffset += postsLimit;
  BeforeAfterPicsService
    .getPosts({ ...searchParams, limit: postsLimit, offset: postsOffset })
    .then((resp: BeforeAfterPicture[]) => {
      loading.value = false;
      loadingMorePosts.value = false;
      posts.push(...resp);
    });
}
const scrollComponent = ref(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleScroll = (_: any) => {
  if (!Constants.INFINITE_SCROLL) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element:any = scrollComponent.value;
  if (element.getBoundingClientRect().bottom < window.innerHeight) {
    loadMorePosts();
  }
};
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
  .post {
    padding: 0.5rem;
  }

  .in-article-ad {
    min-width: 250px;
  }

</style>
