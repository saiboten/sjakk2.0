const users = (state = { users: {}}, action) => {
    switch (action.type) {
      case 'SET_USERS':
        return {
          ...state,
          users: action.users
        };
        case 'SET_USER':
        return {
          ...state,
          user: action.user
        };
      default:
        return state
    }
  }
  
  export default users