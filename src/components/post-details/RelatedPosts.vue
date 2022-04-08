<template>
    <div class="flex flex-column">
        <h3 id="related-posts-title" class="ml-3 mt-1 mb-0 w-full text-align-left">Related Posts</h3>
        <div id="photos" ref='scrollComponent'>
            <div class="grid font-bold text-white mx-0 my-2" >
                <div class="col-12 px-0 xl:col-4 lg:col-6 md:col-6 pb-0 pt-0 lg:px-2 md:px-2"
                    v-for="post in posts"
                    :key="post.id"
                >
                    <div class="post md:border-round lg:border-round xl:border-round shadow-2 mb-2 bg-primary" :id="'post-' + post.id">
                    <Post 
                        :post="post"
                        :three-split-enabled="true"/>
                    </div>

                    <div v-if="Math.random() <= adProb" class="in-article-ad w-max h-max">
                    <InArticleAd></InArticleAd>
                    </div>
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
