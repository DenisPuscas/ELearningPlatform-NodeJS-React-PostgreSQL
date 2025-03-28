import { Snackbar, TextField, Button } from "@mui/material";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { authUser } from "../api/user-api";
import "./login.css"

export const Login = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState("");
    const [snackbar, setSnackbar] = useState(false);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const goToSignup = () => {
        navigate("/signup");
    };

    const goToCourses = () => {
        navigate("/courses");
    };

    const toggleSnackbar = () => {
        setSnackbar(!snackbar);
    };

    const clearFields = () => {
        setEmail("");
        setPassword("");
        clearError();
    };

    const clearError = () => {
        setEmailError(false);
        setEmailHelper("");
        setPasswordError(false);
        setPasswordHelper("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            clearError();
            const response = await authUser({ email, password });
            loginUser(response.data);
            clearFields();
            goToCourses();
        } catch (err) {
            if (err.response) {
                if (err.response.data.field === 'email') {
                    setEmailError(true);
                    setEmailHelper(err.response.data.message);
                } else {
                    setPasswordError(true);
                    setPasswordHelper(err.response.data.message);
                }
            } else {
                console.error(err.response?.data?.error || 'Error logging in');
            }
        }
    }

    return (
        <div className="loginPanel">
            <form onSubmit={handleSubmit} className="loginPanelLeft">
                <TextField
                    className="loginTextField"
                    label="Email"
                    variant="outlined"
                    required
                    value={email}
                    error={emailError}
                    helperText={emailHelper}
                    onChange={(event) => setEmail(event.target.value)}
                    sx={{
                        input: { zIndex: '1' },
                        "& .MuiOutlinedInput-root": {
                            width: "400px",
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 6px 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            "& fieldset": { borderColor: "var(--blue)", backgroundColor: "white" },
                        },
                        "& .MuiInputLabel-shrink": {
                            marginTop: '5px',
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            marginTop: '5px',
                        }, "& .MuiFormHelperText-root": {
                            fontWeight: 'bold',
                            fontSize: '12px',
                            position: 'absolute',
                            bottom: '-25px',
                        },
                    }}
                />
                <TextField
                    className="loginTextField"
                    label="Password"
                    type="password"
                    variant="outlined"
                    required
                    value={password}
                    error={passwordError}
                    helperText={passwordHelper}
                    onChange={(event) => setPassword(event.target.value)}
                    style={{ margin: '30px 0' }}
                    sx={{
                        input: { zIndex: '1' },
                        "& .MuiOutlinedInput-root": {
                            width: "400px",
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 6px 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            "& fieldset": { borderColor: "var(--blue)", backgroundColor: "white" },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            marginTop: '5px',
                        },
                        "& .MuiInputLabel-shrink": {
                            marginTop: '5px',
                        },
                        "& .MuiFormHelperText-root": {
                            fontWeight: 'bold',
                            fontSize: '12px',
                            position: 'absolute',
                            bottom: '-25px',
                        },
                    }}
                />
                <Button
                    className="loginButton"
                    type="submit"
                    variant="text"
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    sx={{
                        all: 'unset',
                        width: '200px',
                        marginLeft: '80px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        border: '2px solid white',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'var(--blue)',
                        fontWeight: '500',
                        transitionDuration: '0.4s',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 6px 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                >
                    Log in
                </Button>
            </form>
            <div className="loginPanelRight">
                <div className="loginTitle"> Login in to </div>
                <div className="loginTitle" style={{ margin: '-20px 0' }}> continue your </div>
                <div className="loginTitle"> learning journey </div>
                <div className="loginSubTitle"> Don't have an account? <span onClick={goToSignup} style={{ color: 'var(--blue)', textDecoration: 'underline', cursor: 'pointer' }}>Sign up</span>
                </div>
            </div>
            <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={toggleSnackbar}
                message="Login successful!"
            />
        </div >
    )
}