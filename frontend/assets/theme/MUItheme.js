import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import GlobalTheme from '../../components/Theme/theme'

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
            color: GlobalTheme.textPrimary,
            },
            colorTextSecondary: {
            color: GlobalTheme.textSecondary,
            }
        },
        MuiToolbar: {
            root: {
                color: "#d32f2f"
            }
        },
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: GlobalTheme.scarlet
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
