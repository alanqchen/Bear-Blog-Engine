import styled from "styled-components";
import { Card, Chip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import GlobalTheme from '../../../Theme/theme';
import SCtheme from '../../../../assets/theme/SCtheme';

export const StyledCard = styled(Card).withConfig({
        shouldForwardProp: prop => prop !== "skeleton"
    })`
    ${({ skeleton = false }) => skeleton ? `
        width: 97%;
    ` : `
        width: 100%;
    `}
    max-width: 700px;
    margin-bottom: 20px;
    background-color: ${SCtheme.backgroundDarkAlt};
    transition: transform 0.2s ease-in-out !important;
    &:hover {
        cursor: pointer;
        transform: scale(1.007);
    }
    min-height: 300px;
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 
                0px 5px 8px 0px rgba(0,0,0,0.14), 
                0px 1px 14px 0px rgba(0,0,0,0.12);
`

export const StyledImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-height: 300px;
    max-height: 300px;
`;

export const StyledImage = styled.img`
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%
`;

export const FeatureImageWrapper = styled.div`
    position: relative;
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -16px;
    margin-bottom: 16px;
`;

export const StyledLinearProgressWrapper = styled.div`
    position: absolute;
    width: 100%;
`;

export const TagsWrapper = styled.div`
    position: absolute;
    bottom: 5px;
    left: 5px;
`;

export const StyledChip = styled(Chip)`
    margin-right: 5px !important;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2),
                0px 2px 2px 0px rgba(0,0,0,0.14),
                0px 1px 5px 0px rgba(0,0,0,0.12);
    background-color: ${GlobalTheme.backgroundAlt1} !important;

    &:hover {
        background-color: ${GlobalTheme.backgroundAlt2} !important;
    }

    &:focus {
        outline: -webkit-focus-ring-color auto 5px !important;
    }
`;

export const ImageSkeleton = styled(Skeleton)`
    position: absolute;
`
