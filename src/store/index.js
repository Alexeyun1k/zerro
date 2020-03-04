import { configureStore } from 'redux-starter-kit'
import ZenApi from 'services/ZenApi'

import localData from './localData'
import serverData from './serverData'
import filterConditions from './filterConditions'
import token from './token'
import isPending from './isPending'
import message from './message'
import theme from './theme'

export const store = configureStore({
  reducer: {
    localData,
    serverData,
    isPending,
    filterConditions,
    token,
    message,
    theme,
  },
  preloadedState: { token: ZenApi.getLocalToken() },
})
