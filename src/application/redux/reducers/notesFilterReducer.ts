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

const notesFilterReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: 0 }) => {
  switch (action.type) {
    case 'NOTES_FILTER_TITLE':
      return {
        ...state,
        selectedTitle: action.payload,
      };
    case 'NOTES_FILTER_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case 'NOTES_FILTER_SORT':
      return {
        ...state,
        isOrder: action.payload,
      };
    case 'NOTES_FILTER_SORT_DIRECTION':
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

export default notesFilterReducer;
