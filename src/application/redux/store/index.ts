import { legacy_createStore as createStore, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import paginationReducer from '../reducers/paginationReducer';

const rootReducer = combineReducers({
  paginationReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
