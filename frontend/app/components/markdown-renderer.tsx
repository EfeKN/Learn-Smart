import Markdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return <Markdown>{content}</Markdown>;
};

export default MarkdownContent;
