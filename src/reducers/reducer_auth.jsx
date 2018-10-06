import {
    REGISTER_USER,
    REGISTER_USER_FAILURE,
    REGISTER_USER_SUCCESS,
    VERIFY_USER,
    VERIFY_USER_FAILURE,
    VERIFY_USER_SUCCESS
  } from './../actions/auth';
  
  const initialState = {
    userDetails: [],
    userError: null,
    userLoading: false,
    verify: false,
    verifyDetails:[],
    verifyError: null,
    verifyLoading: false
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
    case REGISTER_USER:// start fetching posts and set loading = true
      return { ...state,  userError: null, userLoading: true }; 
    case REGISTER_USER_SUCCESS:// return list of posts and make loading = false
      return { ...state, userDetails: action.payload.user, userError:null, userLoading: false, verify: true };
    case REGISTER_USER_FAILURE:// return error and make loading = false
      //error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
      return { ...state, userDetails: [], userError: action.payload.error, userLoading: false};  
    
    case VERIFY_USER:// start fetching posts and set loading = true
      return { ...state,  verifyError: null, verifyLoading: true }; 
    case VERIFY_USER_SUCCESS:// return list of posts and make loading = false
      return { ...state, verifyDetails: action.payload.user, verifyError:null, verifyLoading: false};
    case VERIFY_USER_FAILURE:// return error and make loading = false
      //error = action.payload || {message: action.payload.message};//2nd one is network or server down errors
      return { ...state, verifyDetails: [], verifyError: action.payload.error, verifyLoading: false};  
    
    default:
      return state;
    }
  };
  
  export default reducer;