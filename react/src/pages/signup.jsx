import { Button, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user-api";
import { useState } from "react";
import "./signup.css";

export const Signup = () => {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameHelper, setNameHelper] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelper, setPasswordHelper] = useState("");
    const [language, setLanguage] = useState("English");
    const [snackbar, setSnackbar] = useState(false);
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    const toggleSnackbar = () => {
        setSnackbar(!snackbar);
    }

    const clearFields = () => {
        setName("");
        setNameError(false);
        setNameHelper("");
        setEmail("");
        setEmailError(false);
        setEmailHelper("");
        setPassword("");
        setPasswordError(false);
        setPasswordHelper("");
    };

    const validateName = (n) => {
        const regex = /^[A-Za-z\s]+$/;
        return regex.test(n);
    };

    const validateEmailFormat = (e) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(e);
    };

    const validatePassword = (p) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(p);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (name === "") {
                setNameError(true);
                setNameHelper("The name is required.");
            } else if (!validateName(name)) {
                setNameError(true);
                setNameHelper("The name should only contain letters and spaces.");
            } else if (email === "") {
                setNameError(false);
                setNameHelper("");

                setEmailError(true);
                setEmailHelper("Email is required.");
            } else if (!validateEmailFormat(email)) {
                setNameError(false);
                setNameHelper("");

                setEmailError(true);
                setEmailHelper("Please enter a valid email address.");
            } else if (!password) {
                setEmailError(false);
                setEmailHelper("");

                setPasswordError(true);
                setPasswordHelper("Password is required.");
            } else if (!validatePassword(password)) {
                setEmailError(false);
                setEmailHelper("");

                setPasswordError(true);
                setPasswordHelper("At least 8 characters, an uppercase letter, a number, a special character.");
            } else {
                await registerUser({ name, email, password, language });
                toggleSnackbar();
                clearFields();
                goToLogin();
            }
        } catch (err) {
            console.log(err.response?.data?.error || 'Error signing up');
        }
    }

    return (
        <div className="signupPanel">
            <div className="signupPanelLeft">
                <div className="signupTitle"> Start learning </div>
                <div className="signupTitle" style={{ margin: '-20px 0' }}> with E-learn </div>
                <div className="signupSubTitle"> Already have an </div>
                <div className="signupSubTitle"> account? <span onClick={goToLogin} style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}>Log in</span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="signupPanelRight">
                <TextField
                    label="Full name"
                    variant="outlined"
                    value={name}
                    error={nameError}
                    helperText={nameHelper}
                    onChange={(event) => setName(event.target.value)}
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
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    error={emailError}
                    helperText={emailHelper}
                    onChange={(event) => setEmail(event.target.value)}
                    style={{ marginTop: '30px' }}
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
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    error={passwordError}
                    helperText={passwordHelper}
                    onChange={(event) => setPassword(event.target.value)}
                    style={{ marginTop: '30px' }}
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
                            width: '500px'
                        },
                    }}
                />
                <FormControl style={{ margin: '30px 0', width: '400px', boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 6px 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                    <InputLabel id="select-label"> Language </InputLabel>
                    <Select
                        className="signupTextField"
                        labelId="select-label"
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                        label="Language"
                        defaultValue="English"
                        sx={{
                            color: "#303030",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0080FF" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00509f" },
                        }}
                    >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Romanian">Romanian</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="German">German</MenuItem>
                    </Select>
                </FormControl>
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
                        marginRight: '80px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        border: '2px solid var(--blue)',
                        backgroundColor: 'var(--blue)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: '500',
                        transitionDuration: '0.4s',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 6px 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                >
                    Sign up
                </Button>
            </form>
            <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={toggleSnackbar}
                message="Registration successful!"
            />
        </div>
    )
}