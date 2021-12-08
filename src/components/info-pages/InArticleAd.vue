<template>
    <ins class="adsbygoogle"
        :style='{display:"inline-block", width:"100%", height: "100%"}'
        data-ad-layout="in-article"
        data-ad-format="fluid"
        :data-adtest="isLocal ? 'on' : 'off'"
        :data-ad-client="isLocal ? 'ca-pub-0000000000000000' : 'ca-pub-9519293437477621'"
        :data-ad-slot="isLocal ? '0000000000' : '8807548487'">
        </ins>
    <component :is="'script'">
        (adsbygoogle = window.adsbygoogle || []).push({});
    </component>
</template>

<script setup lang="ts">
import { Constants, Environment } from '@/constants';

const isLocal = Constants.ENV === Environment.LOCAL;
</script>
