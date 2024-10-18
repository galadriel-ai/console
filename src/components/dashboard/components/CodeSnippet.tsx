import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SyntaxHighlighter from "react-syntax-highlighter";
import {idea} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {useState} from "react";
import {getIcon} from "@/components/Icons";

interface Props {
  isLoading: boolean
  apiKey: string
}


export function CodeSnippet({isLoading, apiKey}: Props) {

  const PYTHON: string = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.galadriel.com/v1",
    api_key="${apiKey || "<GALADRIEL_API_KEY>"}",
)

completion = client.chat.completions.create(
    model="llama3.1",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)

print(completion.choices[0].message)
`

  const JAVASCRIPT: string = `import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "${apiKey || "<GALADRIEL_API_KEY>"}",
  baseURL: "https://api.galadriel.com/v1"
});

const completion = await openai.chat.completions.create({
  model: "llama3.1",
  messages: [
    {role: "system", content: "You are a helpful assistant."},
    {
      role: "user",
      content: "Hello!",
    },
  ],
});

console.log(completion.choices[0].message);`

  const CURL: string = `curl -X 'POST' \\
  'https://api.galadriel.com/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer ${apiKey || "<GALADRIEL_API_KEY>"}' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "llama3.1",
  "messages": [
    {
      "content": "You are a helpful assistant.",
      "role": "system"
    },
    {
      "content": "Hello!",
      "role": "user"
    }
  ]
}'
`
  const [selectedTab, setSelectedTab] = useState<"python" | "javascript" | "curl">("python")
  const [isCopyActive, setIsCopyActive] = useState<boolean>(false)

  const onCopy = async () => {
    if (selectedTab === "python") await navigator.clipboard.writeText(PYTHON)
    else if (selectedTab === "javascript") await navigator.clipboard.writeText(JAVASCRIPT)
    else if (selectedTab === "curl") await navigator.clipboard.writeText(CURL)
    setIsCopyActive(true)
    try {
      setTimeout(() => {
        setIsCopyActive(false);
      }, 3000);
    } catch {
    }
  }

  return (
    <div>
      <div className={"pt-10 pb-4 gal-text"}>
        Try the code examples!
      </div>
      <div>
        {isLoading ?
          <div>Loading...</div>
          :
          <div className={"gal-code-wrapper max-w-[700px]"}>
            <Tabs defaultValue="python">
              <TabsList className="gal-code-header bg-transparent py-3 px-6">
                <div className={"flex w-full justify-between"}>
                  <div className={"flex"}>
                    <TabsTrigger
                      value="python"
                      onClick={() => setSelectedTab("python")}
                    >
                      Python
                    </TabsTrigger>
                    <TabsTrigger
                      value="javascript"
                      onClick={() => setSelectedTab("javascript")}
                    >
                      Javascript
                    </TabsTrigger>
                    <TabsTrigger
                      value="curl"
                      onClick={() => setSelectedTab("curl")}
                    >
                      cURL
                    </TabsTrigger>
                  </div>
                  <div className={"flex flex-row gap-2 items-center break-all cursor-pointer"}
                       onClick={onCopy}
                  >
                    {isCopyActive ?
                      <div>
                        {getIcon("check")}
                      </div>
                      :
                      <div>
                        {getIcon("copy")}
                      </div>
                    }
                  </div>
                </div>

              </TabsList>
              <TabsContent value="python">
                <div className={"gal-code"}>
                  {/*{PYTHON}*/}
                  <SyntaxHighlighter
                    language="python"
                    style={idea}
                    customStyle={{background: "transparent"}}
                  >
                    {PYTHON}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
              <TabsContent value="javascript">
                <div className={"gal-code"}>
                  <SyntaxHighlighter
                    language="javascript"
                    style={idea}
                    customStyle={{background: "transparent"}}
                  >
                    {JAVASCRIPT}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
              <TabsContent value="curl">
                <div className={"gal-code"} style={{fontSize: "13px"}}>
                  <SyntaxHighlighter
                    language="bash"
                    style={idea}
                    customStyle={{background: "transparent"}}
                  >
                    {CURL}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        }
      </div>
    </div>
  )
}