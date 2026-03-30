import React, { Component } from 'react';
import '../Register.css';
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';
import {NavigateBeforeTwoTone} from '@material-ui/icons'
import { getMainTheme } from '../Themes';
import {MuiThemeProvider} from '@material-ui/core/styles'
import { widgetWrap, ScreenEnum } from '../MainContainer';
import { extractToken, registerUser, storeToken } from '../services/api';
import AuthStatusMessage from '../components/AuthStatusMessage';

const mainTheme = getMainTheme();

const style = {
  container: {
    width: '100%'
  },
  fieldText: {
    style: {
      color: '#fff6dd'
    }
  },
};

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    loading: false,
    error: '',
    success: ''
  };

  onFieldChange = field => event => {
    this.setState({
      [field]: event.target.value,
      error: '',
      success: ''
    });
  }

  onBackClick = () => {
    widgetWrap.displayScreen(ScreenEnum.Login);
  }

  onRegisterClick = async () => {
    const {
      firstName,
      lastName,
      username,
      email,
      confirmEmail,
      password,
      confirmPassword
    } = this.state;

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      this.setState({
        error: 'All fields are required.'
      });
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      this.setState({
        error: 'Email addresses must match.'
      });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({
        error: 'Passwords must match.'
      });
      return;
    }

    this.setState({
      loading: true,
      error: '',
      success: ''
    });

    try {
      const response = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password: password
      });
      const token = extractToken(response);

      if (token) {
        storeToken(token);
        this.setState({
          loading: false,
          success: 'Registration successful.'
        });
        widgetWrap.displayScreen(ScreenEnum.Home);
        return;
      }

      this.setState({
        loading: false,
        success: response.userConfirmed ?
          'Registration successful. Use the back button to log in.' :
          'Registration successful. Check your email for confirmation before logging in.'
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message || 'Unable to register right now.'
      });
    }
  }

  render() {
    const {
      firstName,
      lastName,
      username,
      email,
      confirmEmail,
      password,
      confirmPassword,
      loading,
      error,
      success
    } = this.state;

    return (
      <Grid item xs={11} sm={10} md={8} lg={7} className="authShell" style={style.container}>
        <Card className="authCard authCardRegister">
          <CardContent>
            <div className="sprayAccent sprayAccentOrange" />
            <div className="sprayAccent sprayAccentBlue" />
            <Grid container>
              <Grid item xs={10} sm={11}>
                <Typography className="authEyebrow">Fresh paint</Typography>
                <label className="authTitle authTitleRegister">Register</label>
                <Typography className="authSubtitle">
                  Claim your wall, lock your closet, start the archive.
                </Typography>
              </Grid>
              <Grid item xs={2} sm={1} style={{textAlign: 'center', display: 'flex'}} justify="center" alignItems="center">
                <IconButton aria-label="Back" className="backButton" onClick={this.onBackClick}>
                  <NavigateBeforeTwoTone fontSize="default"/>
                </IconButton>
              </Grid>
            </Grid>

            <form noValidate>
              <MuiThemeProvider theme={mainTheme}>
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="authField registerField"
                      label="First Name"
                      autoComplete="given-name"
                      onChange={this.onFieldChange('firstName')}
                      value={firstName}
                      margin="normal"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="authField registerField"
                      label="Last Name"
                      autoComplete="family-name"
                      onChange={this.onFieldChange('lastName')}
                      value={lastName}
                      margin="normal"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="authField registerField"
                      label="Username"
                      autoComplete="username"
                      onChange={this.onFieldChange('username')}
                      value={username}
                      margin="normal"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="authField registerField"
                      label="Email"
                      autoComplete="email"
                      onChange={this.onFieldChange('email')}
                      value={email}
                      margin="normal"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="authField registerField"
                      label="Re-Type Email"
                      autoComplete="email"
                      onChange={this.onFieldChange('confirmEmail')}
                      value={confirmEmail}
                      margin="normal"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="authField registerField"
                      label="Password"
                      autoComplete="new-password"
                      onChange={this.onFieldChange('password')}
                      value={password}
                      margin="normal"
                      type="password"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="authField registerField"
                      label="Re-Type Password"
                      autoComplete="new-password"
                      onChange={this.onFieldChange('confirmPassword')}
                      value={confirmPassword}
                      margin="normal"
                      type="password"
                      inputProps={style.fieldText}
                      fullWidth={true}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </MuiThemeProvider>
            </form>

            <Typography variant="body2" style={{marginTop: '1rem'}}>
              Built for the existing signup flow and ready for the real backend hookup.
            </Typography>
            <AuthStatusMessage message={error} tone="error" />
            <AuthStatusMessage message={success} tone="success" />
          </CardContent>
          <CardActions className="authActions">
            <Grid container spacing={8} className="authButtonRow">
              <Grid item xs={12}>
                <Button size="large" className="authButton authButtonPrimary" onClick={this.onRegisterClick} disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default Register;
