import { defineStore } from 'pinia'
import { createMetaDataState } from './state'
import { createMetaDataActions } from './actions'

export const useMetaDataStore = defineStore('metaData', () => {
  const state = createMetaDataState()
  const actions = createMetaDataActions(state)

  return {
    ...state,
    ...actions,
  }
})
