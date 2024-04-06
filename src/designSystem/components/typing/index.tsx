import { useState, useEffect, useRef } from "react";

/**
 * モバイル端末で一瞬だけ別の文字が引数として渡されてしまう問題を解決するためのカスタムフック
 * @param original 元の文字
 * @returns 変更をdebounceした文字
 */
export const useStableText = (original: string) => {
	const [stableText, setStableText] = useState(original);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timeoutId.current !== null) {
			clearTimeout(timeoutId.current);
		}

		timeoutId.current = setTimeout(() => {
			setStableText(original);
		}, 3);

		return () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
		};
	}, [original]);

	return stableText;
};

interface TypingTextProps {
	children: string;
	onTypingEnd?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({
	children: text,
	onTypingEnd,
}) => {
	const stableText = useStableText(text);
	const [displayedText, setDisplayedText] = useState<string>("");

	useEffect(() => {
		let currentText = "";
		const characters = stableText.split("");
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
	}, [stableText, onTypingEnd]);

	return displayedText === stableText ? (
		<span>{displayedText}</span>
	) : (
		<span role="img" aria-label={text}>
			{displayedText}
		</span>
	);
};
