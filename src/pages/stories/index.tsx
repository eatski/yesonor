import { Layout } from '@/features/layout';
import { GetStaticProps } from 'next';
import { PrismaClient } from '@prisma/client';
import { Stories } from '@/features/stories';
import { ListHead } from '@/features/listHead';

type Props = {
    stories: {
        id: number;
        title: string;
        quiz: string;
    }[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const prisma = new PrismaClient();
    const stories = await prisma.story.findMany();
    return {
      props: {
        stories: stories.map(({id,title,quiz}) => ({
                id,
                title,
                quiz
            }))
        
        },
        revalidate: 60 * 60 * 24
    }
}

export default function Story(props: Props) {
    return <Layout>
        <main>
            <ListHead />
            <Stories stories={props.stories} />
        </main>
    </Layout>
}