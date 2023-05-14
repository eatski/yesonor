import { Layout } from '@/rsc/layout';
import { Landing } from '@/features/landing';
import { Stories } from '@/common/components/stories';
import { H2 } from '@/common/components/h2';
import { getStories } from '@/server/services/story';
import { revalidateTime } from '@/common/revalidate';
import { RecommendCreateStory } from '@/features/recommendCreateStory';
import { cache } from 'react';

export const revalidate = revalidateTime.short;

const getStoriesForPage = cache(async () => {
    const storiesData = await getStories({
        count: 5
  })
  return storiesData.map(({id,title,quiz}) => ({
    id,
    title,
    quiz,
    url: `/stories/${id}`
}))
})

export default async function Home() {
  
  return (
    <>
      <Layout>
        <div style={{"marginBottom": "132px"}}>
          <Landing />
        </div>
        <div style={{"marginBottom": "24px"}}>
          <H2 label='新着ストーリー'/>
          <Stories stories={await getStoriesForPage()}/>
        </div>
        <RecommendCreateStory />
      </Layout> 
    </>
  )
}
