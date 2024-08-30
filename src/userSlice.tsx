import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName?: string;
  docName?: string,
  time?: string,
  hospitalName?: string,
  location?: string
}

const initialState: UserState = {
  userName: '',
  docName: "",
  time: "",
  hospitalName: "",
  location: ''
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userDetails: (state, action: PayloadAction<UserState>) => {
            state.userName = action.payload.userName;
            },    
        hospitalDetails:  (state, action: PayloadAction<UserState>) => {
          state.hospitalName = action.payload.hospitalName;
          state.time = action.payload.time;
          state.docName = action.payload.docName;
          state.location = action.payload.location;
        }
    }
});

export const { userDetails, hospitalDetails} = userSlice.actions;
export default userSlice.reducer;
