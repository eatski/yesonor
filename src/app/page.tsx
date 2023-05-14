import { Layout } from '@/rsc/layout';
import { Landing } from '@/features/landing';
import { Stories } from '@/common/components/stories';
import { H2 } from '@/common/components/h2';
import { getStories } from '@/server/services/story';
import { revalidateTime } from '@/common/revalidate';
import { RecommendCreateStory } from '@/features/recommendCreateStory';

export const revalidate = revalidateTime.short;

export default async function Home() {
  const storiesData = await getStories({
        count: 5
  })
  const stories = storiesData.map(({id,title,quiz}) => ({
    id,
    title,
    quiz,
    url: `/stories/${id}`
}))
  return (
    <>
      <Layout>
        <div style={{"marginBottom": "132px"}}>
          <Landing />
        </div>
        <div style={{"marginBottom": "24px"}}>
          <H2 label='新着ストーリー'/>
          <Stories stories={stories}/>
        </div>
        <RecommendCreateStory />
      </Layout> 
    </>
  )
}
