import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer
})

export default store;

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

