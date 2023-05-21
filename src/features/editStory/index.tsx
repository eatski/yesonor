import { trpc } from '@/libs/trpc';
import React from 'react';
import { useRouter } from 'next/router';
import { StoryForm } from '../storyForm';
import { StoryInit } from '@/server/services/story/schema';
import { H2 } from '@/common/components/h2';

export type Props = {
    storyId: string;
    story: StoryInit;
}

export const EditStory: React.FC<Props> = ({ storyId, story }) => {
    const { mutate, isError, isLoading } = trpc.put.useMutation();
    const router = useRouter();
    return <>
        <H2>{story.title}</H2>
        <StoryForm
            storyInit={story}
            onSubmit={(input) => {
                mutate({
                    id: storyId,
                    story: input
                }, {
                    onSuccess: () => {
                        router.push(`/my/stories/${storyId}`);
                    }
                });
            }}
            isLoading={isLoading}
            isError={isError}
        />
    </>;
};
