import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    StyledImage,
    StyledPicture,
    StyledImageWrapper,
    FeatureImageWrapper,
    TagsWrapper,
    StyledChip
} from './postCardStyled';
import { Skeleton } from '@material-ui/lab';

function FeatureImage({ featureImgUrl, tags, skeleton, moreHeight, noMargin }) {

    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
        setLoading(false)
    }

    useEffect(() => { }, [loading]);
    
    const wrapperLoadingStyle = {
        position: "absolute",
        top: "0"
    }

    return (
        <FeatureImageWrapper noMargin={noMargin ? "1" : undefined}>
            {!skeleton && loading &&
                <>
                    <Skeleton variant="rect" width="100%" height={moreHeight ? "600px" : "300px"} />
                </>
            }
            <TagsWrapper>
            {!skeleton && tags && tags.map((tag, i) => {
                let attr = {};
                attr['href'] = "category/" + tag;
                return (
                    <Link key={i} href="/category/[category]" as={`/category/${tag}`} passHref>
                        <StyledChip size="small" clickable label={tag}/>
                    </Link>
                );
            })}
            </TagsWrapper>
            <StyledImageWrapper moreHeight={moreHeight ? "1" : undefined} style={loading ? wrapperLoadingStyle : {}}>
                {skeleton ? <Skeleton variant="rect" width="100%" height={moreHeight ? "600px" : "300px"} />
                :
                <StyledPicture>
                    {featureImgUrl.substring(featureImgUrl.length - 5, featureImgUrl.length) == ".jpeg" 
                        ? <source type="image/webp" srcSet={process.env.NEXT_PUBLIC_API_URL + featureImgUrl.substring(0, featureImgUrl.length - 5) + ".webp"} />
                        : <source type="image/webp" srcSet={process.env.NEXT_PUBLIC_API_URL + featureImgUrl.substring(0, featureImgUrl.length - 4) + ".webp"} />
                    }
                    <StyledImage 
                        ref={(input) => {
                            // onLoad replacement for SSR
                            if (!input) { return; }
                            const img = input;

                            const updateFunc = () => {
                                this.setState({ loaded: true });
                            };
                            img.onload = updateFunc;
                            if (img.complete) {
                                handleLoad();
                            }
                            img.onload = null
                        }} 
                        src={process.env.NEXT_PUBLIC_API_URL + featureImgUrl}
                        alt="Feature Image" onLoad={() => handleLoad()} 
                        loading="lazy"
                    />
                </StyledPicture>
                } 
            </StyledImageWrapper>
        </FeatureImageWrapper>
    )

}

export default FeatureImage;
