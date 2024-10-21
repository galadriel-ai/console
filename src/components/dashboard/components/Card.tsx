import {Title} from "@/components/Text";
import {getIcon, IconName} from "@/components/Icons";

interface Props {
  title: string
  isLoading: boolean
  text: string | undefined
  subText?: string | undefined
  iconName?: IconName
}

export function Card({title, text, isLoading, subText, iconName}: Props) {
  return (
    <div
      className={"md:w-1/3 py-6 px-8 flex flex-col gap-8 gal-card"}
    >
      <div className={"gal-text flex flex-row justify-between"}>
        <div>
          {title}
        </div>
        {iconName &&
          <>
            {getIcon(iconName)}
          </>
        }
      </div>
      {(isLoading || !text) ?
        <div>Loading...</div>
        :
        <div className={"flex flex-row gap-3"}>
          <Title>
            {text}
          </Title>
          {subText &&
            <span className={"gal-unit"}>{subText}</span>
          }
        </div>
      }
    </div>
  )
}