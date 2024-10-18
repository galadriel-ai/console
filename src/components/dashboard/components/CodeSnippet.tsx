import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import SyntaxHighlighter from "react-syntax-highlighter";
import {idea} from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
    model="neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)

print(completion.choices[0].message)
`

  const CURL: string = `curl -X 'POST' \\
  'https://api.galadriel.com/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer ${apiKey || "<GALADRIEL_API_KEY>"}' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "model": "neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8",
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


  return (
    <div>
      <div className={"pt-10 gal-text-secondary"}>
        Or use the code examples!
      </div>
      <div>
        {isLoading ?
          <div>Loading...</div>
          :
          <div className={"gal-code-wrapper max-w-[700px] min-w-[300px]"}>
            <Tabs defaultValue="python">
              <TabsList className="gal-code-header grid grid-cols-6 bg-transparent py-3 px-6">
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
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
              <TabsContent value="curl">
                <div className={"gal-code"}>
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