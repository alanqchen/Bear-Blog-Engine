import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
      primary: {
        main: '#e53935',
      },
      secondary: {
        main: '#1e88e5',
      },
      error: {
        main: red.A400,
      },  
    },
    overrides: {
      MuiTypography: {
        root: {
          color: '#ffffff',
        },
        colorTextPrimary: {
          color: '#efeff1',
        },
        colorTextSecondary: {
          color: '#d0d0d0',
        }
      },
      MuiToolbar: {
        root: {
          color: "#d32f2f"
        }
      },
      MuiPaper: {
        outlined: {
          border: "1px solid #2f323c"
        },
        rounded: {
          borderRadius: "1em"
        }
      }
      
    },
  });
  
  
  export default theme;