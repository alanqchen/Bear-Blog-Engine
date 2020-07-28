import { useState } from 'react';
import Link from 'next/link';
import { PostCard } from './PostCard/postCard';
import { PostCardLink, LoadingProgress } from './pageStyled';

function Pagination({posts}) {

    const [loading, setLoading] = useState(false);

    return (
        <>
            {posts.map(post => (
            <React.Fragment key={post.id}>
                <Link href="/[year]/[month]/[slug]" as={`/${post.slug}`} passHref>
                    <PostCardLink post={post} onClick={() => setLoading(true)}>
                        <PostCard post={post} skeleton={false}></PostCard>
                    </PostCardLink>
                </Link>
            </React.Fragment>
            ))}
        </>
    );
}
export default Pagination;
