export interface CrossrefWorkItem {
  DOI: string
  URL?: string
  title?: string[]
  publisher?: string
  type?: string
}

export interface MetaDataFilters {
  typeNames?: string[]
  years?: string[]
}

export interface CrossrefFacet {
  'value-count'?: number
  values?: Record<string, number>
}

export interface CrossrefWorksFacets {
  'type-name'?: CrossrefFacet
  published?: CrossrefFacet
}

export interface CrossrefWorksMessage {
  items?: CrossrefWorkItem[]
  facets?: CrossrefWorksFacets
}

export interface CrossrefWorksResponse {
  status?: string
  'message-type'?: string
  'message-version'?: string
  message?: CrossrefWorksMessage
}
