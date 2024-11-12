import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName?: any;
  docName?: string,
  cost?: string,
  hospitalName?: string,
  location?: string,
  specialist?: string
  schedulerName?:any;
}

const initialState: UserState = {
  userName: "",
  docName: "",
  cost: "",
  hospitalName: "",
  location: '',
  specialist: "",
  schedulerName:""
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
            schedulerDetails: (state, action: PayloadAction<UserState>) => {
              state.schedulerName = action.payload.schedulerName;
              },    
              clearScheduler: (state) => {
                state.schedulerName = null;
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

export const { userDetails, hospitalDetails, clearUser,schedulerDetails} = userSlice.actions;
export default userSlice.reducer;
