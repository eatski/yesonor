import { Layout } from '@/features/layout';
import { GetStaticProps } from 'next';
import { Stories } from '@/features/stories';
import { ListHead } from '@/features/listHead';
import { getStories } from '@/server/services/story';

type Props = {
    stories: {
        id: number;
        title: string;
        quiz: string;
    }[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const stories = await getStories({
        count: 20
    });
    return {
      props: {
        stories: stories.map(({id,title,quiz}) => ({
                id,
                title,
                quiz
            }))
        
        },
        revalidate: 60 * 5
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