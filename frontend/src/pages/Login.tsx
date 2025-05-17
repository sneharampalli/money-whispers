import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

type User = {
  username: string;
  email?: string;
  password: string;
};

const StyledButton = styled(Button)({
  margin: "0 8px",
});

// Page to show the users.
const Login = () => {
  const backendURL = "http://127.0.0.1:5000/api";

  const [postData, setPostData] = useState<User>({
    username: "",
    password: "",
  });

  const { user, login, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
  const handleClose = () => setOpen(false);
  const handleLoginShow = () => setOpen(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setPostData((prev) => ({ ...prev }));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.error ||
          "Invalid username or password. Please try again.";
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setPostData({
        username: "",
        password: "",
      });
      login(responseData);
      // Close modal only on successful login
      setOpen(false);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      // loading
      setLoading(false);
    }
  };

  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendURL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        let logoutErrorMessage = "Failed to logout.";
        try {
          const logoutErrorData = await response.json();
          logoutErrorMessage = logoutErrorData.error || logoutErrorMessage;
        } catch (parseError) {}
        throw new Error(logoutErrorMessage);
      }

      const result = await response.json();
      logout(); // Call the logout function from AuthContext
    } catch (err: any) {
      setLogoutError(err.message || "An unexpected error occurred.");
    } finally {
      console.log("logged out");
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${backendURL}/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.error || "Failed to create account. Please try again.";
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setPostData({
        username: "",
        password: "",
      });
      // Only close dialog on success
      setOpen(false);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      // loading
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        {!user ? (
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleLoginShow}
            startIcon={<LoginIcon />}
          >
            Login
          </StyledButton>
        ) : (
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </StyledButton>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{showLoginForm ? "Login" : "Create Account"}</DialogTitle>
        <DialogContent>
          {showLoginForm ? (
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={postData.username}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={postData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Button
                    onClick={() => setShowLoginForm(false)}
                    sx={{ p: 0, minWidth: "auto" }}
                  >
                    Create one
                  </Button>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleCreateUserSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={postData.username}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={postData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                fullWidth
                name="email"
                label="Email"
                type="email"
                id="email"
                autoComplete="email"
                value={postData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Typography variant="body2">
                  Have an account?{" "}
                  <Button
                    onClick={() => setShowLoginForm(true)}
                    sx={{ p: 0, minWidth: "auto" }}
                  >
                    Login here
                  </Button>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={showLoginForm ? handleLoginSubmit : handleCreateUserSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : showLoginForm
              ? "Login"
              : "Create Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
