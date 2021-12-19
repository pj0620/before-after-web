<template>
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
</template>

<script lang="ts" setup>
import Textarea from 'primevue/textarea';
import { PropType, Ref, ref } from 'vue';
import Button from 'primevue/button';
import { BeforeAfterPicsService } from '@/services';
import { BeforeAfterPicture, CommentI } from '@/models';
import { Constants } from '@/constants';

const { post } = defineProps({
  post: {
    type: Object as PropType<BeforeAfterPicture>,
    required: true,
  },
});

const emit = defineEmits(['newComment']);

const newComment = ref('');
const errorMsg = ref('');

function postComment() {
  if (newComment.value.length == 0) {
    errorMsg.value = "Error: Empty Comment"
    return;
  }
  else if (!isASCII(newComment.value)) {
    errorMsg.value = "Error: Comment contains invalid characters"
    return;
  }
  else if (newComment.value.length > Constants.MAX_COMMENT_LENGTH) {
    errorMsg.value = "Error: Max comment length is 250 characters"
    return;
  }
  errorMsg.value = '';
  BeforeAfterPicsService
    .postComment(post.id, newComment.value)
    .then((resp: CommentI) => {
      post.comments++;
      comments.value.push(resp);
      newComment.value = '';
    })
    .catch(() => console.log('error while posting comment'));
}

function isASCII(str:string) {
    const extended = true;
    return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(str);
}

const comments:Ref<CommentI[]> = ref([]);
BeforeAfterPicsService
  .getComments(post.id)
  .then((resp: CommentI[]) => comments.value.push(...resp));

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
  background-color: var(--color-secondary);
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
</style>
