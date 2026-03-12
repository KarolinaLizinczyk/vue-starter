import type { createMetaDataState } from './state'
import type { CrossrefWorksResponse, MetaDataFilters } from './models'

const WORK_ITEM_SELECT_FIELDS = ['DOI', 'URL', 'title', 'publisher', 'type'].join(',')
const FACET_FIELDS = 'type-name:*,published:*'
const RESULTS_ROWS = '20'

const appendFilters = (params: URLSearchParams, filters?: MetaDataFilters) => {
  if (!filters) return

  const filterValues: string[] = []

  for (const typeName of filters.typeNames ?? []) {
    filterValues.push(`type-name:${typeName}`)
  }

  for (const year of filters.years ?? []) {
    filterValues.push(`from-pub-date:${year}-01-01`)
    filterValues.push(`until-pub-date:${year}-12-31`)
  }

  if (filterValues.length > 0) {
    params.set('filter', filterValues.join(','))
  }
}

export const createMetaDataActions = (state: ReturnType<typeof createMetaDataState>) => {
  const fetchMetaData = async (query = '', filters?: MetaDataFilters) => {
    state.error.value = ''

    try {
      const params = new URLSearchParams()
      params.set('rows', RESULTS_ROWS)
      params.set('select', WORK_ITEM_SELECT_FIELDS)
      if (query.trim()) {
        params.set('query', query.trim())
      }
      appendFilters(params, filters)

      const url = `https://api.crossref.org/works${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as Partial<CrossrefWorksResponse>
      state.metaData.value = Array.isArray(data?.message?.items) ? data.message.items : []
      return state.metaData.value
    } catch (error) {
      state.error.value = 'Nie udało się pobrać metadanych.'
      throw error
    }
  }

  const fetchFacets = async (query = '', filters?: MetaDataFilters) => {
    try {
      const params = new URLSearchParams()
      params.set('rows', '0')
      params.set('facet', FACET_FIELDS)
      if (query.trim()) {
        params.set('query', query.trim())
      }
      appendFilters(params, filters)

      const response = await fetch(`https://api.crossref.org/works?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as Partial<CrossrefWorksResponse>
      state.facets.value = data?.message?.facets ?? {}
      return state.facets.value
    } catch (error) {
      // Facets are supplemental for UX; keep current list results visible on facet failure.
      throw error
    }
  }

  return {
    fetchMetaData,
    fetchFacets,
  }
}
