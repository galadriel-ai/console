import {useState} from "react";
import {Title} from "@/components/Text";
import Select, {SingleValue} from "react-select";
import {getIcon} from "@/components/Icons";

interface Option {
  value: string
  label: string
}

const roleOptions: Option[] = [
  {value: "web2_eng", label: "Web2 eng"},
  {value: "web3_eng", label: "Web3 eng"},
  {value: "founder", label: "Founder"},
  {value: "pm", label: "PM"},
  {value: "investor", label: "Investor"},
  {value: "node_runner", label: "Node runner"},
  {value: "researcher", label: "Researcher"},
]

const experienceOptions: Option[] = [
  {value: "1_year", label: "< 1 year"},
  {value: "3_year", label: "1-3 years"},
  {value: "max", label: "> 3 years"},
]

const gpuOptions: Option[] = [
  {value: "rtx_3060", label: "Nvidia RTX 3060"},
  {value: "rtx_3060_ti", label: "Nvidia RTX 3060 Ti"},
  {value: "rtx_3070", label: "Nvidia RTX 3070"},
  {value: "rtx_3070_ti", label: "Nvidia RTX 3070 Ti"},
  {value: "rtx_3080", label: "Nvidia RTX 3080"},
  {value: "rtx_3080_ti", label: "Nvidia RTX 3080 Ti"},
  {value: "rtx_3090", label: "Nvidia RTX 3090"},
  {value: "rtx_3090_ti", label: "Nvidia RTX 3090 Ti"},

  {value: "rtx_4060", label: "Nvidia RTX 4060"},
  {value: "rtx_4060_ti", label: "Nvidia RTX 4060 Ti"},
  {value: "rtx_4070", label: "Nvidia RTX 4070"},
  {value: "rtx_4070_ti", label: "Nvidia RTX 4070 Ti"},
  {value: "rtx_4070_super", label: "Nvidia RTX 4070 Super"},
  {value: "rtx_4070_ti_super", label: "Nvidia RTX 4070 Ti Super"},
  {value: "rtx_4080", label: "Nvidia RTX 4080"},
  {value: "rtx_4080_super", label: "Nvidia RTX 4080 Super"},
  {value: "rtx_4090", label: "Nvidia RTX 4090"},

  {value: "other", label: "Other"},
]

const gpusCountOptions: Option[] = [
  {value: "0", label: "0"},
  {value: "1-10", label: "1-10"},
  {value: "10-100", label: "10-100"},
  {value: "100+", label: "100+"},
]

const ownershipOptions: Option[] = [
  {value: "rent", label: "Rent"},
  {value: "own", label: "Own"},
  {value: "both", label: "Both"},
]

const osOptions: Option[] = [
  {value: "linux", label: "Linux"},
  {value: "windows", label: "Windows"},
  {value: "macos", label: "MacOS"},
]

export function ExtraDataForm({onSuccess}: {
  onSuccess: () => void,
}) {

  const [telegram, setTelegram] = useState<string>("")
  const [roles, setRoles] = useState<string[]>([])
  const [experience, setExperience] = useState<string | null>(null)
  const [gpus, setGpus] = useState<string[]>([])
  const [ownership, setOwnership] = useState<string>("")
  const [gpuCount, setGpuCount] = useState<string>("")
  const [preferredOs, setPreferredOs] = useState<string>("")

  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleExtraDataSubmit = (e: any) => {
    e.preventDefault()
    onSendData()
  }

  const onSendData = async () => {
    if (isLoading) return
    setErrorMessage("")
    if (!telegram || !roles || !experience || !gpus || !ownership || gpuCount === "" || !preferredOs) {
      setErrorMessage("Make sure to fill all fields.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            telegram,
            roles,
            experience,
            gpus,
            ownership,
            gpu_count: gpuCount,
            preferred_os: preferredOs,
          }
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        // router.push("/dashboard")
        await setErrorMessage("")
        onSuccess()
        return
      } else {
        setErrorMessage("An error occurred, please try again.")
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred, please try again.")
    }
    setIsLoading(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onRoleChange = (option: readonly Option[], actionMeta: any) => {
    setRoles(option.map(o => o.value))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onExperienceChange = (option: SingleValue<Option>, actionMeta: any) => {
    if (option) setExperience(option.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onGpuChange = (option: readonly Option[], actionMeta: any) => {
    setGpus(option.map(o => o.value))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOwnershipChange = (option: SingleValue<Option>, actionMeta: any) => {
    if (option) setOwnership(option.value)
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onGpuCountChange = (option: SingleValue<Option>, actionMeta: any) => {
    if (option) setGpuCount(option.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOsChange = (option: SingleValue<Option>, actionMeta: any) => {
    if (option) setPreferredOs(option.value)
  }

  return (
    <>
      <Title>Almost there</Title>
      <div className={"gal-text"}>Just a few mode details.</div>

      <div className={"gal-error"}>{errorMessage}</div>
      <form
        onSubmit={handleExtraDataSubmit}
        className="flex flex-col gap-6 w-full"
        data-ph-capture-attribute-form-name="profile_data"
      >
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Telegram handle</label>
          <input
            type="telegram"
            placeholder="@username"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            className="border px-4 py-2 text-black"
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Role</label>
          <Select
            options={roleOptions}
            isMulti
            name={"roles"}
            className="gal-multi-select"
            classNamePrefix="gal"
            onChange={onRoleChange}
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Node running/mining experience</label>
          <Select
            options={experienceOptions}
            name={"experience"}
            className="gal-multi-select"
            classNamePrefix="gal"
            onChange={onExperienceChange}
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>What GPUs do you have?</label>
          <Select
            options={gpuOptions}
            isMulti
            name={"gpus"}
            className="gal-multi-select"
            classNamePrefix="gal"
            onChange={onGpuChange}
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Rent or have GPUs locally?</label>
          <Select
            options={ownershipOptions}
            name={"ownership"}
            className="gal-multi-select"
            classNamePrefix="gal"
            onChange={onOwnershipChange}
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>How many GPUs in total?</label>
          <Select
            options={gpusCountOptions}
            name={"gpuCount"}
            className="gal-multi-select"
            classNamePrefix="gal"
            onChange={onGpuCountChange}
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Preferred OS</label>
          <Select
            options={osOptions}
            name={"os"}
            className="gal-multi-select"
            classNamePrefix="gal"
            onChange={onOsChange}
          />
        </div>

        <div className={"flex justify-end pt-8"}>
          <button type="submit" className={"gal-button gal-button-primary"}>
            {isLoading && <>
              {getIcon("spinner")}
            </>
            }
            Continue
          </button>
        </div>
      </form>

    </>
  )
}