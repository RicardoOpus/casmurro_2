type ActionType = {
  type: string;
  payload: number;
};

const INITIAL_STATE = {
  currentPage: 1,
  totalPages: 1,
};

const paginationReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: 0 }) => {
  switch (action.type) {
    case 'NEXT_PAGE':
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case 'PREVIOUS_PAGE':
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };
    case 'TOTAL_PAGES':
      return {
        ...state,
        totalPages: action.payload,
      };
    case 'CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

export default paginationReducer;
