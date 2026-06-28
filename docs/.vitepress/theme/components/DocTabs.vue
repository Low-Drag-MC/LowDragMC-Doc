<script setup lang="ts">
import { provide, ref } from 'vue';

const tabs = ref<string[]>([]);
const active = ref('');

function register(title: string) {
  if (!tabs.value.includes(title)) {
    tabs.value.push(title);
  }
  if (!active.value) {
    active.value = title;
  }
}

provide('doc-tabs', { tabs, active, register });
</script>

<template>
  <div class="doc-tabs">
    <div class="doc-tabs__panes">
      <slot />
    </div>
    <div class="doc-tabs__nav" role="tablist">
      <button
        v-for="title in tabs"
        :key="title"
        class="doc-tabs__button"
        :class="{ 'is-active': active === title }"
        type="button"
        role="tab"
        :aria-selected="active === title"
        @click="active = title"
      >
        {{ title }}
      </button>
    </div>
  </div>
</template>
