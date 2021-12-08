<template>
    <a @click="gotoPost">
      <div class="flex flex-row flex-wrap justify-content-between mb-1">
          <div class="flex text-white heading-text">
              {{buildTitle(post)}}
          </div>
      </div>
      <div class="flex flex-row flex-wrap justify-content-between mb-1">
          <div class="flex flew-row text-white subheading-text">
              <i class="flex align-items-center pi pi-thumbs-up mr-1 pb-1"></i>
              <p class="flex align-items-center my-0 mr-2">{{post.likes}}</p>
              <i class="flex align-items-center pi pi-comment mr-1"></i>
              <p class="flex align-items-center my-0">{{post.comments}}</p>
              <Tag value="nsfw" severity="danger" class="flex align-items-center ml-2" v-if="post.nsfw"></Tag>
          </div>

          <div class="flex flew-row text-white subheading-text">
              <i class="flex align-items-center pi pi-share-alt mr-2"></i>
              <a href="flex align-items-center url text-white">
                Share
              </a>
          </div>
      </div>
      <div class="flex flex-row flex-wrap justify-content-between mb-1">
          <div class="flex text-white subheading-text">
              {{post.gender? post.gender=="M" ? "Male," : "Female," : "" }}
              {{post.age}}
          </div>
          <div class="flex text-white subheading-text">
              {{getDateDesc(post.createdAt)}}
          </div>
      </div>
      <div v-if="Constants.INCLUDE_SOURCE" class="flex flex-row flex-wrap justify-content-between mb-3">
          <a :href="post.originalPost" target="_blank">
              source
          </a>
      </div>
      <div v-if="post.imageUrl?.includes('redditmedia')">
        <div class="overall-scalable"
        :width="post.imageWidth!" :height="post.imageHeight!"
        :style="`width: ${finalWidth}px; height: ${finalHeight}px;`">
          <iframe
              :width="post.imageWidth!" :height="post.imageHeight!"
              class="scalable"
              :title="post.description" scrolling="no"
              sandbox="allow-forms allow-orientation-lock allow-presentation allow-same-origin
              allow-scripts allow-top-navigation-by-user-activation"
              :src="post.imageUrl" allowfullscreen
              :style="iframeCss"
              >
          </iframe>
        </div>
      </div>
      <img :src="post.imageUrl" style="max-width: 90%; max-height: 70vh;" v-else/>
    </a>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import {
  PropType, ref, defineProps, computed, onMounted, onUnmounted,
} from 'vue';
import { BeforeAfterPicture } from '@/models';
import { Constants } from '@/constants';
import { useRouter } from 'vue-router';

const props = defineProps({
  post: {
    type: Object as PropType<BeforeAfterPicture>,
    required: true,
  },
});
const post = ref(props.post);

const router = useRouter();
function gotoPost() {
  router.push({
    path: '/post', 
    query: {
      id: post.value.id
    }
  });
}

// for switiching searchbar
const SM_WIDTH = 576;
const MD_WIDTH = 768;
const finalWidth = ref();
const updateWidth = () => {
  const width = document.documentElement.clientWidth;
  if (width <= MD_WIDTH) {
    finalWidth.value = Math.floor(0.85 * width);
  }
  else {
    finalWidth.value = Math.floor(0.45 * width);
  }
}
updateWidth();
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))
const scaleFactor = computed(() => finalWidth.value / post.value.imageWidth!);
const finalHeight = computed(() => Math.floor(scaleFactor.value * post.value.imageHeight!));
const iframeCss = computed(() => {
  let css = 'overflow:hidden;margin:0 auto;'
  + `width:${post.value.imageWidth};`;

  css += `-ms-zoom: ${scaleFactor.value};`
    + `-moz-transform: scale(${scaleFactor.value});`
    + '-moz-transform-origin: 0 0;'
    + `-o-transform: scale(${scaleFactor.value});`
    + '-o-transform-origin: 0 0;'
    + `-webkit-transform: scale(${scaleFactor.value});`
    + '-webkit-transform-origin: 0 0;';

  return css;
});

function buildTitle(post:BeforeAfterPicture) {
  return `${post.startWeight} lbs → ${post.endWeight} lbs (${post.weightChange} lbs)`;
}

    // eslint-disable-next-line no-shadow
    enum Duration {
        MINUTE=60,
        HOUR=60 * 60,
        DAY=60 * 60 * 24,
        WEEK=60 * 60 * 24 * 7,
        MONTH=60 * 60 * 24 * 30,
        YEAR=60 * 60 * 24 * 365
    }

function getDateDesc(date:number): string {
  const diff = Math.floor(Date.now() / 1000) - date;

  if (diff < Duration.MINUTE) {
    return `${diff} seconds ago`;
  }
  if (diff < Duration.HOUR) {
    return `${Math.ceil(diff / Duration.MINUTE)} minutes ago`;
  }
  if (diff < Duration.DAY) {
    return `${Math.ceil(diff / Duration.HOUR)} hours ago`;
  }
  if (diff < Duration.WEEK) {
    return `${Math.ceil(diff / Duration.DAY)} days ago`;
  }
  if (diff < Duration.MONTH) {
    return `${Math.ceil(diff / Duration.WEEK)} weeks ago`;
  }
  if (diff < Duration.YEAR) {
    return `${Math.ceil(diff / Duration.MONTH)} months ago`;
  }
  return `${Math.ceil(diff / Duration.YEAR)} years ago`;
}
</script>

<style>
  .overall-scalable {
    overflow: hidden; 
    -webkit-transition: all 1s;
  }

  .scalable {
    -webkit-transform-origin: top left; 
    -webkit-transition: all 1s;
  }

  .heading-text {
    margin: auto;
    font-size: 2.1rem;
    font-weight: bolder;
  }

  .subheading-text {
    font-size: 1rem;
    font-weight: lighter;
  }

  a {
  color: white;
}
</style>
