<template>
    <div v-if="post.imageUrl" class="mb-3 pt-2 mx-3">
        <div class=" border-round shadow-2 w-full mb-3 bg-primary px-2">
          <Post 
            :post="post"
            :alwaysFullSize="true"
            id="mainPost"
            />
        </div>

        <RelatedPosts
            v-if="relatedPosts.length > 0"
            :posts="relatedPosts"
        />
    </div>

    <ProgressSpinner v-else/>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { BeforeAfterPicsService } from '@/services';
import { reactive, Ref, ref } from 'vue';
import PostDetails from './PostDetails.vue';
import RelatedPosts from './RelatedPosts.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { BeforeAfterPicture } from '@/models';
import _ from 'lodash';
import Post from '../Post.vue';

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
const post: BeforeAfterPicture|{} = reactive<BeforeAfterPicture|{}>({});
BeforeAfterPicsService
    .getPostById(postId)
    .then((resp) => Object.assign(post, resp))
    .catch(() => console.error('error while getting post'));

// related posts
const relatedPosts: Ref<BeforeAfterPicture[]> = ref<BeforeAfterPicture[]>([]);
BeforeAfterPicsService
    .getPosts(_.pick(post,'startWeight', 'endWeight','gender'))
    .then((resp) => relatedPosts.value.splice(0,0,...resp))
    .catch(() => console.error('error while getting post'));
</script>

<style scoped>
    ::v-deep #mainPost .post-subtext {
        font-size: 1.8rem;
    }

    ::v-deep #mainPost .share-icon {
        font-size: 1.2rem;
    }

    ::v-deep #mainPost .heading-text {
        font-size: 2.75rem;
    }

    .post {
        padding: 0.5rem;
    }

    ::v-deep #mainPost .like-button {
        color:white;
        width: 2.4rem;
        padding-bottom: 0.2rem;
        margin-right: 0.1rem;
    }

    ::v-deep #mainPost a.share-text {
        font-size: 1.1rem;
    }

    ::v-deep #mainPost .comment-icon{
        margin-right: 0.4rem;
    }

    ::v-deep #mainPost .subheading-text{
        font-size: 1.1rem;
    }
</style>
