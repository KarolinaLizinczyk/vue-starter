<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMetaDataStore } from '@/stores/metaData'
import AppCard from '@/components/AppCard.vue'
import MetaDataFacets from '@/components/MetaDataFacets.vue'
import MetaDataList from '@/components/MetaDataList.vue'

const metaDataStore = useMetaDataStore()
const { metaData, facets, error } = storeToRefs(metaDataStore)

const query = ref('')
const isLoading = ref(false)
const isSearchSubmitting = ref(false)
const hasSearched = ref(false)
const selectedTypeNames = ref<string[]>([])
const selectedYears = ref<string[]>([])

const hasActiveFilters = computed(
  () => selectedTypeNames.value.length > 0 || selectedYears.value.length > 0,
)

const getFilters = () => ({
  typeNames: selectedTypeNames.value,
  years: selectedYears.value,
})

const fetchResults = async (queryValue: string) => {
  try {
    isLoading.value = true
    await metaDataStore.fetchMetaData(queryValue, getFilters())
  } finally {
    isLoading.value = false
  }
}

const submitSearch = async () => {
  const queryValue = query.value.trim()
  if (!queryValue) return

  hasSearched.value = true
  isSearchSubmitting.value = true

  try {
    await Promise.allSettled([
      fetchResults(queryValue),
      metaDataStore.fetchFacets(queryValue),
    ])
  } finally {
    isSearchSubmitting.value = false
  }
}

const toggleValue = (values: Ref<string[]>, value: string) => {
  values.value = values.value.includes(value)
    ? values.value.filter((item) => item !== value)
    : [...values.value, value]
}

const updateFilters = async (values: Ref<string[]>, value: string) => {
  toggleValue(values, value)
  if (!hasSearched.value) return
  await fetchResults(query.value.trim())
}

const onTypeToggle = async (value: string) => {
  await updateFilters(selectedTypeNames, value)
}

const onYearToggle = async (value: string) => {
  await updateFilters(selectedYears, value)
}

const clearFilters = async () => {
  selectedTypeNames.value = []
  selectedYears.value = []
  if (!hasSearched.value) return
  await fetchResults(query.value.trim())
}
</script>

<template>
  <section class="search-page">
    <AppCard>
      <form class="search-form" @submit.prevent="submitSearch">
        <label class="search-label" for="fsearch">Search metadata</label>
        <div class="search-controls">
          <input
            id="fsearch"
            v-model.trim="query"
            type="text"
            placeholder="Title, author, DOI, etc"
            autocomplete="off"
          />
          <button type="submit" class="btn btn-primary" :disabled="isLoading">Search</button>
        </div>
      </form>

      <div class="content">
        <aside v-if="hasSearched && !isSearchSubmitting" class="filters-panel">
          <button
            type="button"
            class="btn btn-ghost btn-sm clear-filters-btn"
            :disabled="isLoading || !hasActiveFilters"
            @click="clearFilters"
          >
            Clear filters
          </button>
          <MetaDataFacets
            :facets="facets"
            :selected-type-names="selectedTypeNames"
            :selected-years="selectedYears"
            :disabled="isLoading"
            @toggle-type="onTypeToggle"
            @toggle-year="onYearToggle"
          />
        </aside>

        <section
          class="results-region"
          :class="{ 'results-region--full': !hasSearched }"
          aria-label="Search results"
          :aria-busy="isLoading"
        >
          <h2 v-if="hasSearched && !isLoading && !error">Showing {{ metaData.length }} results</h2>
          <MetaDataList :items="metaData" :loading="isLoading" :error="error" :has-searched="hasSearched" />
        </section>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.search-page {
  padding: 1.5rem 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.search-form {
  margin-bottom: 1.25rem;
}

.search-label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.search-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

.search-controls input {
  width: 100%;
  min-width: 0;
}

.btn {
  white-space: nowrap;
  padding: 0.5rem 0.9rem;
  border: 1px solid #c9cfdd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.btn-primary {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

.btn-ghost {
  background: #fff;
  color: inherit;
}

.btn-sm {
  padding: 0.4rem 0.75rem;
}

.content {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 1rem;
}

.filters-panel {
  display: grid;
  gap: 0.5rem;
  align-self: start;
}

.clear-filters-btn {
  justify-self: start;
}

.results-region--full {
  grid-column: 1 / -1;
}

h2 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

@media (max-width: 900px) {
  .search-controls {
    grid-template-columns: 1fr;
  }

  .content {
    grid-template-columns: 1fr;
  }
}
</style>
