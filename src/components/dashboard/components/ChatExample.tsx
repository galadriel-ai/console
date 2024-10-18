import {useChat} from "@ai-sdk/react";
import {getIcon} from "@/components/Icons";
import {Message} from "ai";
import {useState} from "react";
import ReactMarkdown from "react-markdown";

export function ChatExample() {

  const {messages, input, setInput, append, setMessages} = useChat({
    api: "/api/completion",
  });


  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: send chat
    sendChat(input)
  };

  const sendChat = async (inputMessage: string) => {
    try {
      // Automagically streams response to "messages"
      setInput("")
      await append({content: inputMessage, role: 'user'});
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
  }

  const onClearChat = () => {
    setMessages([])
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        data-ph-capture-attribute-form-name="login"
        data-ph-capture-attribute-login-username={input}
      >
        <div className={"gal-text-secondary"}>Try it out!</div>
        <div className={"w-full relative"}>
          <input
            type="text"
            placeholder="Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-4 py-2 w-full text-black"
          />
          <div
            className={"absolute p-2 top-1/2 right-2 transform -translate-y-1/2 z-2 cursor-pointer gal-group flex items-center"}>
            <button type="submit">
              {getIcon("submit")}
            </button>
          </div>
        </div>
      </form>
      <div className={"mt-4 flex flex-col gap-4 md:max-h-[500px] md:overflow-y-auto"}>
        {messages
          .reduce((result: Message[][], message: Message, index: number) => {
            if (index % 2 === 0) {
              result.push([message]);
            } else {
              result[result.length - 1].push(message);
            }
            return result;
          }, [])
          // Reverse the pairs
          .reverse()
          // Flatten and map through the messages to render them
          .flat()
          .map((message: FlatArray<Message, number>, index: number) => (
            <div key={index}>
              {message.role === "user" ?
                <div className={"gal-text"}>
                  {message.content}
                </div>
                :
                <AssistantMessage content={message.content}/>
              }
            </div>
          ))}
      </div>
      <div
        className={"gal-link pt-2 flex self-end"}
        onClick={onClearChat}
      >
        Clear chat
      </div>
    </>
  )
}

function AssistantMessage({content}: { content: string }) {

  const [isCopyActive, setIsCopyActive] = useState<boolean>(false)
  const onCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setIsCopyActive(true)
    try {
      setTimeout(() => {
        setIsCopyActive(false);
      }, 3000);
    } catch {
    }
  }

  return (
    <div className={"pt-4"}>
      <div className={"border-l-2 pl-4 flex flex-col gap-2"}>
        <div>
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
        {content &&
          <div
            className={"p-2 pl-0 cursor-pointer flex w-fit"}
            onClick={onCopy}
          >
            {isCopyActive ?
              <div className={"flex"}>
                {getIcon("check")}
              </div>
              :
              <div>
                {getIcon("copy")}
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}