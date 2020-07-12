import styled from "styled-components";
import GlobalTheme from '../Theme/theme'

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
`;
