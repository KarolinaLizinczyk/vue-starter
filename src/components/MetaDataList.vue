<script setup lang="ts">
import type { CrossrefWorkItem } from '@/stores/metaData/models'

defineProps<{
  items: CrossrefWorkItem[]
  loading: boolean
  error: string
  hasSearched: boolean
}>()

const getPrimaryTitle = (item: CrossrefWorkItem) => item.title?.[0] || 'Untitled'
</script>

<template>
  <section class="results">
    <p class="sr-only" role="status" aria-live="polite">
      <span v-if="loading">Loading results...</span>
      <span v-else-if="error">{{ error }}</span>
      <span v-else-if="hasSearched">Showing {{ items.length }} results.</span>
    </p>

    <p v-if="loading">Loading results...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else-if="hasSearched && items.length === 0">No results.</p>

    <ul v-else class="list">
      <li v-for="item in items" :key="item.DOI" class="list-item">
        <h3>{{ getPrimaryTitle(item) }}</h3>
        <p v-if="item.publisher">{{ item.publisher }}</p>
        <p v-if="item.type" class="muted">Type: {{ item.type }}</p>
        <a :href="`https://doi.org/${item.DOI}`" target="_blank" rel="noreferrer">
          {{ item.DOI }}
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.results {
  margin-top: 0.2rem;
}

.error {
  color: #b00020;
}

.list {
  display: grid;
  gap: 0.65rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.list-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.9rem;
  background: #fff;
}

.list-item h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  line-height: 1.35;
}

.list-item p {
  margin: 0 0 0.2rem;
}

.muted {
  color: #666;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
