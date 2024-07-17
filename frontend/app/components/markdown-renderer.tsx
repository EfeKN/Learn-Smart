import React from 'react'
import Markdown from 'react-markdown'
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
// import myMarkDownFile from 'raw-loader!./help.md';

const markdown = '# Hi, *Pluto*!'

export default function App() {
    return (
        <div className="bg-transparent">
            <Markdown>{markdown}</Markdown>
        </div>
    );
}