import { legacy_createStore as createStore, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import paginationReducer from '../reducers/paginationReducer';
import projectDataReducer from '../reducers/projectDataReducer';
import charFilterReducer from '../reducers/charFilterReducer';
import worldFilterReducer from '../reducers/worldFilterReducer';

const rootReducer = combineReducers({
  paginationReducer,
  projectDataReducer,
  charFilterReducer,
  worldFilterReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
