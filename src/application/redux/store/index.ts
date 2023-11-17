import { legacy_createStore as createStore, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import paginationReducer from '../reducers/paginationReducer';
import projectDataReducer from '../reducers/projectDataReducer';
import charFilterReducer from '../reducers/charFilterReducer';

const rootReducer = combineReducers({
  paginationReducer,
  projectDataReducer,
  charFilterReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
