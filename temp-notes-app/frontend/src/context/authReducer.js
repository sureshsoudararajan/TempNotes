const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'SIGNUP_SUCCESS':
    case 'LOGIN_SUCCESS':
      sessionStorage.setItem('token', action.payload.token || state.token); // Use existing token if not provided
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        message: action.payload.message ? { text: action.payload.message, action: action.payload.action, actionText: action.payload.actionText } : null, // Message is an object
        messageType: action.payload.messageType || 'success'
      };
    case 'SIGNUP_FAIL':
    case 'LOGIN_FAIL':
    case 'AUTH_ERROR':
      sessionStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        message: action.payload?.message ? { text: action.payload.message } : null, // Message is an object
        messageType: action.payload.messageType || 'error'
      };
    case 'LOGOUT':
      sessionStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        message: { text: 'Logged out successfully.' },
        messageType: 'info'
      };
    case 'CLEAR_MESSAGE':
      return {
        ...state,
        message: null,
        messageType: null
      };
    default:
      return state;
  }
};

export default authReducer;