type ActionType = {
  type: string;
  payload: boolean;
};

const INITIAL_STATE = {
  colapse: false,
};

const manuscriptReducer = (state = INITIAL_STATE, action: ActionType = { type: '', payload: false }) => {
  switch (action.type) {
    case 'MANU_COLAPSE_DETAIL':
      return {
        colapse: action.payload,
      };
    default:
      return state;
  }
};

export default manuscriptReducer;
