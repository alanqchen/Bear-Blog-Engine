import {
    StyledYoutubeEmbed,
    StyledYoutubeEmbedWrapper,
    StyledEmbedWrapper
} from './EditorStyled';

export const EmbedsArray = [
    {
        title: "YouTube",
        keywords: "youtube video tube google",
        icon: () => (
            <img src="/embed-icons/youtube-embed.svg" width={24} height={24} />
        ),
        matcher: url => {
            return url.match(
                /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
            );
        },
        component: YoutubeEmbed,
    },
    {
        title: "Image URL",
        keywords: "image photo url picture",
        icon: () => (
            <img alt="embed image" src="/embed-icons/photo-embed.svg" width={24} height={24} />
        ),
        matcher: url => {
            return url.match(
                /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i
            );
        },
        component: ImageEmbed,
    },
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

function ImageEmbed(props) {
    return (
        <StyledEmbedWrapper>
            <img
                src={`${props.attrs.matches[0]}`}
            />
        </StyledEmbedWrapper>
    );
}
