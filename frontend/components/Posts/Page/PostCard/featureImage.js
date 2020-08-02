import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LinearProgress from '@material-ui/core/LinearProgress';
import { 
    StyledImage, 
    StyledImageWrapper,
    FeatureImageWrapper,
    StyledLinearProgressWrapper,
    TagsWrapper,
    StyledChip,
    ImageSkeleton
} from './postCardStyled';
import config from '../../../../config';
import { Skeleton } from '@material-ui/lab';

function FeatureImage({featureImgUrl, tags, skeleton}) {

    const [loading, setLoading] = useState(true);

    useEffect(() => {

    }, [loading]);
    
    return (
        <FeatureImageWrapper>
            {!skeleton && loading 
                &&  <>
                        <ImageSkeleton variant="rect" width="100%" height="300px" />
                    </>
            }
            <TagsWrapper>
            {!skeleton && tags.map((tag, i) => {
                let attr = {};
                attr['href'] = "category/" + tag;
                return (
                    <Link key={i} href="/category/[category]" as={`/category/${tag}`} passHref>
                        <StyledChip size="small" clickable label={tag}/>
                    </Link>
                );
            })}
            </TagsWrapper>
            <StyledImageWrapper>
                {skeleton ? <Skeleton variant="rect" width="100%" height="300px"/>
                :
                <picture>
                    {featureImgUrl.substring(featureImgUrl.length - 5, featureImgUrl.length) == ".jpeg" 
                        ? <source type="image/webp" srcSet={process.env.NEXT_PUBLIC_API_URL + featureImgUrl.substring(0, featureImgUrl.length - 5) + ".webp"} />
                        : <source type="image/webp" srcSet={process.env.NEXT_PUBLIC_API_URL + featureImgUrl.substring(0, featureImgUrl.length - 4) + ".webp"} />
                    }
                    <StyledImage src={process.env.NEXT_PUBLIC_API_URL + featureImgUrl} alt="Feature Image" onLoad={() => setLoading(false)} />
                </picture>
                } 
            </StyledImageWrapper>
        </FeatureImageWrapper>
    )

}

export default FeatureImage;
