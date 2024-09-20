import * as actionTypes from './actionTypes'

export const getoptionsSelected = (option) => {
  return {
    type: actionTypes.GET_OPTIONS_FILTER,
    payload: option
}}
export const addFilter = (filterList, label, keywords) => ({
    type: actionTypes.ADD_FILTER,
    payload: {label, keywords, loading: false, filterList: filterList},
})

export const addFilterDateResults = (label, keyword) => {
  return {
  type: actionTypes.ADD_FILTER_DATE,
  payload: {label, keyword},
}}

export const removeFilter = (updateOptionsSelected, updatedResultsFilter) => {
  return {
    type: actionTypes.REMOVE_FILTER,
    payload: {updateOptionsSelected, updatedResultsFilter},
  }
}
export const clearFilters = (clearedOptionsSelected, clearedConferencesFilter) => {
  return {
    type: actionTypes.CLEAR_FILTERS,
    payload: {clearedOptionsSelected, clearedConferencesFilter}
  }
}

export const getResult = (label, results) => {
  return {
    type: actionTypes.GET_RESULT_AFTER_FILTER,
    payload: {label, results}
  }
}

export const selectOptionFilterKeyword = (options) => {
  return {
    type: actionTypes.SELECT_OPTION_FILTER,
    payload: options
  }
}

export const inputOptionFilterKeyword = (result) => {
  return {
    type: actionTypes.INPUT_OPTION_FILTER,
    payload: result
  }
}