import React from "react";
import Markdown from "react-markdown";

interface MarkdownContentParameters {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentParameters> = ({ content }) => {
  return <Markdown>{content}</Markdown>;
};

export default MarkdownContent;

// Example usage: <MarkdownContent content="# Hello, Markdown!" />
