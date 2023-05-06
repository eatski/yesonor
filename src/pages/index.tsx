import Head from 'next/head'
import { texts } from '@/texts';
import { Layout } from '@/features/layout';
import { Landing } from '@/features/landing';

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${texts.serviceName}(${texts.serviceNickname}) - ${texts.serviceDescription}`}</title>
        <meta name="description" content={texts.serviceDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Landing />
      </Layout> 
    </>
  )
}
