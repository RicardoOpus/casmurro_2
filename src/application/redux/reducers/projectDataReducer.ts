type ActionType = {
  type: string;
  payload: number;
};

const INITIAL_STATE = {
  projectData: [],
  hasChange: true,
};

const projectDataReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: 0 }) => {
  switch (action.type) {
    case 'PROJECT_DATA':
      return {
        hasChange: true,
        projectData: action.payload,
      };
    case 'FECTCH_PROJECT_DATA':
      return {
        ...state,
        hasChange: action.payload,
      };
    default:
      return state;
  }
};

export default projectDataReducer;
