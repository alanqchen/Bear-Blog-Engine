import styled from "styled-components";
import Card from '@material-ui/core/Card';
import SCtheme from '../../../../assests/theme/SCtheme'

export const StyledCard = styled(Card)`
    margin-bottom: 10px;
    background-color: ${SCtheme.backgroundDarkAlt};
    transition: transform 0.2s ease-in-out !important;
    &:hover {
        cursor: pointer;
        transform: scale(1.008);
    }
    min-height: 600px;
`

export const StyledImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-height: 500px;
    max-height: 500px;
`;

export const StyledImage = styled.img`
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%
`;
