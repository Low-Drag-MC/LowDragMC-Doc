<script setup lang="ts">
import DocIcon from './DocIcon.vue';

const props = withDefaults(
  defineProps<{
    version: string;
    label?: string;
    icon?: string;
    href?: string;
    tooltip?: string;
  }>(),
  {
    label: 'Added',
    icon: 'tag-outline',
    tooltip: 'Minimum version'
  }
);

const iconName = props.icon.startsWith('material-') ? props.icon : `material-${props.icon}`;
</script>

<template>
  <span class="version-badge" :title="tooltip">
    <DocIcon :name="iconName" />
    <a v-if="href" class="version-badge__text" :href="href">{{ label }} {{ version }}</a>
    <span v-else class="version-badge__text">{{ label }} {{ version }}</span>
  </span>
</template>
