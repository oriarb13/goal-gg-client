import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changeLanguage, defaultLang } from "@/lib/i18n";

interface LanguageState {
  currentLanguage: string;
}

const initialState: LanguageState = {
  currentLanguage: defaultLang,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      const lang = action.payload;
      state.currentLanguage = lang;
      changeLanguage(lang);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
