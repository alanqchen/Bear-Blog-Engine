import { StyledYoutubeEmbed, StyledYoutubeEmbedWrapper } from './EditorStyled';

export function YoutubeEmbed(props) {
    return (
        <StyledYoutubeEmbedWrapper>
            <StyledYoutubeEmbed
                src={`https://www.youtube.com/embed/${props.attrs.matches[1]}?modestbranding=1`}
            />
        </StyledYoutubeEmbedWrapper>
    );
}
