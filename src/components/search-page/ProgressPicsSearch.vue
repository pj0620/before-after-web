<template>
  <div class="mt-1 shadow-2 xl:mx-2 lg:mx-2 md:mx-0 sm:mx-0">
    <SearchbarSmall v-if="mobileMode === 'sm'" @search="search"/>
    <SearchbarMedium v-else-if="mobileMode === 'md'" @search="search"/>
    <Searchbar v-else @search="search" /> 
  </div>

  <!-- Non-empty -->
  <div id="photos" v-if="!loading && posts.length > 0"
    ref='scrollComponent'>
    <div class="grid font-bold text-white border-round my-2 xl:mx-2 lg:mx-2 md:mx-2 sm:mx-0" >
      <div class="xl:col-6 lg:col-6 md:col-6 sm:col-12 pb-0 pt-0"
        v-for="post in posts"
        :key="post.id"
      >
        <div class="post border-round shadow-2 w-full mb-2 bg-primary" :id="'post-' + post.id">
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
nextTick,
  onMounted, onUnmounted, reactive, Ref, ref
} from 'vue';
import { BeforeAfterPicture } from '@/models';
import { BeforeAfterPicsService } from '../../services';
import Searchbar from './searchbars/Searchbar.vue';
import SearchbarMedium from './searchbars/SearchbarMedium.vue';
import SearchbarSmall from './searchbars/SearchbarSmall.vue';
import Post from '../Post.vue';
import { SearchParams } from '@/models/search-params.model';
import InArticleAd from '../InArticleAd.vue';
import { Constants } from '@/constants';
import { inject } from 'vue';
import { useGtag } from "vue-gtag-next";

const postsLimit = Constants.POSTS_LIMIT;
const postsOffset:Ref<number> = inject('pageOffset') || ref(postsLimit);
const searchParams:Ref<Partial<SearchParams>> = inject('lastSearchParams') || ref({});
const lastClickedPost:Ref<number> = inject('lastClickedPost') || ref(-1);

const setPageOffset:any = inject('setPageOffset')!;
const setLastSearchParams:any = inject('setLastSearchParams');

if (postsOffset.value == 0) {
  postsOffset.value = 1;
}

if (!setPageOffset) {
  throw Error("cannot find injected setPageOffset");
}
if (!setLastSearchParams) {
  throw Error("cannot find injected setLastSearchParams");
}
const setLastClickedPost:any = inject('setLastClickedPost');
if (!setLastClickedPost) {
  throw Error("cannot find injected setLastClickedPost");
}

const adProb = Constants.AD_PROB;

const posts = reactive<BeforeAfterPicture[]>([]);
const loading = ref(true);
BeforeAfterPicsService
  .getPosts({ limit: 2*postsLimit, offset:postsOffset.value-1, ...searchParams.value })
  .then((resp: BeforeAfterPicture[]) => {
  loading.value = false;
  posts.splice(0, posts.length, ...resp);
})

// for switiching searchbar
const SM_WIDTH = 576;
const MD_WIDTH = 768;
const mobileMode = ref();
const updateViewMode = () => {
  const width = document.documentElement.clientWidth;
  if (width < SM_WIDTH) {
    mobileMode.value = 'sm';
  }
  else if (width <= MD_WIDTH) {
    mobileMode.value = 'md';
  }
  else {
    mobileMode.value = 'lg';
  }
}
updateViewMode();
const { event } = useGtag();
const search = (searchParamsIn: Partial<SearchParams>) => {
  event('search');
  const loading = ref(true);
  setPageOffset(0);
  setLastSearchParams(searchParamsIn);
  BeforeAfterPicsService
    .getPosts({ ...searchParamsIn, limit: postsLimit })
    .then((resp: BeforeAfterPicture[]) => {
      loading.value = false;
      posts.splice(0, posts.length, ...resp);
    });
};

// Scrolling
const loadingMorePosts = ref(false);
function loadMorePosts(): void {
  if (loadingMorePosts.value) {
    return;
  }
  setPageOffset(postsOffset.value + postsLimit);
  BeforeAfterPicsService
    .getPosts({ ...searchParams.value, limit: postsLimit, offset: postsOffset.value })
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

// tries to scroll to last selected view, return false if not yet on page
// let triesAttempted = 0;
function attemptToScrollTo(numTries: number) {
  let triesAttempted = 0;
  async function attempScroll() {
    //sleep
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //try to scroll to document
    const post = document.getElementById('post-' + lastClickedPost.value);
    if (post) {
      post.scrollIntoView();
      setLastClickedPost(-1);
      return;
    }
    else {
      triesAttempted += 1;
    }

    // retry if attempts < numTries
    if (triesAttempted < numTries) {
      attempScroll();
    }
    else {
      triesAttempted = 0;
      setLastClickedPost(-1);
      return;
    }
  }
  attempScroll();
}

onMounted(() => {
  nextTick()
  .then(() => {
    if (lastClickedPost.value != -1) {
      attemptToScrollTo(3);
    }
  })
  .then(()=>
    window.addEventListener('scroll', handleScroll)
  );

  window.addEventListener('resize', updateViewMode);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateViewMode);
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
