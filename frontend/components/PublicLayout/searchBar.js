import { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { Divider, Typography, Collapse } from '@material-ui/core';
import {
    StyledSearchBase,
    StyledSearchPaper,
    SearchItemWrapper
} from './publicLayoutStyled';
import { debounce, join } from 'lodash';

function SearchBar() {

    const [searchRes, setSearchRes] = useState([]);
    const [collapse, setCollapse] = useState(true);

    const fetchResult = debounce(async(value) => {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts/search' + '?title=' + value)
        .then(res => res.json())
        .then(json => {
            if(json.success) {
                setSearchRes(json.data);
            } else {
                console.log(json.message);
            }
            return json;
        })
        .catch(() => {console.log("Error searching")});
    }, 350);

    const handleChange = async(value) => {

        if(!value) {
            setCollapse(true);
            setSearchRes([]);
            return;
        }

        setCollapse(false);
        await fetchResult(value);
        
    };

    return (
        <>
            <StyledSearchPaper elevation={3} style={{maxHeight: searchRes ? "450px" : "40px"}}>
                <StyledSearchBase cancelOnEscape={true} onChange={(value) => handleChange(value)} onCancelSearch={() => setSearchRes([])}/>
                <Collapse in={!collapse}>
                    {searchRes.map(post => (
                        <React.Fragment key={post.id}>
                            <Divider />
                            <Link href="/[year]/[month]/[slug]" as={`/${post.slug}`} passHref>
                                <SearchItemWrapper>
                                    <Typography component="h3" variant="h5">
                                        {post.title}
                                    </Typography>
                                    <Typography component="p" variant="caption" color="textSecondary">
                                        {join(post.tags, " ")}
                                    </Typography>
                                </SearchItemWrapper>
                            </Link>
                        </React.Fragment>
                    ))}
                </Collapse>
            </StyledSearchPaper>
        </>
    );
}

export default SearchBar;
