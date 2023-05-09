import { Layout } from '@/features/layout';
import { GetStaticProps } from 'next';
import { Stories } from '@/common/components/stories';
import { H2 } from '@/common/components/h2';
import { getStories } from '@/server/services/story';

type Props = {
    stories: {
        id: number;
        title: string;
        quiz: string;
        url: string;
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
                quiz,
                url: `/stories/${id}`
            }))
        },
        revalidate: 60 * 5
    }
}

export default function Story(props: Props) {
    return <Layout>
        <main>
            <H2 label='ストーリーを探す'/>
            <Stories stories={props.stories} />
        </main>
    </Layout>
}