import { Markdown } from '@/common/components/markdown';
import { Layout } from '@/features/layout';
import { readFile } from 'fs/promises';
import { GetStaticPaths, GetStaticProps } from 'next';
import { resolve } from 'path';
import ReactMarkdown from 'react-markdown';

type Props = {
    markdown: string;
}

type Params = {
    markdownName: string;
}

export const getStaticProps: GetStaticProps<Props,Params> = async ({params}) => {
    if(!params){
        throw new Error("params not found");
    }
    const markdown = await readFile(resolve(process.cwd(), "docs",`${params.markdownName}.md`), "utf-8");
    return {
        props: {
            markdown
        }
    }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
    return {
        paths: [
            {
                params: {
                    markdownName: "privacy"
                },
            },
            {
                params: {
                    markdownName: "terms"
                },
            },
            {
                params: {
                    markdownName: "about"
                }
            }
        ],
        fallback: false
    }
}

export default function MarkdownDocumentPage({markdown}: Props) {
    return <Layout>
        <Markdown source={markdown}/>
    </Layout>
}    