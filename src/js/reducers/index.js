'use es6';

import { Map } from 'immutable';
import { xor, isEmpty } from 'lodash';
import RequestStatus from '../data/RequestStatus';
import ActionTypes from '../actions/ActionTypes';

const defaultState = new Map({
  links: new Map(),
  editorOpen: false,
  focusedLink: null,
  pendingChanges: new Map(),
  filterText: '',
  fetchStatus: new RequestStatus(),
  createStatus: new RequestStatus(),
  saveStatus: new RequestStatus(),
  deleteStatus: new RequestStatus(),
});

export default (state = defaultState, action) => {
  console.clog('reducers', state.toObject(), action);
  switch (action.type) {
    case ActionTypes.GO_LINK_EDITOR_CLOSE:
    case ActionTypes.GO_LINK_DISCARD_CHANGES:
      return state.set('editorOpen', false).set('pendingChanges', new Map());

    case ActionTypes.GO_LINK_SEARCH_UPDATED:
      return state.set('filterText', action.payload);

    case ActionTypes.GO_LINK_EDIT_SELECTED:
      return state.set('focusedLink', action.payload).set('editorOpen', true);

    case ActionTypes.GO_LINK_UPDATE_VALUE: {
      const pendingChanges = state
        .get('pendingChanges')
        .merge(new Map(action.payload))
        .filter((value, key) => {
          const current = state
            .get('links')
            .get(state.get('focusedLink'))
            .get(key);
          if (value.constructor === Array) {
            return !isEmpty(xor(value, current));
          } else {
            return value !== current;
          }
        });
      return state.set('pendingChanges', pendingChanges);
    }

    case ActionTypes.GO_LINK_FETCH_STARTED:
      return state.set('fetchStatus', new RequestStatus({ pending: true }));

    case ActionTypes.GO_LINK_SYNC_COMPLETED:
      window.chrome.runtime.sendMessage('update-go-link-cache');
      return state.set('fetchStatus', new RequestStatus({ succeeded: true }));

    case ActionTypes.GO_LINK_FETCH_COMPLETED:
      return state
        .set('fetchStatus', new RequestStatus({ succeeded: true }))
        .set(
          'links',
          new Map(action.payload.map(link => [link.get('id'), link])),
        );

    case ActionTypes.GO_LINK_CREATE_STARTED: {
      const newLink = new Map(action.payload);
      return state
        .set('createStatus', new RequestStatus({ pending: true }))
        .update('links', links => links.set(newLink.get('id'), newLink));
    }

    case ActionTypes.GO_LINK_DELETE_STARTED:
      return state
        .set('deleteStatus', new RequestStatus({ pending: true }))
        .update('links', links => links.delete(action.payload));

    case ActionTypes.GO_LINK_SAVE_STARTED: {
      const updatedLink = new Map(action.payload);
      return state
        .set('saveStatus', new RequestStatus({ pending: true }))
        .update('links', links =>
          links.set(updatedLink.get('id'), updatedLink),
        );
    }

    case ActionTypes.GO_LINK_EDITOR_OPEN:
      return state.set('editorOpen', true);

    default:
      return state;
  }
};
