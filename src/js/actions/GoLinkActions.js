'use es6';

import uuid from 'uuid/v4';
import { Map } from 'immutable';
import { getLinks } from '../selectors/GoLinkSelectors';
import { defaultValues } from '../data/GoLinkConstants';

import ActionTypes from './ActionTypes';
import { closeEditor } from './EditorActions';
import { updateSearchText } from './SearchActions';

/*
 * EDITING
 */

export const selectGoLink = id => ({
  type: ActionTypes.GO_LINK_EDIT_SELECTED,
  payload: id,
});

/*
 * FETCHING
 */

export const goLinksFetchStarted = () => ({
  type: ActionTypes.GO_LINK_FETCH_STARTED,
});

export const goLinksFetchCompleted = err => ({
  type: ActionTypes.GO_LINK_FETCH_COMPLETED,
  payload: err,
});

export const fetchGoLinks = () => {
  return dispatch => {
    dispatch(goLinksFetchStarted());
    window.chrome.storage.sync.get(['goLinks'], ({ goLinks }) => {
      dispatch(
        goLinksFetchCompleted(
          goLinks.map(link => new Map({ id: uuid() }).merge(new Map(link))),
        ),
      );
    });
  };
};

/*
 * COMMITTING
 */

export const syncStarted = () => ({
  type: ActionTypes.GO_LINK_SYNC_STARTED,
});

export const syncCompleted = () => ({
  type: ActionTypes.GO_LINK_SYNC_COMPLETED,
});

export const syncAction = ({ before, after }) => (dispatch, getState) => {
  before && before(dispatch);
  dispatch(syncStarted());
  window.chrome.storage.sync.set(
    { goLinks: getLinks(getState()).map(link => link.toJS()) },
    () => {
      dispatch(syncCompleted());
      after && after(dispatch);
    },
  );
};

/*
 * SAVING
 */

export const goLinksSaveStarted = link => ({
  type: ActionTypes.GO_LINK_SAVE_STARTED,
  payload: link,
});

export const goLinksSaveCompleted = () => ({
  type: ActionTypes.GO_LINK_SAVE_COMPLETED,
});

export const saveGoLink = link =>
  syncAction({
    before: dispatch => {
      dispatch(goLinksSaveStarted(link));
    },
    after: dispatch => {
      dispatch(goLinksSaveCompleted());
      dispatch(updateSearchText(''));
      dispatch(closeEditor());
    },
  });

/*
 * CREATING
 */

export const goLinksCreateStarted = link => ({
  type: ActionTypes.GO_LINK_CREATE_STARTED,
  payload: link,
});

export const goLinksCreateCompleted = () => ({
  type: ActionTypes.GO_LINK_CREATE_COMPLETED,
});

export const createGoLink = alias => {
  const link = defaultValues.merge(
    new Map({
      aliases: [alias],
      id: uuid(),
    }),
  );
  return syncAction({
    before: dispatch => {
      dispatch(goLinksCreateStarted(link));
    },
    after: dispatch => {
      dispatch(goLinksCreateCompleted());
      dispatch(selectGoLink(link.get('id')));
      dispatch(updateSearchText(''));
    },
  });
};

/*
 * DELETING
 */

export const goLinksDeleteStarted = id => ({
  type: ActionTypes.GO_LINK_DELETE_STARTED,
  payload: id,
});

export const goLinksDeleteCompleted = () => ({
  type: ActionTypes.GO_LINK_DELETE_COMPLETED,
});

export const deleteGoLink = id =>
  syncAction({
    before: dispatch => {
      dispatch(goLinksDeleteStarted(id));
    },
    after: dispatch => {
      dispatch(goLinksDeleteCompleted());
      dispatch(updateSearchText(''));
      dispatch(closeEditor());
    },
  });

/*
 * UPDATING
 */

export const updateGoLinkProperty = propertyUpdate => ({
  type: ActionTypes.GO_LINK_UPDATE_VALUE,
  payload: propertyUpdate,
});
