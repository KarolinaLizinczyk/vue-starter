<script setup lang="ts">
import { ref } from 'vue'
import type { CrossrefWorksFacets } from '@/stores/metaData/models'

const props = defineProps<{
  facets: CrossrefWorksFacets
  selectedTypeNames: string[]
  selectedYears: string[]
  disabled?: boolean
}>()
const emit = defineEmits<{
  (event: 'toggle-type', value: string): void
  (event: 'toggle-year', value: string): void
}>()

const FACET_LIMIT = 10
const isTypeExpanded = ref(false)
const isYearExpanded = ref(false)

const toEntries = (values?: Record<string, number>) => {
  if (!values) return []
  return Object.entries(values)
}

const typeFacets = () => toEntries(props.facets['type-name']?.values)

const yearFacets = () =>
  toEntries(props.facets.published?.values).sort((a, b) => Number(b[0]) - Number(a[0]))

const visibleTypeFacets = () =>
  isTypeExpanded.value ? typeFacets() : typeFacets().slice(0, FACET_LIMIT)

const visibleYearFacets = () =>
  isYearExpanded.value ? yearFacets() : yearFacets().slice(0, FACET_LIMIT)

const isTypeSelected = (value: string) => props.selectedTypeNames.includes(value)
const isYearSelected = (value: string) => props.selectedYears.includes(value)
</script>

<template>
  <aside class="facets">
    <fieldset class="facet-group">
      <legend>TYPE</legend>
      <ul id="type-facet-list">
        <li v-for="[label, count] in visibleTypeFacets()" :key="label">
          <label>
            <input
              type="checkbox"
              :checked="isTypeSelected(label)"
              :disabled="disabled"
              @change="emit('toggle-type', label)"
            />
            {{ label }} ({{ count }})
          </label>
        </li>
      </ul>
      <button
        v-if="typeFacets().length > FACET_LIMIT"
        type="button"
        class="toggle"
        :aria-expanded="isTypeExpanded"
        aria-controls="type-facet-list"
        :disabled="disabled"
        @click="isTypeExpanded = !isTypeExpanded"
      >
        {{ isTypeExpanded ? 'Show less' : 'Show more' }}
      </button>
    </fieldset>

    <fieldset class="facet-group">
      <legend>YEAR</legend>
      <ul id="year-facet-list">
        <li v-for="[year, count] in visibleYearFacets()" :key="year">
          <label>
            <input
              type="checkbox"
              :checked="isYearSelected(year)"
              :disabled="disabled"
              @change="emit('toggle-year', year)"
            />
            {{ year }} ({{ count }})
          </label>
        </li>
      </ul>
      <button
        v-if="yearFacets().length > FACET_LIMIT"
        type="button"
        class="toggle"
        :aria-expanded="isYearExpanded"
        aria-controls="year-facet-list"
        :disabled="disabled"
        @click="isYearExpanded = !isYearExpanded"
      >
        {{ isYearExpanded ? 'Show less' : 'Show more' }}
      </button>
    </fieldset>
  </aside>
</template>

<style scoped>
.facets {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.85rem;
  background: #fbfcff;
  align-self: start;
}

.facet-group {
  border: 0;
  margin: 0;
  padding: 0;
}

legend {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  color: #4b5563;
  font-weight: 700;
}

.facet-group + .facet-group {
  margin-top: 1rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}

label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.toggle {
  margin-top: 0.35rem;
  padding: 0;
  border: 0;
  background: none;
  color: #1d4ed8;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>
