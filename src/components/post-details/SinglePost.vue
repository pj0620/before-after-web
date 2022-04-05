<template>
    <div v-if="post.imageUrl" class="mb-3 pt-2 mx-3">
        <div class="flex" v-if="showBackButton">
          <Button 
            icon="pi pi-chevron-left"
            label="Back to Search Results" 
            class="back-button"
            @click="$router.push('/')" 
          />
        </div>

        <div class="flex flex-row align-items-center justify-content-center">
          <div class="flex align-items-center justify-content-center border-round shadow-2 mb-3 bg-primary px-2 pb-2 " id="mainPost">
            <Post
              :post="post"
              :alwaysFullSize="true"
              :clickable="false"
              />
          </div>
        </div>

        <h3 id="comments-title" class="ml-3 mt-0 mb-0">Comments</h3>
        <div class="comment-section px-3 pt-3 pb-6 mt-0">
            <div class="grid">
            <div class="col-12 py-1" v-for="comment in comments">
                <div class="u-shadow-v18 g-bg-secondary px-4 pt-1 pb-1">
                <div class="mb-0 comment-time">
                    <span class="g-color-gray-dark-v4 g-font-size-12">
                    {{getDateDesc(comment.createdAt)}}
                    </span>
                </div>
                <p class="comment-block-text mt-3 mb-1">
                    {{comment.body}}
                </p>
                </div>
            </div>
            <div class="col-12">
                <div class="media-body u-shadow-v18 g-bg-secondary px-4 pt-3 pb-2">
                <div class="mb-0 comment-time">
                    <span class="text-lg font-bold">New Comment</span>
                </div>
                <Textarea class="col-12" v-model="newComment" rows="5" cols="30" />
                </div>
            </div>
            </div>
            <p v-if="errorMsg !== ''" style="color: red; background-color: white;">{{errorMsg}}</p>
            <Button label="Post Comment" class="ml-3 border-white border-3 border-round text-lg font-bold post-button" @click="postComment"/>
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
import {
  reactive, Ref, ref, watch,
} from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import _ from 'lodash';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { Constants, Environment } from '@/constants';
import Post from '../Post.vue';
import { BeforeAfterPicture, CommentI } from '@/models';
import RelatedPosts from './RelatedPosts.vue';
import { BeforeAfterPicsService } from '@/services';
import { AnalyticsService } from '@/services/analytics.service';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  id: Number,
});

const showBackButton = ref(
  Constants.ENV === Environment.IOS
);

const post: BeforeAfterPicture|{} = reactive<BeforeAfterPicture|{}>({});
const relatedPosts: Ref<BeforeAfterPicture[]> = ref<BeforeAfterPicture[]>([]);
const comments:Ref<CommentI[]> = ref([]);
async function init() {
  const postId = props.id;
  // get post id from query params
  if (!postId) {
    console.error('no id passed');
    router.push({
      path: '/',
    });
    return;
  }

  // get post
  try {
    const respPost = await BeforeAfterPicsService.getPostById(postId);
    Object.assign(post, respPost);
  } catch (e) {
    console.error('error while getting post');
    return;
  }

  // related posts
  try {
    const respRelated = await BeforeAfterPicsService
      .getPosts(_.pick(post, 'startWeight', 'endWeight', 'gender'));
    const related = respRelated.filter((relatedPost) => relatedPost.id !== post.id);
    relatedPosts.value.splice(0, relatedPosts.value.length, ...related);
  } catch {
    console.error('error while getting post');
    return;
  }

  // comments
  try {
    const respComments = await BeforeAfterPicsService.getComments(post.id);
    comments.value.splice(0, comments.value.length, ...respComments);
  } catch {
    console.error('error while getting post');
  }
}
init();
watch(() => props.id, init);

const newComment = ref('');
const errorMsg = ref('');

let pendingCommentPost = false;
function postComment() {
  if (newComment.value.length == 0) {
    errorMsg.value = 'Error: Empty Comment';
    AnalyticsService.analyticsEvent('error-comment-empty');
    return;
  }
  if (newComment.value.length > Constants.MAX_COMMENT_LENGTH) {
    errorMsg.value = 'Error: Max comment length is 250 characters';
    AnalyticsService.analyticsEvent('error-comment-toolong');
    return;
  }
  if (_.isEmpty(post)) {
    return;
  }

  if (pendingCommentPost) {
    return;
  }
  pendingCommentPost = true;
  errorMsg.value = '';
  AnalyticsService.analyticsEvent('post-comment');
  BeforeAfterPicsService
    .postComment(post.id, newComment.value)
    .then((resp: CommentI) => {
      pendingCommentPost = false;
      post.comments++;
      comments.value.push(resp);
      newComment.value = '';
    })
    .catch(() => {
      pendingCommentPost = false;
      console.log('error while posting comment');
    });
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

function getDateDesc(date:string): string {
  const diff = Math.floor(Date.now() / 1000) - Math.floor(new Date(date).getTime() / 1000);

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

<style scoped>
/* ::v-deep #mainPost .post-subtext {
    font-size: 1.8rem;
} */

/* ::v-deep #mainPost .share-icon {
    font-size: 1.2rem;
} */

::v-deep #mainPost .heading-text {
    font-size: 2rem;
}

.post {
    padding: 0.5rem;
}

/* ::v-deep #mainPost .like-button {
    color:white;
    width: 2.4rem;
    padding-bottom: 0.2rem;
    margin-right: 0.1rem;
} */

::v-deep #mainPost a.share-text {
    font-size: 1.1rem;
}
::v-deep #mainPost .p-tag-value {
    font-size: 0.95rem;
}

::v-deep #mainPost .p-tag {
    height: 1.1rem;
    margin-top:0.5rem;
}

/* ::v-deep #mainPost .comment-icon{
    margin-right: 0.4rem;
} */

/* ::v-deep #mainPost .subheading-text{
    font-size: 1.5rem;
} */

.post-button {
  float: right;
  margin-right: 1rem;
}

body {
  margin-top: 20px;
  background: #eee;
}
@media (min-width: 0) {
  .g-mr-15 {
    margin-right: 1.07143rem !important;
  }
}
@media (min-width: 0) {
  .g-mt-3 {
    margin-top: 0.21429rem !important;
  }
}

.g-height-50 {
  height: 50px;
}

.g-width-50 {
  width: 50px !important;
}

@media (min-width: 0) {
  .g-pa-30 {
    padding: 2.14286rem !important;
  }
}

.g-bg-secondary {
  background-color: #fafafa !important;
}

.u-shadow-v18 {
  box-shadow: 0 5px 10px -6px rgba(0, 0, 0, 0.15);
}

.g-color-gray-dark-v4 {
  color: #777 !important;
}

.g-font-size-12 {
  font-size: 0.85714rem !important;
}

.media-comment {
  margin-top: 20px;
}

.comment-block-text {
  text-align: left;
  overflow-wrap: break-word;
}

.comment-time {
  text-align: left;
}

.comment-section {
  background-color: var(--color-primary);
}

#comments-title {
  /* float: left;
    display: block;
    font-size: 1.5rem; */
  text-align: left;
  font-size: 1.5rem;
}

::v-deep textarea.p-inputtextarea {
  resize: none !important;
}

.back-button {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>
