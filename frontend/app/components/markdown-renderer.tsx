import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

interface MarkdownFromUrlProps {
  url: string;
}

const MarkdownFromUrl: React.FC<MarkdownFromUrlProps> = ({ url }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        console.log(url);
        //console.log(data);
        setMarkdown(data);
      })
      .catch((error) => {
        console.error("Error fetching Markdown data:", error);
      });
  }, [url]);

  return <Markdown>{markdown}</Markdown>;
};

export default MarkdownFromUrl;