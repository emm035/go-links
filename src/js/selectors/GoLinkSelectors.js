'use es6';

import { createSelector } from 'reselect';

import { getSearchText } from './SearchSelectors';
import { defaultValues } from '../data/GoLinkConstants';

export const getFocusedLinkId = state => state.get('focusedLink');

export const getPendingChanges = state => state.get('pendingChanges');

export const getFuzzySearch = state => state.get('fuzzySearch');

export const getLinks = state => Array.from(state.get('links').values());

export const getLinkMap = state => state.get('links');

export const getPendingChangesExist = createSelector(
  [getPendingChanges],
  pendingChanges => pendingChanges.size !== 0,
);

export const getFocusedLink = createSelector(
  [getLinkMap, getFocusedLinkId],
  (links, focusedLinkId) => links.get(focusedLinkId) || defaultValues,
);

export const getLinkWithEdits = createSelector(
  [getFocusedLink, getPendingChanges],
  (focusedLink, pendingChanges) =>
    defaultValues.merge(focusedLink).merge(pendingChanges),
);

export const getFilteredLinks = createSelector(
  [getSearchText, getLinks],
  (searchText, links) => {
    return links.filter(link =>
      link
        .get('aliases')
        .reduce((acc, val) => acc || val.startsWith(searchText), false),
    );
  },
);
