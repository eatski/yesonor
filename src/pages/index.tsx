import Head from 'next/head'
import { texts } from '@/texts';
import { Layout } from '@/features/layout';
import { Landing } from '@/features/landing';
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
    count: 5
  })
  return {
    props: {
      stories: stories.map(({id,title,quiz}) => ({
              id,
              title,
              quiz
          }))
      
      },
      revalidate: 60 * 60
  }
}

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>{`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`}</title>
        <meta name="description" content={texts.serviceDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div style={{"marginBottom": "60px"}}>
          <Landing />
        </div>
        
        <ListHead />
        <Stories stories={props.stories}/>
      </Layout> 
    </>
  )
}
