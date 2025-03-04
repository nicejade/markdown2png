<template>
  <div id="about" class="my-4 w-full max-w-3xl">
    <div class="markdown" v-html="aboutHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { parse } from 'marked'
import aboutMD from './../markdown/About'

let aboutHtml = parse(aboutMD, {
  breaks: true,
})
</script>

<style lang="scss">
#about {
  .markdown h2 {
    font-size: 1.4rem;
  }
}
</style>