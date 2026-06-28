<script setup lang="ts">
import { computed, inject } from 'vue';

const props = defineProps<{
  title: string;
}>();

type TabsContext = {
  active: { value: string };
  register: (title: string) => void;
};

const tabs = inject<TabsContext>('doc-tabs');
tabs?.register(props.title);

const isActive = computed(() => tabs?.active.value === props.title);
</script>

<template>
  <section v-show="isActive" class="doc-tab" role="tabpanel">
    <slot />
  </section>
</template>
