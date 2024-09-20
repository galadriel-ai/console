import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useState} from "react";
import {getIcon} from "@/components/Icons";
import {useChat} from "@ai-sdk/react";
import {Message} from "ai";

interface Props {
  onRunNode: () => void
}

export function Chat({}: Props) {

  return (
    <DashboardContent>
      <Title>Chat</Title>
      <div className={"pt-10 gal-text-secondary max-w-4xl"}>
        Fast & low-cost distributed LLMs.
      </div>
      <div className={"pt-8"}>
        <div
          className={"py-8 px-8 flex flex-col gap-8 gal-card max-w-[600px] min-w-[300px]"}
        >
          <InputForm/>
          {/*<div className={"flex flex-row justify-center"}>*/}
          {/*  <button className={"gal-button gal-button-primary"} onClick={onRunNode}>Run a node</button>*/}
          {/*</div>*/}
        </div>
      </div>
    </DashboardContent>
  )
}

function InputForm() {

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
        className="flex flex-col gap-4 relative"
        data-ph-capture-attribute-form-name="login"
        data-ph-capture-attribute-login-username={input}
      >
        <div className={"gal-subtitle"}>Try it out!</div>
        <div className={"relative w-full"}>
          <input
            type="text"
            placeholder="Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-4 py-2 w-full text-black"
          />
          <div className={"absolute p-2 top-1/2 right-2 transform -translate-y-1/2 z-2 cursor-pointer gal-group"}>
            <button type="submit">
              {getIcon("submit")}
            </button>
          </div>
        </div>
      </form>
      <div className={"pt-4 flex flex-col gap-4"}>
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
        <div
          className={"gal-link pt-2 flex self-end"}
          onClick={onClearChat}
        >
          Clear chat
        </div>
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
          {content}
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
