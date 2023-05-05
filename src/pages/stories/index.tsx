import { Layout } from '@/features/layout';
import { GetServerSideProps } from 'next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

type Props = {
    stories: {
        id: number;
        title: string;
    }[]
}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const prisma = new PrismaClient();
    const stories = await prisma.story.findMany();
    return {
      props: {
        stories: stories.map(({id, title}) => ({
                id,
                title
            }))
        }
    }
}

export default function Story(props: Props) {
    return <Layout>
        <main>
            <h2>リスト</h2>
            <ul>
                {
                    props.stories.map(({id, title}) => <li key={id}><a href={`/stories/${id}`}>{title}</a></li>)
                }
            </ul>
        </main>
    </Layout>
}