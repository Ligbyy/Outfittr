import React, { Component } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@material-ui/core';
import { getStoredToken } from '../services/api';

const style = {
  tokenPreview: {
    marginTop: '1rem',
    padding: '0.9rem',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 246, 221, 0.08)',
    wordBreak: 'break-all'
  }
};

class AuthHome extends Component {
  render() {
    const token = getStoredToken();

    return (
      <Grid item className="authShell">
        <Card className="authCard authCardHome authCardLogin">
          <CardContent>
            <div className="sprayAccent sprayAccentBlue" />
            <Typography className="authEyebrow">Wall secured</Typography>
            <Typography variant="h4" className="authTitle authTitleHome">
              You&apos;re signed in
            </Typography>
            <Typography variant="body1" className="authSubtitle">
              Your JWT is stored locally and ready to be sent as the
              `x-access-token` header on authenticated API requests.
            </Typography>
            {token ? (
              <div style={style.tokenPreview}>
                <Typography variant="caption">Stored token</Typography>
                <Typography variant="body2">{token}</Typography>
              </div>
            ) : null}
          </CardContent>
          <CardActions className="authActions">
            <Button
              size="large"
              className="authButton authButtonPrimary"
              onClick={this.props.onLogout}
            >
              Logout
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default AuthHome;
