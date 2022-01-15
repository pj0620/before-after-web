<template>
    <h3 id="related-posts-title" class="ml-3 mt-1 mb-0">Related Posts</h3>
    <div class="border-round ml-1">
        <div class="grid w-full border-round">
            <div
                class="xl:col-4 lg:col-4 md:col-6 sm:col-12 py-0"
                v-for="post in posts"
                :key="post.id"
            >
                <div class="post border-round shadow-2 w-full mb-3 bg-primary px-2">
                    <Post 
                        :post="post"
                        :threeSplitEnabled="true" />
                </div>
                <div v-if="Math.random() <= adProb" class="in-article-ad w-max h-max">
                    <InArticleAd></InArticleAd>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { BeforeAfterPicture } from '@/models';
import { PropType } from '@vue/runtime-core';
import { Constants } from '@/constants';
import Post from '../Post.vue';
import InArticleAd from '../InArticleAd.vue'

const adProb = Constants.AD_PROB;

const { posts } = defineProps({
    posts: Array as PropType<BeforeAfterPicture[]>
});
</script>

<style scoped>
#related-posts-title {
    float: left;
    display: block;
    font-size: 1.5rem;
}
</style>
