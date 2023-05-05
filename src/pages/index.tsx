import Head from 'next/head'
import { Inter } from 'next/font/google'
import { trpc } from '@/libs/trpc'
import { texts } from '@/texts';
import { Layout } from '@/features/layout';
import { Landing } from '@/features/landing';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {mutate,data} = trpc.hello.useMutation();
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
