import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../src/utils/axiosClient";

// Thunks
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ displayName, email, photoURL }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/user/googleLogin", {
        displayName,
        email,
        photoURL,
      });
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Google login failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/user/check");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Not authenticated");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axiosClient.post("/user/logout");
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, thunkAPI) => {
    try {
      const res = await axiosClient.post("/user/generateOTP", { email });
      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/user/verifyOTP", { email, otp });
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Invalid OTP"
      );
    }
  }
);

export const getUserImage = createAsyncThunk(
  "auth/getUserImage",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/user/getImage");
      return res.data.photoURL;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile image"
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpStatus: null,
  photoURL: null,
  imageLoading: false,
  imageError: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpStatus = null;
      state.photoURL = null;
    },
    updatePhotoURL: (state, action) => {
      state.photoURL = action.payload;
      if (state.user) {
        state.user.photoURL = action.payload;
      }
    },
    clearImageError: (state) => {
      state.imageError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOtpStatus: (state) => {
      state.otpStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.photoURL = action.payload.photoURL;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
        state.photoURL = action.payload?.photoURL || null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.photoURL = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpStatus = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpStatus = null;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.photoURL = action.payload.photoURL;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Image
      .addCase(getUserImage.pending, (state) => {
        state.imageLoading = true;
        state.imageError = null;
      })
      .addCase(getUserImage.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.photoURL = action.payload;
        if (state.user) {
          state.user.photoURL = action.payload;
        }
      })
      .addCase(getUserImage.rejected, (state, action) => {
        state.imageLoading = false;
        state.imageError = action.payload;
      });
  },
});

export const {
  logout,
  updatePhotoURL,
  clearImageError,
  clearError,
  clearOtpStatus,
} = authSlice.actions;

export default authSlice.reducer;
