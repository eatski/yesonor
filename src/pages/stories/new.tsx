import { H2 } from "@/common/components/h2";
import { Layout } from "@/features/layout";
import { NewStory } from "@/features/newStory";
export default function NewStoryPage() {

    return (
        <Layout>
            <H2>新しいストーリーを投稿</H2>
            <NewStory />
        </Layout>
    );
}
