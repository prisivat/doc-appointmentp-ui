import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName?: any;
  docName?: string,
  cost?: string,
  hospitalName?: string,
  location?: string,
  specialist?: string
  schedularName?:any;
}

const initialState: UserState = {
  userName: "",
  docName: "",
  cost: "",
  hospitalName: "",
  location: '',
  specialist: "",
  schedularName:""
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userDetails: (state, action: PayloadAction<UserState>) => {
            state.userName = action.payload.userName;
            },    
            clearUser: (state) => {
              state.userName = null;
            },
            schedularDetails: (state, action: PayloadAction<UserState>) => {
              state.schedularName = action.payload.schedularName;
              },    
              clearSchedular: (state) => {
                state.schedularName = null;
              },
        hospitalDetails:  (state, action: PayloadAction<UserState>) => {
          state.hospitalName = action.payload.hospitalName;
          state.cost = action.payload.cost;
          state.docName = action.payload.docName;
          state.location = action.payload.location;         
          state.specialist = action.payload.specialist;
        }
    }
});

export const { userDetails, hospitalDetails, clearUser,schedularDetails} = userSlice.actions;
export default userSlice.reducer;
