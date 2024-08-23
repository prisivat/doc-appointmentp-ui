// types.ts
export interface AppState {
    location: string;
    userName: string;
    password: string;
    listOfNames: string[];
  }
  
  export interface SetLocationAction {
    type: 'SET_LOCATION';
    payload: string;
  }
  
  export interface SetUserNameAction {
    type: 'SET_USER_NAME';
    payload: string;
  }
  
  export interface SetPasswordAction {
    type: 'SET_PASSWORD';
    payload: string;
  }
  
  export interface SetListOfNamesAction {
    type: 'SET_LIST_OF_NAMES';
    payload: string[];
  }
  
  export type AppActions =
    | SetLocationAction
    | SetUserNameAction
    | SetPasswordAction
    | SetListOfNamesAction;
  