import Markdown from "react-markdown";
import { MarkdownContentProps } from "../types";

export default function MarkdownContent({
  markdown_content,
}: MarkdownContentProps) {
  return <Markdown>{markdown_content}</Markdown>;
}
