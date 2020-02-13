import Link from 'next/link';

export default function About() {
    return (
      <div>
        <Link href="/"><a>Goto Index</a></Link>
        <p>This is a post!</p>
      </div>
    );
}