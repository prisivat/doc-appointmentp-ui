import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userName: string;
  password: string;
  namesList: string[];
}

const initialState: UserState = {
  userName: '',
  password: '',
  namesList: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userDetails: (state, action: PayloadAction<UserState>) => {
            state.userName = action.payload.userName;
            state.namesList = action.payload.namesList;
            state.password = action.payload.password;
        }
    }
});

export const { userDetails } = userSlice.actions;
export default userSlice.reducer;
