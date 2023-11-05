type ActionType = {
  type: string;
  payload: number;
};

const INITIAL_STATE = {
  projectData: [],
};

const projectDataReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: 0 }) => {
  switch (action.type) {
    case 'PROJECT_DATA':
      return {
        projectData: action.payload,
      };
    default:
      return state;
  }
};

export default projectDataReducer;
