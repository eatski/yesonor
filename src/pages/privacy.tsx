import { readFile } from 'fs/promises';
import { GetServerSideProps } from 'next';
import { resolve } from 'path';
import ReactMarkdown from 'react-markdown';

type Props = {
    privacyMarkdown: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const terms = await readFile(resolve(process.cwd(), "docs","privacy.md"), "utf-8");
    return {
        props: {
            privacyMarkdown: terms
        }
    }
}

export default function Privacy(props: Props) {
    return <ReactMarkdown>{props.privacyMarkdown}</ReactMarkdown>
}