import Head from 'next/head'
import { texts } from '@/texts';
import { Layout } from '@/features/layout';
import { Landing } from '@/features/landing';
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
  const stories = await prisma.story.findMany({
    take: 5
  });
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
