import {createMuiTheme} from '@material-ui/core/styles'
import {amber, cyan, red} from '@material-ui/core/colors'

const palette = {
  primary: {
    light: '#fff3c4',
    main: '#111111',
    dark: '#050505',
  },
  secondary: {
    main: '#00e5ff',
    light: cyan[100],
    dark: cyan[700],
  },
  error: {
    main: red[500],
  },
  warning: {
    main: amber[500],
  },
  text: {
    primary: 'rgba(255, 255, 255, 255)',
  },
}

const mainTheme = createMuiTheme({
  palette: palette,

  overrides: {
    MuiInputLabel: {
      root: {
        color: palette.primary.light,
      },

      shrink: {
        '&$shrink': {
          transform: 'translate(14px, -10px) scale(0.75)!important',
        }
      },
    },
  }
});

export function getMainTheme() {
  return mainTheme;
}
