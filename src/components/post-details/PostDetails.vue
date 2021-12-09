<template>
    <div class="post border-round shadow-2 bg-primary">
        <div class="flex flex-wrap justify-content-between mb-1">
            <div class="flex text-white heading-text">{{ buildTitle(post) }}</div>
        </div>
        <div v-if="post.imageUrl?.includes('redditmedia')">
            <div
                class="overall-scalable"
                :width="post.imageWidth!"
                :height="post.imageHeight!"
                :style="`width: ${post.imageWidth!}px; height: ${post.imageHeight!}px;`"
            >
                <iframe
                    :width="post.imageWidth!"
                    :height="post.imageHeight!"
                    class="scalable"
                    :title="post.description"
                    scrolling="no"
                    sandbox="allow-forms allow-orientation-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    :src="post.imageUrl"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
        <img :src="post.imageUrl" style="max-width: 90%; max-height: 70vh;" v-else />
        <div class="flex flex-row flex-wrap justify-content-between mb-1 mt-2 px-3"
            :width="post.imageWidth!" :style="`width: ${post.imageWidth}px;`">
            <div class="flex flew-row text-white subheading-text">
                <i class="flex align-items-center pi pi-thumbs-up mr-1 pb-1"></i>
                <p class="flex align-items-center my-0 mr-2">{{ post.likes }}</p>
                <i class="flex align-items-center pi pi-comment mr-1"></i>
                <p class="flex align-items-center my-0">{{ post.comments }}</p>
                <Tag
                    value="nsfw"
                    severity="danger"
                    class="flex align-items-center ml-2"
                    v-if="post.nsfw"
                ></Tag>
            </div>

            <div class="flex flew-row text-white subheading-text">
                <i class="flex align-items-center pi pi-share-alt mr-2"></i>
                <a href="flex align-items-center url text-white">Share</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { BeforeAfterPicture } from '@/models';
    import { PropType } from '@vue/runtime-core';

    const {post} = defineProps({
        post: Object as PropType<BeforeAfterPicture>
    })

    function buildTitle(post: BeforeAfterPicture) {
        return `${post.startWeight} lbs → ${post.endWeight} lbs (${post.weightChange} lbs)`;
    }

    
</script>

<style scoped>
    .subheading-text > p, .subheading-text > i, .subheading-text > a {
        font-size: 1.2rem;
    }
</style>
