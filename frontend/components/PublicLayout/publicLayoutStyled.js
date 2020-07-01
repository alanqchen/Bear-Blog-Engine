import styled from "styled-components";
import GlobalTheme from '../Theme/theme'
import NavBar from './NavBar'

export const CenteredContainer = ({className, children}) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
}
  
export const StyledCenteredContainer = styled(CenteredContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StyledNavBar = styled(NavBar)`
    transition: background-color 225ms linear, 
                transform 225ms cubic-bezier(0, 0, 0.2, 1) !important;
    ${({ atTop }) => atTop && `
        box-shadow: 0px 0px !important;
    `}
`;
