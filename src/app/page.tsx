'use client'

import Image from "next/image";
import { CodeMockup } from "react-daisyui";
import ChatBox from "./components/ChatBox";

export default function Home() {


    return (
		<main className="h-[100vh] bg-gray-800">
			{/* <h1 className="text-center py-10">AI Chat Games</h1>
			<div className="rounded-2xl mx-auto w-[90vw] h-full flex flex-col gap-5">
				<CodeMockup className="shadow-2xl">
					<CodeMockup.Line>New user: Emanuel</CodeMockup.Line>
					<CodeMockup.Line className="text-warning">connecting...</CodeMockup.Line>
					<CodeMockup.Line className="text-success">Done!</CodeMockup.Line>
				</CodeMockup>
				<CodeMockup className="shadow-2xl">
					<CodeMockup.Line>New user: Emanuel</CodeMockup.Line>
					<CodeMockup.Line className="text-warning">connecting...</CodeMockup.Line>
					<CodeMockup.Line className="text-success">Done!</CodeMockup.Line>
				</CodeMockup>
			</div> */}
			<ChatBox />
		</main>
	);
}
