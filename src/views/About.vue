<template>
  <div id="about" class="w-full max-w-xl my-4">
    <div class="markdown" v-html="aboutHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { parse } from 'marked'
import aboutMD from './../markdown/About'

console.log(aboutMD)

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