import { StyledYoutubeEmbed, StyledYoutubeEmbedWrapper } from './EditorStyled';

export const EmbedsArray = [
    {
        title: "YouTube",
        keywords: "youtube video tube google",
        icon: () => (
            <img src="/YouTube_white_squircle.svg" width={24} height={24} />
        ),
        matcher: url => {
            return url.match(
                /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
            );
        },
        component: YoutubeEmbed,
    }
];

function YoutubeEmbed(props) {
    return (
        <StyledYoutubeEmbedWrapper>
            <StyledYoutubeEmbed
                src={`https://www.youtube.com/embed/${props.attrs.matches[1]}?modestbranding=1`}
            />
        </StyledYoutubeEmbedWrapper>
    );
}
