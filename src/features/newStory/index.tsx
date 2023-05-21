import { trpc } from '@/libs/trpc';
import React from 'react';
import { useRouter } from 'next/router';
import { StoryForm } from '../storyForm';
import { H2 } from '@/common/components/h2';
import Link from 'next/link';
import components from '@/styles/components.module.scss';
import { AiOutlineUpload } from 'react-icons/ai';
import styles from './styles.module.scss';

export const NewStory: React.FC = () => {
    const { mutate,isError,isLoading } = trpc.post.useMutation();
    const router = useRouter();

    return <>
        <H2>新しいストーリーを投稿</H2>
        <div className={styles.navigation}>
            <Link href="/stories/newYaml" className={components.buttonPure}>
                <AiOutlineUpload />
                YAMLファイルをアップロードして投稿する
            </Link>
        </div>
        <StoryForm onSubmit={(input) => {
            mutate(input, {
                onSuccess: (e) => {
                    router.push(`/my/stories/${e.id}`);
                }
            });
        }} isLoading={isLoading} isError={isError}  />
    </>;
};
