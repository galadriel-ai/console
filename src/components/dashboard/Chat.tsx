import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useState} from "react";
import {getIcon} from "@/components/Icons";
import {useCompletion} from "@ai-sdk/react";

interface Props {
  onRunNode: () => void
}

export function Chat({onRunNode}: Props) {

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
          <div className={"flex flex-row justify-center"}>
            <button className={"gal-button gal-button-primary"} onClick={onRunNode}>Run a node</button>
          </div>
        </div>
      </div>
    </DashboardContent>
  )
}

function InputForm() {

  const {completion, complete} = useCompletion({
    api: "/api/completion",
  });

  const [message, setMessage] = useState<string>("");
  const [displayMessage, setDisplayMessage] = useState<string>("");
  const [isCleared, setIsCleared] = useState<boolean>(false);

  const [isCopyActive, setIsCopyActive] = useState<boolean>(false)
  const onCopy = async () => {
    if (!completion) return
    await navigator.clipboard.writeText(completion)
    setIsCopyActive(true)
    try {
      setTimeout(() => {
        setIsCopyActive(false);
      }, 3000);
    } catch {
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: send chat
    sendChat(message)
  };

  const sendChat = async (inputMessage: string) => {
    try {
      setDisplayMessage(inputMessage)
      // Automagically streams response to "completion"
      setIsCleared(false)
      await complete(inputMessage)
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
  }

  const onClearChat = () => {
    setIsCleared(true)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 relative"
        data-ph-capture-attribute-form-name="login"
        data-ph-capture-attribute-login-username={message}
      >
        <div className={"gal-subtitle"}>Try it out!</div>
        <div className={"relative w-full"}>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
        <div className={"gal-text"}>
          {!isCleared && displayMessage}
        </div>
        <div className={"pt-4"}>
          <div className={"border-l-2 pl-4 flex flex-col gap-2"}>
            <div>
              {!isCleared && completion}
            </div>
            {(!isCleared && completion) &&
              <div className={"pt-4"}>
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
              </div>
            }
          </div>
        </div>
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