import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Skeleton } from "@material-ui/lab";
import { StyledCard } from "./postCardStyled";
import FeatureImage from "./featureImage";
import { timestamp2date } from "../../../utils/helpers";

export const PostCard = ({ post, skeleton }) => {
  return (
    <StyledCard variant="outlined" skeleton={skeleton}>
      <CardContent>
        {skeleton ? (
          <FeatureImage featureImgUrl={null} tags={null} skeleton={true} />
        ) : (
          <FeatureImage
            featureImgUrl={post.featureImgUrl}
            tags={post.tags}
            skeleton={false}
          />
        )}
        <Typography
          fontWeight="fontWeightMedium"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {skeleton ? (
            <Skeleton animation="wave" variant="text" width="100%" />
          ) : (
            <>{post.title}</>
          )}
        </Typography>
        <Typography
          fontWeight="fontWeightRegular"
          variant="subtitle1"
          color="textPrimary"
          component="h2"
        >
          {skeleton ? (
            <Skeleton animation="wave" variant="text" width="80%" />
          ) : (
            <>{post.subtitle}</>
          )}
        </Typography>
        <Typography
          fontWeight="fontWeightLight"
          variant="subtitle2"
          color="textSecondary"
          component="h3"
        >
          {skeleton ? (
            <Skeleton animation="wave" variant="text" width="40%" />
          ) : (
            <>{timestamp2date(post.createdAt)}</>
          )}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default PostCard;
