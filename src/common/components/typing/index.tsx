import { useState, useEffect } from "react";

interface TypingTextProps {
	children: string;
	onTypingEnd?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({
	children: text,
	onTypingEnd,
}) => {
	const [displayedText, setDisplayedText] = useState<string>("");

	useEffect(() => {
		let currentText = "";
		const characters = text.split("");
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

	return displayedText === text ? (
		<span>{displayedText}</span>
	) : (
		<span role="img" aria-label={text}>
			{displayedText}
		</span>
	);
};
