import UserTypes from './user.types'

const INITIAL_STATE = {
  currentUser: null,
  errorMessage: null,
  registerUser: null,
  isLoading: false,
  getList: {
    userList: [],
    numberOfUsers: 0,
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  getInfo: {
    user: {},
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  updateInfo: {
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  createUser: {
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  deleteUser: {
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  activeEmail: {
    isSuccess: null,
    isLoading: null,
    message: null,
  },
  // reducer for send email reset password + check token in email + reset password
  resetPassword: {
    isSuccess: null,
    isLoading: null,
    message: null,
    isTokenTrue: null,
    userId: null,
  },
  changePassword: {
    isSuccess: null,
    isLoading: false,
    message: null,
  },
  updateAvatar: {
    isSuccess: null,
    isLoading: null,
    message: null,
  },
}

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserTypes.CLEAR_USER_STATE:
      return {
        ...INITIAL_STATE,
      }
    // LOGIN
    case UserTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
      }
    case UserTypes.LOGIN_SUCCESS:
      return {
        ...state,
        errorMessage: null,
        currentUser: action.payload,
        isLoading: false,
      }
    case UserTypes.LOGIN_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        currentUser: null,
        isLoading: false,
      }
    // REGISTER
    case UserTypes.REGISTER_START:
      return {
        ...state,
        isLoading: true,
      }
    case UserTypes.REGISTER_SUCCESS:
      return {
        ...state,
        errorMessage: null,
        registerUser: action.payload,
        isLoading: false,
      }
    case UserTypes.REGISTER_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        registerUser: null,
        isLoading: false,
      }
    // GET USER LIST
    case UserTypes.GET_USER_LIST:
      return {
        ...state,
        getList: {
          ...state.getList,
          isLoading: true,
        },
      }
    case UserTypes.GET_USER_LIST_SUCCESS:
      return {
        ...state,
        getList: {
          isLoading: false,
          isSuccess: true,
          userList: action.payload.userList,
          // numberOfUsers: action.payload.numberOfUsers,
        },
      }
    case UserTypes.GET_USER_LIST_FAILURE:
      return {
        ...state,
        getList: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // GET INFO
    case UserTypes.GET_USER_INFO:
      return {
        ...state,
        getInfo: {
          ...state.getInfo,
          isLoading: true,
        },
      }
    case UserTypes.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        getInfo: {
          user: action.payload,
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.GET_USER_INFO_FAILURE:
      return {
        ...state,
        getInfo: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // UPDATE INFO
    case UserTypes.UPDATE_USER_INFO:
      return {
        ...state,
        updateInfo: {
          ...state.updateInfo,
          isLoading: true,
        },
      }
    case UserTypes.UPDATE_USER_INFO_SUCCESS:
      return {
        ...state,
        updateInfo: {
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.UPDATE_USER_INFO_FAILURE:
      return {
        ...state,
        updateInfo: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // CREATE USER
    case UserTypes.CREATE_USER:
      return {
        ...state,
        createUser: {
          ...state.createUser,
          isLoading: true,
        },
      }
    case UserTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        createUser: {
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.CREATE_USER_FAILURE:
      return {
        ...state,
        createUser: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // DELETE USER
    case UserTypes.DELETE_USER:
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser,
          isLoading: true,
        },
      }
    case UserTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
        deleteUser: {
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.DELETE_USER_FAILURE:
      return {
        ...state,
        deleteUser: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // ACTIVE EMAIL
    case UserTypes.ACTIVE_EMAIL:
      return {
        ...state,
        activeEmail: {
          ...state.activeEmail,
          isLoading: true,
        },
      }
    case UserTypes.ACTIVE_EMAIL_SUCCESS:
      return {
        ...state,
        activeEmail: {
          ...state.activeEmail,
          isLoading: false,
          isSuccess: true,
          message: null,
        },
      }
    case UserTypes.ACTIVE_EMAIL_FAILURE:
      return {
        ...state,
        activeEmail: {
          ...state.activeEmail,
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // reset password
    case UserTypes.SEND_EMAIL_RESET_PASSWORD:
      return {
        ...state,
        resetPassword: {
          isLoading: true,
          isSuccess: false,
          message: action.payload,
        },
      }
    case UserTypes.SEND_EMAIL_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.SEND_EMAIL_RESET_PASSWORD_FAILUE:
      return {
        ...state,
        resetPassword: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // Verify token reset password
    case UserTypes.VERIFY_TOKEN_RESET_PASSWORD:
      return {
        ...state,
        resetPassword: {
          isLoading: true,
          isSuccess: null,
          message: null,
          isTokenTrue: null,
        },
      }
    case UserTypes.VERIFY_TOKEN_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          isLoading: false,
          isTokenTrue: true,
          userId: action.payload,
        },
      }
    case UserTypes.VERIFY_TOKEN_RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          isLoading: false,
          isTokenTrue: false,
        },
      }
    // reset password
    case UserTypes.RESET_PASSWORD:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          isLoading: true,
        },
      }
    case UserTypes.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }

    case UserTypes.UPDATE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      }

    // Change password
    case UserTypes.CHANGE_PASSPWORD:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          isLoading: true,
        },
      }
    case UserTypes.CHANGE_PASSPWORD_SUCCESS:
      return {
        ...state,
        changePassword: {
          isLoading: false,
          isSuccess: true,
        },
      }
    case UserTypes.CHANGE_PASSPWORD_FAILURE:
      return {
        ...state,
        changePassword: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    case UserTypes.CHANGE_PASSPWORD_CLEAR:
      return {
        ...state,
        changePassword: {
          isLoading: false,
          isSuccess: null,
          message: null,
        },
      }
    // update avatar
    case UserTypes.UPDATE_AVATAR:
      return {
        ...state,
        updateAvatar: {
          isLoading: true,
        },
      }
    case UserTypes.UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          avatar: action.payload, // new avatar
        },
        updateAvatar: {
          isLoading: false,
          isSuccess: true,
          message: null,
        },
      }
    case UserTypes.UPDATE_AVATAR_FAIILURE:
      return {
        ...state,
        updateAvatar: {
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    case UserTypes.UPDATE_AVATAR_CLEAR:
      return {
        ...state,
        updateAvatar: {
          isLoading: false,
          isSuccess: null,
          message: null,
        },
      }

    default:
      return state
  }
}

export default userReducer