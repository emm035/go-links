import ActionTypes from './ActionTypes';

export const updateSearchText = newText => ({
  type: ActionTypes.GO_LINK_SEARCH_UPDATED,
  payload: newText,
});
