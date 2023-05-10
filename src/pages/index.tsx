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
      <Head>
        <title>{`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`}</title>
        <meta name="description" content={texts.serviceDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div style={{"marginBottom": "120px"}}>
          <Landing />
        </div>
        <H2 label='ストーリーを探す'/>
        <Stories stories={props.stories}/>
      </Layout> 
    </>
  )
}
