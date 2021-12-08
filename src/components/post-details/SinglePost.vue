<template>
    <div class="mb-3 pt-2 mx-3">
        <PostDetails
            :post="post"
        ></PostDetails>

        <RelatedPosts>
            
        </RelatedPosts>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { BeforeAfterPicsService } from '@/services';
import { reactive } from 'vue';
import PostDetails from './PostDetails.vue';
import RelatedPosts from './RelatedPosts.vue';

const route = useRoute();
const router = useRouter();

// get post id from query params
const postId: number = route.query.id;
if (!postId) {
    console.error('no id passed');
    router.push({
        path: '/'
    });
}

//grab from db
let post: any = reactive<any>({});
BeforeAfterPicsService
    .getPostById(postId)
    .then((resp) => Object.assign(post, resp))
    .catch(() => console.error('error while getting post'));
</script>

<style scoped>
    .subheading-text > p, .subheading-text > i, .subheading-text > a {
        font-size: 1.2rem;
    }
</style>
