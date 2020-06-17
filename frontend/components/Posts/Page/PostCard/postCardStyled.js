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
`
