<template>
  <template v-if="lazy">
    <lazy-component>
      <slot />
    </lazy-component>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({
  lazy: {
    type: Boolean,
    default: true,
  },
});
</script>
