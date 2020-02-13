import Link from 'next/link';
import Layout from '../components/publicLayout';

export default function Index() {
    return (
      <div>
        <Layout>
            <Link href="/about"><a title="About page">Goto About</a></Link>
            <p>Hello Next.js!</p>
            <Link href="/[slug]"><a>To post</a></Link>
        </Layout>
      </div>
    );
}
