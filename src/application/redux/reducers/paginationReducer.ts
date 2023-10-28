type ActionType = {
  type: string;
};

const INITIAL_STATE = {
  currentPage: 1,
  totalPages: 1,
};

const paginationReducer = (state = INITIAL_STATE, action: ActionType = { type: '' }) => {
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
    default:
      return state;
  }
};

export default paginationReducer;
