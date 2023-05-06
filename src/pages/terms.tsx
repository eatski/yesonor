import { readFile } from 'fs/promises';
import { GetServerSideProps } from 'next';
import { resolve } from 'path';
import ReactMarkdown from 'react-markdown';

type Props = {
    termsMarkdown: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const terms = await readFile(resolve(process.cwd(), "docs","terms.md"), "utf-8");
    return {
        props: {
            termsMarkdown: terms
        }
    }
}

export default function Terms(props: Props) {
    return <ReactMarkdown>{props.termsMarkdown}</ReactMarkdown>
}