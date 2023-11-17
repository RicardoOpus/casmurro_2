type ActionType = {
  type: string;
  payload: number;
};

const INITIAL_STATE = {
  selectedTitle: '',
  selectedCategory: '',
  selectedGender: '',
};

const charFilterReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: 0 }) => {
  switch (action.type) {
    case 'CHAR_FILTER_TITLE':
      return {
        ...state,
        selectedTitle: action.payload,
      };
    case 'CHAR_FILTER_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case 'CHAR_FILTER_GENDER':
      return {
        ...state,
        selectedGender: action.payload,
      };
    default:
      return state;
  }
};

export default charFilterReducer;
