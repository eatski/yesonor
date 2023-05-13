import Head from 'next/head'
import { texts } from '@/texts';
import { Layout } from '@/features/layout';
import { Landing } from '@/features/landing';
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
    count: 5
  })
  return {
    props: {
      stories: stories.map(({id,title,quiz}) => ({
              id,
              title,
              quiz,
              url: `/stories/${id}`
          }))
      
      },
      revalidate: 60 * 60
  }
}

export default function Home(props: Props) {
  return (
    <>
      <Layout>
        <div style={{"marginBottom": "132px"}}>
          <Landing />
        </div>
        <H2 label='新着'/>
        <Stories stories={props.stories}/>
      </Layout> 
    </>
  )
}
