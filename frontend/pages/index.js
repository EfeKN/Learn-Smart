import { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const sendPrompt = async () => {
        setResponse('');
        const responseElement = document.getElementById('response');

        const res = await fetch('http://localhost:8000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value, { stream: true });
            setResponse((prev) => prev + chunkValue);
            const sanitizedHTML = DOMPurify.sanitize(marked(chunkValue));
            responseElement.innerHTML += sanitizedHTML;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Ask Gemini</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Enter your prompt here..."
                style={{ display: 'block', marginBottom: '20px' }}
            />
            <button onClick={sendPrompt} style={{ marginBottom: '20px' }}>Generate</button>
            <h2>Response:</h2>
            <div id="response" style={{ whiteSpace: 'pre-wrap' }}></div>
        </div>
    );
}

