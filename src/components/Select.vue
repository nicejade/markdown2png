<template>
  <div class="select-wrapper">
    <div class="select-value" @click="onFocusToggle">{{ options[activeIndex].name }}</div>
    <span :class="`expand-icon ${show ? 'expand' : ''}`">></span>
    <div class="select-options" v-show="show">
      <div v-for="(item, index) in options" :key="item.code" @click="onChange(index, item)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      activeIndex: 0,
      show: false,
    }
  },

  emits: ['change'],

  props: {
    'active': {
      type: Number,
      required: false,
      default: 0
    },
    'options': {
      type: Array,
      required: true,
      default: [
        { name: '深空灰', code: '1' },
        { name: '气质银', code: '2' },
      ]
    }
  },

  created() {
    this.activeIndex = this.active
  },

  methods: {
    onChange(ind: number, item: any) {
      this.show = false
      this.activeIndex = ind
      this.$emit('change', ind)
    },

    onFocusToggle() {
      this.show = !this.show
    }
  },
}
</script>

<style lang="scss" scoped>
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 68px;
  height: 34px;

  .expand-icon {
    transform: rotate(-90deg);
    transition: all .3s;

    &.expand {
      transform: rotate(90deg);
    }
  }

  .select-value {
    flex: 1;
    cursor: pointer;
  }

  .select-options {
    position: absolute;
    left: 0;
    top: 100%;
    cursor: pointer;
  }
}
</style>