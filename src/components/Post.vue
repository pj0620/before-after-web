<template>
    <div class="flex flex-row flex-wrap justify-content-between mb-1">
        <div class="flex text-3xl font-medium text-900">
            {{buildTitle(post)}}
        </div>
        <div class="top-auto bottom-auto" v-if="post.nsfw">
            <Tag value="nsfw" severity="danger"></Tag>
        </div>
    </div>
    <div class="flex flex-row flex-wrap justify-content-between mb-1">
        <div class="flex font-medium text-500">
            {{post.gender? post.gender=="M" ? "Male," : "Female," : "" }}
            {{post.age}}
        </div>
        <div class="flex font-medium text-500">
            {{getDateDesc(post.createdAt)}}
        </div>
    </div>
    <div class="flex flex-row flex-wrap justify-content-between mb-3">
        <a :href="post.originalPost" target="_blank">
            source
        </a>
    </div>
    <iframe v-if="post.imageUrl.includes('redditmedia')"
        :width="post.imageWidth" :height="post.imageHeight"
        :title="post.description" sandbox="allow-forms
            allow-orientation-lock allow-popups allow-popups-to-escape-sandbox
            allow-presentation allow-same-origin allow-scripts
            allow-top-navigation-by-user-activation" scrolling="no"
        :src="post.imageUrl" allowfullscreen
        :style="`overflow:hidden;margin:0 auto;
            width:${post.imageWidth};max-height:70vh`" >
    </iframe>
    <img :src="post.imageUrl" style="max-width: 90%; max-height: 70vh;" v-else/>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import { PropType, ref, defineProps } from 'vue';
import { BeforeAfterPicture } from '@/models';

const props = defineProps({
  post: {
    type: Object as PropType<BeforeAfterPicture>,
    required: true,
  },
});
const post = ref(props.post);

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
