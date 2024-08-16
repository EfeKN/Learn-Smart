import { QuizCardProps } from "../types";
import { FaClipboardList } from "react-icons/fa";

export default function QuizCard({
    quizName,
    chatTitle,
		onClick
  }: QuizCardProps) {
	return (
		<div
			onClick={onClick} // Attach onClick to the card
			className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
		>
			<div className="bg-black p-3 rounded-full mb-4">
			<FaClipboardList className="text-3xl text-white" />
			</div>
			<div className="text-center">
				<h3 className="text-xl font-medium mb-2 text-black">{quizName}</h3>
				<p className="text-md font-light text-gray-700 mb-2">{chatTitle}</p>
			</div>
		</div>
	);
};
