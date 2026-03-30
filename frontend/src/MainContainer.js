import React, { Component } from 'react';
import './MainContainer.css';
import {MuiThemeProvider} from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Grid } from '@material-ui/core';
import { getMainTheme } from './Themes';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import AuthHome from './pages/AuthHomePage';
import { getStoredToken, clearStoredToken } from './services/api';

export const ScreenEnum = {Login: 0, Register: 1, Home: 2}
export var widgetWrap;

const mainTheme = getMainTheme();
document.body.style.setProperty('--input-focus-border', mainTheme.palette.secondary.main);

const subPanelContainerStyle = {
  backgroundColor: getMainTheme().palette.secondary.light,
};

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: getStoredToken() ? ScreenEnum.Home : ScreenEnum.Login
    };

    widgetWrap = this;
  }

  displayScreen(screen) {
    this.setState({screen: screen});
  }

  render() {
    const screen = this.state.screen;
    let widget;

    switch(screen){
      case ScreenEnum.Login:
        widget = <Login />;
        break;
      case ScreenEnum.Register:
        widget = <Register />;
        break;
      case ScreenEnum.Home:
        widget = <AuthHome onLogout={this.handleLogout} />;
        break;
      default:
    }

    return (
      <MuiThemeProvider theme={mainTheme}>
        <div className="cityGlow cityGlowLeft" />
        <div className="cityGlow cityGlowRight" />
        <div className="paintDrip paintDripOne" />
        <div className="paintDrip paintDripTwo" />
        <AppBar position="fixed" color="primary" className="graffitiBar">
          <Toolbar className="graffitiToolbar">
            <div className="brandStack">
              <Typography className="headerText graffitiWordmark" color="textPrimary">
                Outfittr
              </Typography>
              <Typography className="graffitiTagline" color="textPrimary">
                street-coded closet control
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
        <Grid container justify="center" alignItems="center" style={subPanelContainerStyle} className="subPanelContainer subPanelContainerSmall">
          {widget}
        </Grid>
      </MuiThemeProvider>
    );
  }

  handleLogout = () => {
    clearStoredToken();
    this.displayScreen(ScreenEnum.Login);
  }
}

export default MainContainer;
