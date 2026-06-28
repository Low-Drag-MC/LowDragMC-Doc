<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  code: string;
  encoded?: boolean;
}>();

const host = ref<HTMLElement | null>(null);
const error = ref('');

const source = computed(() => (props.encoded ? decodeURIComponent(props.code) : props.code));

async function renderDiagram() {
  if (!host.value) {
    return;
  }
  try {
    error.value = '';
    const mermaid = (await import('mermaid')).default;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default'
    });
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    const { svg } = await mermaid.render(id, source.value);
    host.value.innerHTML = svg;
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    host.value.textContent = source.value;
  }
}

onMounted(renderDiagram);
watch(source, renderDiagram);
</script>

<template>
  <div class="mermaid-diagram">
    <div ref="host" class="mermaid-diagram__canvas" />
    <p v-if="error" class="mermaid-diagram__error">{{ error }}</p>
  </div>
</template>
