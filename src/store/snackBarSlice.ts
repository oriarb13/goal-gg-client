import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackBarState {
  show: boolean;
  message: string;
  severity: "success" | "error";
}

const initialState: SnackBarState = {
  show: false,
  message: "",
  severity: "success",
};

const snackBarSlice = createSlice({
  name: "snackBar",
  initialState,
  reducers: {
    showSnackBar: (state, action: PayloadAction<SnackBarState>) => {
      state.show = action.payload.show;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideSnackBar: (state) => {
      state.show = false;
    },
  },
});

export const { showSnackBar, hideSnackBar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
