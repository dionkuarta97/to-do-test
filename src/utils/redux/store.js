import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {toDoApi} from './RTKQuery';

export const store = configureStore({
  reducer: {
    [toDoApi.reducerPath]: toDoApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(toDoApi.middleware),
});

setupListeners(store.dispatch);
