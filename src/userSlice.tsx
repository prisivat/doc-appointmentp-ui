import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName?: any;
  docName?: string,
  time?: string,
  hospitalName?: string,
  location?: string,
  specalist?: string
}

const initialState: UserState = {
  userName: "",
  docName: "",
  time: "",
  hospitalName: "",
  location: '',
  specalist: ""
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
        hospitalDetails:  (state, action: PayloadAction<UserState>) => {
          state.hospitalName = action.payload.hospitalName;
          state.time = action.payload.time;
          state.docName = action.payload.docName;
          state.location = action.payload.location;         
          state.specalist = action.payload.specalist;
        }
    }
});

export const { userDetails, hospitalDetails, clearUser} = userSlice.actions;
export default userSlice.reducer;
