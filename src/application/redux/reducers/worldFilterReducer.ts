type ActionType = {
  type: string;
  payload: number;
};

const INITIAL_STATE = {
  selectedTitle: '',
  selectedCategory: '',
  isOrder: false,
  isAscOrder: false,
};

const charFilterReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: 0 }) => {
  switch (action.type) {
    case 'WORLD_FILTER_TITLE':
      return {
        ...state,
        selectedTitle: action.payload,
      };
    case 'WORLD_FILTER_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case 'WORLD_FILTER_SORT':
      return {
        ...state,
        isOrder: action.payload,
      };
    case 'WORLD_FILTER_SORT_DIRECTION':
      return {
        ...state,
        isAscOrder: action.payload,
      };
    case 'CLEAR_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default charFilterReducer;
