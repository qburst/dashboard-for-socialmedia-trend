import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { saga } from "./sagas/saga";
import reducer from "./Reducers/reducer";



export const getStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducer, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(saga);
    return store;
  }