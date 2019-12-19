/*
 * Copyright (C) 2007-2019 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { createReducer } from '@reduxjs/toolkit';
import GlobalState from '../../models/GlobalState';
import {
  CHANGE_CURRENT_URL,
  CLEAR_SELECT_FOR_EDIT,
  CLOSE_TOOLS,
  FETCH_CONTENT_MODEL_COMPLETE,
  FETCH_CONTENT_TYPES_COMPLETE,
  GUEST_CHECK_IN,
  GUEST_CHECK_OUT,
  GUEST_MODELS_RECEIVED,
  OPEN_TOOLS,
  SELECT_FOR_EDIT,
  SELECT_PREVIOUS_TOOL,
  SELECT_TOOL,
  SET_HOST_HEIGHT,
  SET_HOST_SIZE,
  SET_HOST_WIDTH,
  SET_ITEM_BEING_DRAGGED,
  TOOLS_LOADED
} from '../actions/preview';
import { nou } from '../../utils/object';
import { CHANGE_SITE } from '../actions/sites';

const reducer = createReducer<GlobalState['preview']>({
  currentUrl: '/studio/preview-landing',
  hostSize: { width: null, height: null },
  showToolsPanel: true,
  previousTool: null,
  selectedTool: 'craftercms.ice.components',
  tools: null,
  contentTypes: null,
  guest: null
}, {
  [SELECT_TOOL]: (state, { payload }) => ({
    ...state,
    previousTool: state.selectedTool,
    selectedTool: payload
  }),
  [SELECT_PREVIOUS_TOOL]: (state, { payload }) => {
    return {
      ...state,
      previousTool: state.selectedTool,
      selectedTool: payload
    };
  },
  [OPEN_TOOLS]: (state, { payload }) => {
    return {
      ...state,
      showToolsPanel: true
    }
  },
  [CLOSE_TOOLS]: (state, { payload }) => {
    return {
      ...state,
      showToolsPanel: false
    }
  },
  [TOOLS_LOADED]: (state, { payload }) => {
    return {
      ...state,
      tools: payload
    }
  },
  [SET_HOST_SIZE]: (state, { payload }) => {
    if (isNaN(payload.width)) {
      payload.width = state.hostSize.width;
    }
    if (isNaN(payload.height)) {
      payload.height = state.hostSize.height;
    }
    return {
      ...state,
      hostSize: {
        ...state.hostSize,
        width: minFrameSize(payload.width),
        height: minFrameSize(payload.height)
      }
    }
  },
  [SET_HOST_WIDTH]: (state, { payload }) => {
    if (isNaN(payload)) {
      return state;
    }
    return {
      ...state,
      hostSize: {
        ...state.hostSize,
        width: minFrameSize(payload)
      }
    }
  },
  [SET_HOST_HEIGHT]: (state, { payload }) => {
    if (isNaN(payload)) {
      return state;
    }
    return {
      ...state,
      hostSize: {
        ...state.hostSize,
        height: minFrameSize(payload)
      }
    }
  },
  [FETCH_CONTENT_TYPES_COMPLETE]: (state, { payload }) => {
    return {
      ...state,
      contentTypes: payload
    }
  },
  [FETCH_CONTENT_MODEL_COMPLETE]: (state, { payload }) => {
    return {
      ...state,
      currentModels: payload
    }
  },
  [GUEST_CHECK_IN]: (state, { payload }) => {
    return {
      ...state,
      // Setting URL causes dual reload when guest navigation occurs
      // currentUrl: (payload.url && payload.origin ? payload.url.replace(payload.origin, '') : null) ?? state.currentUrl,
      guest: { ...(state.guest ? state.guest : {}), ...payload, itemBeingDragged: false, selected: null }
    }
  },
  [GUEST_CHECK_OUT]: (state, { payload }) => {
    let nextState = state;
    if (state.guest) {
      nextState = { ...nextState, guest: null };
    }
    if (state.contentTypes) {
      nextState = { ...nextState, contentTypes: null };
    }
    return nextState;
  },
  [GUEST_MODELS_RECEIVED]: (state, { payload }) => {
    // If guest hasn't checked in, these models will come later when it does check in.
    if (state.guest != null) {
      return {
        ...state,
        guest: {
          ...state.guest,
          models: {
            ...state.guest.models,
            ...payload
          }
        }
      };
    } else {
      // TODO: Currently getting models before check in some cases when coming from a different site.
      return {
        ...state,
        guest: {
          ...state.guest,
          models: {
            ...payload
          }
        }
      };
    }
  },
  [SELECT_FOR_EDIT]: (state, { payload }) => {
    if (state.guest === null) {
      return state;
    }
    return {
      ...state,
      guest: {
        ...state.guest,
        selected: [payload]
      }
    }
  },
  [CLEAR_SELECT_FOR_EDIT]: (state, { payload }) => {
    if (state.guest === null) {
      return state;
    }
    return {
      ...state,
      guest: {
        ...state.guest,
        selected: null
      }
    };
  },
  [SET_ITEM_BEING_DRAGGED]: (state, { payload }) => {
    if (nou(state.guest)) {
      return state;
    }
    return {
      ...state,
      guest: {
        ...state.guest,
        itemBeingDragged: payload
      }
    }
  },
  [CHANGE_CURRENT_URL]: (state, { payload }) => (
    (state.currentUrl === payload)
      ? state
      : {
        ...state,
        currentUrl: payload
      }
  ),
  [CHANGE_SITE]: (state, { payload }) => {
    let nextState = state;
    // TODO: If there's a guest it would have checked out?
    // if (state.guest) {
    //   nextState = { ...nextState, guest: null };
    // }
    if (state.contentTypes) {
      nextState = { ...nextState, contentTypes: null };
    }
    if (payload.nextUrl !== nextState.currentUrl) {
      nextState = { ...nextState, currentUrl: payload.nextUrl };
    }
    return nextState;
  }
});

function minFrameSize(suggestedSize: number): number {
  return suggestedSize === null ? null : suggestedSize < 320 ? 320 : suggestedSize;
}

export default reducer;