import React from 'react';
import { Typography } from '@material-ui/core';

function AuthStatusMessage(props) {
  const { message, tone } = props;

  if (!message) {
    return null;
  }

  return (
    <Typography className={tone === 'error' ? 'authStatus authStatusError' : 'authStatus authStatusSuccess'}>
      {message}
    </Typography>
  );
}

export default AuthStatusMessage;
