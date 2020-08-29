import styled from "styled-components";

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

export const SpacingWrapper = styled.div`
    margin: 10px;
`;

export const WidthWrapper = styled.div`
    margin-top: 10px;
    max-width: 700px;
    width: 95%;
    margin: auto;
`;
