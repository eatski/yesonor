import { trpc } from '@/libs/trpc';
import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import styles from './styles.module.scss';
import components from '@/styles/components.module.scss';
import { AiOutlineMinusCircle } from 'react-icons/ai';

type Answer = 'True' | 'False' | 'Unknown' | 'Invalid';

interface QuestionExample {
  question: string;
  answer: Answer;
  supplement: string;
}

interface StoryInit {
  title: string;
  quiz: string;
  truth: string;
  simpleTruth: string;
  questionExamples: QuestionExample[];
}

export const NewStory: React.FC = () => {
  const {mutate} = trpc.post.useMutation();
  const { register, control, handleSubmit } = useForm<StoryInit>({
    defaultValues: {
      title: '',
      quiz: '',
      truth: '',
      simpleTruth: '',
      questionExamples: [{ question: '', answer: "Unknown", supplement: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray<StoryInit>({
    control,
    name: 'questionExamples',
  });

  const onSubmit = (data: StoryInit) => {
    mutate(data);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <label>
        タイトル
        <input {...register('title')} />
      </label>
      <label>
        問題文
        <textarea {...register('quiz')} />
      </label>
      <label>
        真相
        <textarea {...register('truth')} />
      </label>
      <label>
        簡潔な真相
        <textarea {...register('simpleTruth')} />
      </label>
      <fieldset>
        <legend>質問の例を教えてください。</legend>
        {fields.map((_, index) => (
            <div key={index} className={styles.questionExampleItem}>
                <div className={styles.questionExampleHead}>
                    Q{index + 1}
                    { index > 0 ? <button type="button" onClick={() => remove(index)}>
                        <AiOutlineMinusCircle className={components.iconButtonDanger} />
                    </button> : null}
                </div>
                <label>
                    質問
                    <input {...register(`questionExamples.${index}.question`)} />
                </label>
                <label>
                    回答
                    <Controller
                    name={`questionExamples.${index}.answer`}
                    control={control}
                    render={({ field }) => (
                        <div className={styles.selectWrapper}>
                            <select {...field}>
                                <option value="True">はい</option>
                                <option value="False">いいえ</option>
                                <option value="Unknown">わからない（言及されてない・真相には関係ない）</option>
                            </select>
                        </div>
                    )}
                    />
                </label>
                <label>
                    補足説明
                    <input {...register(`questionExamples.${index}.supplement`)} />
                </label>
                
            </div>
        ))}
        <div className={styles.questionExampleFoot}>
            <button className={components.button}  type="button" onClick={() => append({ question: '', answer: 'True', supplement: '' })}>
                質問の例を追加
            </button>
        </div>
       
      </fieldset>
      <div className={styles.buttonsRow}>
        <button className={components.button} type="submit">作成</button>
      </div>
     
    </form>
  );
};
