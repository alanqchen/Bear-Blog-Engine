import Link from 'next/link';
import Header from '../components/Header/header';

export default function About() {
    return (
        <div>
            <Header/>
            <Link href="/"><a>Goto Index</a></Link>
            <p>Hello Next.js!</p>
        </div>
    );
}