const matches = (state = { matches: {}}, action) => {
    switch (action.type) {
      case 'SET_MATCHES':
        return {
          ...state,
          matches: action.matches
        };
      default:
        return state
    }
  }
  
  export default matches;
