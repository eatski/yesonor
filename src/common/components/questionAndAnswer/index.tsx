import { useEffect, useState } from "react";
import { AiFillRobot, AiOutlineComment } from "react-icons/ai"
import styles from "./styles.module.scss"

type Props = {
    question: string,
    answer: string | null | undefined,
    onQuestionTypingEnd?: () => void;
}

interface TypingTextProps {
  children: string;
  onTypingEnd?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ children:text, onTypingEnd }) => {
  const [displayedText, setDisplayedText] = useState<string>('');

  useEffect(() => {
    let currentText = '';
    const characters = text.split('');
    const typingInterval = setInterval(() => {
      if (characters.length === 0) {
        clearInterval(typingInterval);
        if (onTypingEnd) {
          onTypingEnd();
        }
        return;
      }

      const nextCharacter = characters.shift()!;
      currentText += nextCharacter;
      setDisplayedText(currentText);
    }, 50);

    return () => clearInterval(typingInterval);
  }, [text, onTypingEnd]);

  return <span role="img" aria-label={text}>{displayedText}</span>;
};

export const QuestionAndAnswer: React.FC<Props> = (props) => {

    return  <dl className={styles.container}>
      <div className={styles.row}>
          <dt><AiOutlineComment role="img" aria-label="あなたの質問"/></dt>
          <dd className={styles.question}><TypingText onTypingEnd={props.onQuestionTypingEnd}>{props.question}</TypingText></dd>
      </div>
      <hr role="presentation" />
      <div className={styles.row} data-status={
        props.answer === undefined ? "idle" : 
        props.answer === null ? "loading" : "success"
      }>
          <dt><AiFillRobot role="img" aria-label="AIからの回答"/></dt>
          <dd>{!props.answer ? "考え中..." : <TypingText>{props.answer}</TypingText>}</dd>
      </div>
  </dl>
}