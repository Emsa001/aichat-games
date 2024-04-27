import { CodeMockup } from "react-daisyui";

export default function UsersList({users }:{users: string[]}) {
    console.log(users)
    return (
        <div>
            <CodeMockup className="w-full">
                <CodeMockup.Line status="info">Users: {users?.length}</CodeMockup.Line>
                {users?.map((user: any) => (
                    <CodeMockup.Line key={user}>{user}</CodeMockup.Line>
                ))}
            </CodeMockup>
        </div>
    );
}
