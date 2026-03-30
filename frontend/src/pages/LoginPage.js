import React, { Component } from 'react';
import '../Login.css';
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography
} from '@material-ui/core';
import { getMainTheme } from '../Themes';
import {MuiThemeProvider} from '@material-ui/core/styles'
import { widgetWrap, ScreenEnum } from '../MainContainer';
import { extractToken, loginUser, storeToken } from '../services/api';
import AuthStatusMessage from '../components/AuthStatusMessage';

const mainTheme = getMainTheme();

const style = {
  fieldText: {
    style: {
      color: '#fff6dd'
    }
  },
  helperText: {
    marginTop: '1rem'
  },
};

class Login extends Component {
  state = {
    username: '',
    password: '',
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

  onRegisterClick = () => {
    widgetWrap.displayScreen(ScreenEnum.Register);
  }

  onLoginClick = async () => {
    const { username, password } = this.state;

    if (!username.trim() || !password.trim()) {
      this.setState({
        error: 'Username and password are required.'
      });
      return;
    }

    this.setState({
      loading: true,
      error: '',
      success: ''
    });

    try {
      const response = await loginUser({
        username: username.trim(),
        password: password,
        email: username.trim()
      });
      const token = extractToken(response);

      if (!token) {
        throw new Error('Login succeeded, but no JWT was returned.');
      }

      storeToken(token);
      this.setState({
        loading: false,
        success: 'Login successful.'
      });
      widgetWrap.displayScreen(ScreenEnum.Home);
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message || 'Unable to log in right now.'
      });
    }
  }

  render() {
    const { username, password, loading, error, success } = this.state;

    return (
      <Grid item className="authShell">
        <Card className="authCard authCardLogin">
          <CardContent>
            <div className="sprayAccent sprayAccentPink" />
            <div className="sprayAccent sprayAccentBlue" />
            <Typography className="authEyebrow">Tag the wall</Typography>
            <label className="authTitle authTitleLogin">Login</label>
            <Typography className="authSubtitle">
              Pull your fit archive back out of the tunnel.
            </Typography>

            <form noValidate>
              <MuiThemeProvider theme={mainTheme}>
                <TextField
                  onChange={this.onFieldChange('username')}
                  value={username}
                  className="authField loginField"
                  label="Username or Email"
                  autoComplete="username"
                  margin="normal"
                  inputProps={style.fieldText}
                  fullWidth={true}
                  variant="outlined"
                />

                <TextField
                  onChange={this.onFieldChange('password')}
                  value={password}
                  className="authField loginField"
                  label="Password"
                  autoComplete="current-password"
                  margin="normal"
                  type="password"
                  inputProps={style.fieldText}
                  fullWidth={true}
                  variant="outlined"
                />
              </MuiThemeProvider>
            </form>

            <Typography variant="body2" style={style.helperText}>
              Built for the existing auth routes and ready for the real API hookup.
            </Typography>
            <AuthStatusMessage message={error} tone="error" />
            <AuthStatusMessage message={success} tone="success" />
          </CardContent>
          <CardActions className="authActions">
            <Grid container spacing={8} className="authButtonRow">
              <Grid item xs={12} sm={12} md={6}>
                <Button onClick={this.onRegisterClick} size="large" className="authButton authButtonGhost">
                  Register
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button onClick={this.onLoginClick} size="large" className="authButton authButtonPrimary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default Login;
