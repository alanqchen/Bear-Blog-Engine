import Link from 'next/link';
import { PostCard } from './PostCard/postCard';
import { PostCardLink } from './pageStyled';

function Pagination({posts}) {
    return (
        <>
            {posts.map(post => (
            <React.Fragment key={post.id}>
                <Link href="/[year]/[month]/[slug]" as={`/${post.slug}`} passHref>
                    <PostCardLink post={post}>
                        <PostCard post={post} skeleton={false}></PostCard>
                    </PostCardLink>
                </Link>
            </React.Fragment>
            ))}
        </>
    );
}
export default Pagination;
