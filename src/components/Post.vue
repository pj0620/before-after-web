<template>
    <Toast />

    <a @click="gotoPost">
      <div class="flex flex-row flex-wrap justify-content-between mb-1">
          <div class="flex text-white heading-text">
              {{buildTitle(post)}}
          </div>
      </div>
      <div class="flex flex-row flex-wrap justify-content-between mb-1 mx-2">
          <div class="flex flew-row text-white subheading-text">
              <svg v-if="liked" @click.stop="dislikePost" class="like-button" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#fffffe">
                <path d="m17.25 20.75h-11.62c-1.3067 4.6e-5 -2.369-1.0534-2.38-2.36v-5.64c0.00551-1.3105 1.0695-2.37 2.38-2.37h2l2.73-6.09c0.38776-0.86557 1.3945-1.2647 2.27-0.9 1.1499 0.50943 1.8883 1.6523 1.88 2.91v2.47h4c0.05627-0.00951 0.11373-0.00951 0.17 0 0.63392 0.12219 1.1983 0.47937 1.58 1 0.36058 0.48098 0.51851 1.084 0.44 1.68l-1.1 7.29c-0.18208 1.1569-1.1788 2.0095-2.35 2.01z" fill="#fff" stroke="none"/>
                </g>
              </svg>
              <svg v-else @click.stop="likePost" xmlns="http://www.w3.org/2000/svg" class="like-button" viewBox="0 0 24 24"><g id="thumbs-up"><path fill="#FFFFFF" d="M17.25,20.75H5.63a2.38,2.38,0,0,1-2.38-2.36V12.75a2.38,2.38,0,0,1,2.38-2.37h2l2.73-6.09a1.75,1.75,0,0,1,2.27-.9A3.16,3.16,0,0,1,14.51,6.3V8.77h4a.51.51,0,0,1,.17,0,2.56,2.56,0,0,1,1.58,1,2.3,2.3,0,0,1,.44,1.68L19.6,18.74A2.38,2.38,0,0,1,17.25,20.75Zm-8.43-1.5h8.43a.87.87,0,0,0,.87-.73l1.12-7.26a.72.72,0,0,0-.16-.56,1.12,1.12,0,0,0-.66-.42H13.75A.74.74,0,0,1,13,9.52V6.3a1.66,1.66,0,0,0-1-1.53.24.24,0,0,0-.31.13L8.82,11.29ZM5.63,11.88a.87.87,0,0,0-.88.87v5.64a.87.87,0,0,0,.88.86H7.32V11.88Z"/></g></svg>
              <p class="flex align-items-center my-0 mr-2 post-subtext">{{niceNumber(post.likes)}}</p>
              <i class="flex align-items-center pi pi-comment post-subtext comment-icon"></i>
              <p class="flex align-items-center my-0 post-subtext">{{niceNumber(post.comments)}}</p>
              <Tag value="nsfw" severity="danger" class="flex align-items-center ml-2" v-if="post.nsfw"></Tag>
          </div>

          <div class="flex flex-row text-white subheading-text share-section">
              <i class="flex align-items-center pi pi-share-alt mr-2 share-icon"></i>
              <a class="flex align-items-center text-white post-subtext share-text underline" @click.stop="share">
                Share
              </a>
          </div>
      </div>
      <div class="flex flex-row flex-wrap justify-content-between mx-2">
          <div class="flex text-white subheading-text">
              {{post.gender? post.gender=="M" ? "Male," : "Female," : "" }} {{post.age}}{{post.height ? ',' + formatHeight(post.height) : ''}}
          </div>
          <div class="flex text-white subheading-text">
              {{getDateDesc(post.createdAt)}}
          </div>
      </div>
      <div v-if="Constants.INCLUDE_SOURCE" class="flex flex-row flex-wrap justify-content-between mx-2">
          <a class="source-text" @click.stop="gotoSource">
              source
          </a>
      </div>
      <div v-if="post.imageUrl?.includes('redditmedia')">
        <div class="overall-scalable"
        :width="post.imageWidth!" :height="post.imageHeight!"
        :style="`width: ${finalWidth}px; height: ${finalHeight}px;`">
          <iframe
              :width="post.imageWidth!" :height="post.imageHeight!"
              class="scalable"
              :title="post.description" scrolling="no"
              sandbox="allow-forms allow-orientation-lock allow-presentation allow-same-origin
              allow-scripts allow-top-navigation-by-user-activation"
              :src="post.imageUrl" allowfullscreen
              :style="iframeCss"
              >
          </iframe>
        </div>
      </div>
      <img :src="post.imageUrl" style="max-width: 90%; max-height: 70vh;" v-else/>
    </a>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import {
  PropType, ref, defineProps, computed, onMounted, onUnmounted, Ref, reactive, watch, inject,
} from 'vue';
import { useRouter } from 'vue-router';
import ToastService from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';
import { useGtag } from 'vue-gtag-next';
import { BeforeAfterPicsService } from '@/services';
import { Constants, Environment } from '@/constants';
import { BeforeAfterPicture } from '@/models';
import { StorgeService } from '@/services/storage.service';
import { Dialog } from '@capacitor/dialog';
import { AnalyticsService } from '@/services/analytics.service';

const props = defineProps({
  post: {
    type: Object as PropType<BeforeAfterPicture>,
    required: true,
  },
  alwaysFullSize: {
    type: Boolean,
    required: false,
  },
  threeSplitEnabled: {
    type: Boolean,
    required: false,
  },
  likeDisabled: {
    type: Boolean,
    required: false,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
});
const post = reactive(props.post);
const alwaysFullSize: Ref<boolean> = ref<boolean>(props.alwaysFullSize);

const useLbs:Ref<boolean> = inject('useLbs') || ref(true);
const useFt:Ref<boolean> = inject('useFt') || ref(true);

const setLastClickedPost:any = inject('setLastClickedPost');
if (!setLastClickedPost) {
  throw Error('cannot find injected setLastClickedPost');
}

let cookieKey = `post/${post.id}`;
const liked = ref(false);
StorgeService.get(cookieKey)
  .then((resp) => liked.value = resp === 'true')
  .catch(e => console.error(e));
watch(post, (oldV, newV) => {
  cookieKey = `post/${post.id}`;
  StorgeService.get(cookieKey)
    .then((resp) => liked.value = resp === 'true')
    .catch(e => console.error(e));
});
async function likePost() {
  if (Constants.ENV === Environment.WEB) {
    AnalyticsService.analyticsEvent('like');
  }
  if (props.likeDisabled) {
    return;
  }
  await BeforeAfterPicsService.likePost(post.id);
  liked.value = true;
  StorgeService.set(cookieKey, 'true')
    .catch(e => console.error(e));
  post.likes++;
}
async function dislikePost() {
  if (Constants.ENV === Environment.WEB) {
    AnalyticsService.analyticsEvent('dislike');
  }
  if (props.likeDisabled) {
    return;
  }
  await BeforeAfterPicsService.dislikePost(post.id);
  liked.value = false;
  StorgeService.set(cookieKey, 'false')
    .catch(e => console.error(e));
  post.likes--;
}

const router = useRouter();
function gotoPost() {
  if (!props.clickable) {
    return;
  }
  if (Constants.ENV === Environment.WEB) {
    AnalyticsService.analyticsEvent('post-clicked');
  }
  setLastClickedPost(post.id);
  router.push({
    path: `/post/${post.id}`,
  });
  window.scrollTo(0, 0);
}

const gotoSource = () => {
  if (Constants.ENV !== Environment.IOS) {
    window.location.href = post.originalPost;
    return;
  }

  Dialog.confirm({
    title: 'Confirm',
    message: `Redirect to ${post.originalPost}`,
  }).then(resp => {
    if (resp.value) {
      window.location.href = post.originalPost;
    }
  });
}

const toast = useToast();
function share() {
  if (Constants.ENV === Environment.WEB) {
    AnalyticsService.analyticsEvent('share');
  }

  //try to share using mobile
  try {
    navigator.share({
      title: 'Progresspic',
      text: `Check out this ${post.weightChange} lb weight loss photo! progresspicsearch.com/post/${post.id}`,
      url: `https://progresspicsearch.com/post/${post.id}`,
    });
    return;
  } catch (e) {}

  //add to clipboard
  navigator.clipboard.writeText(`https://progresspicsearch.com/post/${post.id}`);
  toast.add({
    severity: 'success', 
    summary: 'Url Copied To Clipboard', 
    // detail: `https://progresspicsearch.com/post/${post.id}`, 
    life: 3000,
  });
}

// for switiching searchbar
const SM_WIDTH = 576;
const MD_WIDTH = 768;
const LG_WIDTH = 992;
const finalWidth = ref();
const updateWidth = () => {
  if (alwaysFullSize.value) {
    return post.imageWidth;
  }

  const width = document.documentElement.clientWidth;
  if (width <= SM_WIDTH) {
    finalWidth.value = Math.floor(0.85 * width);
  } else if (width <= MD_WIDTH) {
    finalWidth.value = Math.floor(0.85 * width);
  } else if (width <= LG_WIDTH) {
    finalWidth.value = Math.floor(0.43 * width);
  } else {
    finalWidth.value = props.threeSplitEnabled
      ? Math.floor(0.29 * width)
      : Math.floor(0.43 * width);
  }
};
updateWidth();
onMounted(() => window.addEventListener('resize', updateWidth));
onUnmounted(() => window.removeEventListener('resize', updateWidth));
const scaleFactor = computed(() => finalWidth.value / post.imageWidth!);
const finalHeight = computed(() => Math.floor(scaleFactor.value * post.imageHeight!));
const iframeCss = computed(() => {
  let css = 'overflow:hidden;margin:0 auto;'
  + `width:${post.imageWidth};`;

  css += `-ms-zoom: ${scaleFactor.value};`
    + `-moz-transform: scale(${scaleFactor.value});`
    + '-moz-transform-origin: 0 0;'
    + `-o-transform: scale(${scaleFactor.value});`
    + '-o-transform-origin: 0 0;'
    + `-webkit-transform: scale(${scaleFactor.value});`
    + '-webkit-transform-origin: 0 0;';

  return css;
});

function buildTitle(post:BeforeAfterPicture) {
  return useLbs.value?
    `${post.startWeight} lbs → ${post.endWeight} lbs 
    (${post.weightChange} lbs)` :
    `${lbTokgs(post.startWeight)} kg → ${lbTokgs(post.endWeight)} kg 
    (${lbTokgs(post.weightChange)} kg)`;
}

function lbTokgs(lbs:number): number {
  return Math.round(lbs/2.205);
}

function formatHeight(inches: number): string {
  if (useFt.value) {
    const end = inches % 12;
    if (end === 0) {
      return " " + Math.floor(inches/12) + "ft";
    }
    else {
      return " " + Math.floor(inches/12) + "'" + end + '"';
    }
  }
  else {
    return Math.floor(inches * 2.54) + "cm";
  }
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

function niceNumber(likes:number):string {
  if (likes < 1000) {
    return likes.toString();
  }
  if (likes < 1000000) {
    return `${(Math.floor(likes / 100) / 10).toString()}k`;
  }
  if (likes < 1000000000) {
    return `${(Math.floor(likes / 100000) / 10).toString()}M`;
  }

  return `${(Math.floor(likes / 100000000) / 10).toString()}B`;
}
</script>

<style>
  /* .thumbs-up-filled::before {
    content:url("data:image/svg+xml,");
    width: 2.5rem;
    fill:white;
  } */

  .like-button {
    color:white;
    width: 1.6rem;
    height: 1.6rem;
    padding-bottom: 0.2rem;
  }

  .overall-scalable {
    overflow: hidden;
    -webkit-transition: all 1s;
  }

  .scalable {
    -webkit-transform-origin: top left;
    -webkit-transition: all 1s;
  }

  .heading-text {
    margin: auto;
    font-size: 2.1rem;
    font-weight: bolder;
  }

  .subheading-text {
    font-size: 1.15rem;
    font-weight: lighter;
    letter-spacing: 0rem;
    /* font-family: 'Open Sans', sans-serif; */
  }

  a {
    color: white;
  }

  a.source-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-decoration: underline;
  }

  .comment-icon{
    margin-right: 0.2rem;
  }

  .share-icon {
    font-size: 1rem;
  }

  .share-section {
    cursor: pointer !important;
  }
</style>
