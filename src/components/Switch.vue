<template>
  <label class="switch">
    <input class="checkbox" type="checkbox" v-model="toggle">
    <div class="slider round"></div>
  </label>
</template>

<script lang="ts">
export default {
  data() {
    return {
      toggle: false
    }
  },

  emits: ['check'],

  props: {
    'state': {
      type: Boolean,
      required: true,
      default: false
    }
  },

  created() {
    this.toggle = this.state
  },

  watch: {
    toggle(newVal: boolean, oldVal: boolean) {
      if (newVal !== oldVal) {
        this.$emit('check', newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  width: 68px;
  height: 34px;

  .checkbox {
    display: none;
  }

  .checkbox:checked+.slider {
    background-color: #33c658;
  }

  .checkbox:focus+.slider {
    box-shadow: 0 0 1px #33c658;
  }

  .checkbox:checked+.slider:before {
    -webkit-transform: translateX(34px);
    -ms-transform: translateX(34px);
    transform: translateX(34px);
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;

    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
}
</style>