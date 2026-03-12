import { ref } from 'vue'
import type { CrossrefWorksFacets, CrossrefWorkItem } from './models'

export function createMetaDataState() {
  return {
    metaData: ref<CrossrefWorkItem[]>([]),
    facets: ref<CrossrefWorksFacets>({}),
    error: ref(''),
  }
}
