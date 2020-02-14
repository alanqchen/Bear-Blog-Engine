import Link from 'next/link';

const PostLink = props => (
  <li>
    <Link href="/[slug]" as={`/${props.slug}`}>
      <a>{props.id}</a>
    </Link>
  </li>
);

export default PostLink;