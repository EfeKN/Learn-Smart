import { MarkdownContentParameters } from "@/app/types";
import Markdown from "react-markdown";

export default function MarkdownContent({
  markdown_content,
}: MarkdownContentParameters) {
  return <Markdown>{markdown_content}</Markdown>;
}
