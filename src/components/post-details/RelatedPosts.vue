<template>
    <h3 id="related-posts-title" class="ml-3 mt-1">Related Posts</h3>
    <div class="post border-round shadow-2 bg-primary">
        <div class="grid border-round m-2">
            <div
                class="xl:col-6 lg:col-6 md:col-6 sm:col-12 pb-0 pt-0"
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
</template>

<script lang="ts" setup>
import { BeforeAfterPicture } from '@/models';
import { PropType } from '@vue/runtime-core';

const { post } = defineProps({
    post: Object as PropType<BeforeAfterPicture>
})
</script>

<style scoped>
#related-posts-title {
    float: left;
    display: block;
    font-size: 1.5rem;
}
</style>
