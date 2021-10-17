<template>
    <div class="flex flex-column card-container w-full">
        <div
          class="flex align-items-center justify-content-center font-bold text-white border-round
                m-2"
          v-for="post in posts" :key="post.id">
            <div class="surface-card p-4 shadow-2 border-round">
                <div class="flex flex-row flex-wrap justify-content-between">
                    <div class="flex text-3xl font-medium text-900 mb-3">
                        {{buildTitle(post)}}
                    </div>
                    <div class="top-auto bottom-auto" v-if="post.nsfw">
                        <Tag value="nsfw" severity="danger"></Tag>
                    </div>
                </div>
                <div class="flex flex-row flex-wrap justify-content-between">
                    <div class="flex font-medium text-500 mb-3">
                        {{post.gender? post.gender=="M" ? "Male," : "Female," : "" }}
                        {{post.age}}
                    </div>
                    <div class="flex font-medium text-500 mb-3">
                        {{getDateDesc(post.createdAt)}}
                    </div>
                </div>
                <img :src="post.imageUrl" style="max-width: 90%">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import { PropType, ref, defineProps } from 'vue';
import { BeforeAfterPicture } from '@/models';

const props = defineProps({
  posts: {
    type: Array as PropType<BeforeAfterPicture[]>,
    required: true,
  },
});

const posts = ref(props.posts);

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
