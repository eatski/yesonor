import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './styles.module.scss';
import components from '@/styles/components.module.scss';
import { AiFillPlayCircle, AiOutlineMinusCircle, AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';
import { z } from 'zod';
import { storyInit } from '@/server/services/story/schema';

type StoryInit = z.infer<typeof storyInit>;

export type Props = {
    storyInit?: StoryInit,
    onSubmit: (data: StoryInit) => void,
    isLoading: boolean,
    isError: boolean,
}

export const StoryForm: React.FC<Props> = ({onSubmit,isError,isLoading,storyInit: story}) => {
    const { register, control, handleSubmit, formState: { errors } } = useForm<StoryInit>({
        defaultValues: story ?? {
            title: '',
            quiz: '',
            truth: '',
            simpleTruth: '',
            questionExamples: [
                { question: '', answer: "True", supplement: '' },
                { question: '', answer: "False", supplement: '' },
                { question: '', answer: "Unknown", supplement: '' },
            ],
        },
        resolver: zodResolver(storyInit),
    });

    const { fields, append, remove } = useFieldArray<StoryInit>({
        control,
        name: 'questionExamples',
    });

    return (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
            {isError && <p className={styles.error}>エラーが発生しました</p>}
            <div className={styles.upperMenu}>
                <button disabled={isLoading} type="submit" className={components.button}>
                    <span>
                        テストプレイ
                    </span>
                    <AiFillPlayCircle />
                </button>
            </div>
            <div className={styles.field}>
                <label>
                    タイトル
                    <input 
                        {...register('title')} 
                        placeholder='例: 太郎さんのメガネ' 
                        className={components.input}
                    />
                    {errors.title && <p>{errors.title.message}</p>}
                </label>
            </div>
            <div className={styles.field}>
                <label>
                    問題文
                    <textarea 
                        {...register('quiz')} 
                        placeholder='例: 太郎さんは視力がとてもいいのにメガネをかけている。なぜか？' 
                        className={components.textarea}
                    />
                    {errors.quiz && <p>{errors.quiz.message}</p>}
                </label>
            </div>
            <div className={styles.field}>
                <label>
                    真相
                    <p className={styles.description}>
                        AIは質問に対する回答を生成する際にこの文章を参照します。そのため、真相は詳細まで記述することをお勧めします。
                    </p>
                    <textarea 
                        {...register('truth')} 
                        placeholder='例: 太郎さんはオシャレ好きであり、おしゃれのために伊達メガネをかけている。'
                        className={components.input}
                    />
                    {errors.truth && <p>{errors.truth.message}</p>}
                </label>
            </div>
            <div className={styles.field}>
                <label>
                    簡潔な真相
                    <p className={styles.description}>
                        この文章はAIが回答者の解答を判定する際に使用します。詳細に説明しすぎると、AIに回答者の解答が「情報が不足している」と判断されてしまうため、<strong>真相の核心を最低限の言葉で</strong>記述してください。
                    </p>
                    <textarea 
                        {...register('simpleTruth')}
                        placeholder='例: 太郎さんは伊達メガネをかけている。' 
                        className={components.input}
                    />
                    {errors.simpleTruth && <p>{errors.simpleTruth.message}</p>}
                    
                </label>
            </div>
            <fieldset>
                <legend>質問の例を教えてください。</legend>
                <p className={styles.description}>
                    AIは質問に対する回答を生成する際にこれらを参照するため、より多くの例を参照させることで解答の精度が上がります。<br />
                    AIが最低限有用な回答を返せるようにするために3つ以上（答えが「はい」「いいえ」「わからない」の質問を1つずつ）の例を記述してください。<br />
                </p>
                {
                    errors.questionExamples && <p className={styles.error}>{errors.questionExamples.message}</p>
                }
                {fields.map((_, index) => (
                    <div key={index} className={styles.questionExampleItem}>
                        <div className={styles.questionExampleHead}>
                            Q{index + 1}
                            {index > 0 ? <button type="button" onClick={() => remove(index)}>
                                <AiOutlineMinusCircle className={components.iconButtonDanger} />
                            </button> : null}
                        </div>
                        <div className={styles.field}>
                            <label>
                                質問
                                <input 
                                    {...register(`questionExamples.${index}.question`)}
                                    placeholder='例: 太郎さんは男ですか？' 
                                    className={components.input}
                                />
                                {errors.questionExamples && errors.questionExamples[index]?.question && <p>{errors.questionExamples[index]?.question?.message}</p>}
                            </label>
                        </div>
                        <div className={styles.field}>
                            <label>
                                回答
                                <Controller
                                    name={`questionExamples.${index}.answer`}
                                    control={control}
                                    render={({ field }) => (
                                        <div className={components.selectWrapper}>
                                            <select 
                                                {...field}
                                            >
                                                <option value="True">はい</option>
                                                <option value="False">いいえ</option>
                                                <option value="Unknown">わからない（言及されてない・真相には関係ない）</option>
                                            </select>
                                        </div>
                                    )}
                                />
                            </label>
                        </div>
                        <div className={styles.field}>
                            <label>
                                補足説明
                                <input 
                                    {...register(`questionExamples.${index}.supplement`)}
                                    placeholder='例: 太郎さんの性別については言及されていません。' 
                                    className={components.input}
                                />
                                {errors.questionExamples && errors.questionExamples[index]?.supplement && <p>{errors.questionExamples[index]?.supplement?.message}</p>}
                            </label>
                        </div>
                    </div>
                ))}
                <div className={styles.questionExampleFoot}>
                    <button type="button" onClick={() => append({ question: '', answer: "Unknown", supplement: '' })}>
                        <AiOutlinePlus className={components.iconButtonLink} />
                    </button>
                </div>
            </fieldset>
        </form>
    );
};
