import AiModelList from "./../../shared/AiModelList";
import Image from "next/image";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from "lucide-react";

function AiMultiModels() {
  const [aiModelList, setAiModelList] = useState(AiModelList);

  const onToggleChnage=(model, value) =>{
   setAiModelList((prev)=>
  prev.map((m)=>m.model===model?{...m, enable:value} : m))
  }
  return (
    <div className="flex flex-1 h-[85vh] border-b pb-[100px]">

      {aiModelList.map((model, index) => (
        <div key={index}
          className={`flex flex-col border-r h-full overflow-auto transition-all duration-100 ${model.enable?'flex-1 min-w-[350px]' :'w-[100px] flex-none'}`}
        >
          {/* Header */}
          <div    className="flex w-full h-[60px] items-center justify-between p-4 border-b bg-white">
            <div  className="flex items-center gap-4">
              <Image src={model.icon} alt={model.model} width={24} height={24} />

         {model.enable &&      <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={model.subModel[0].name} />
                </SelectTrigger>
                <SelectContent>
                  {model.subModel.map((subModel, subIndex) => (
                    <SelectItem key={subIndex} value={subModel.name}>
                      {subModel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>}
            </div>

        {model.enable ?    <Switch checked={model.enable} onCheckedChange={(v)=>onToggleChnage(model.model,v)}/> : <MessageSquare onClick={()=>onToggleChnage(model.model,true)} />}
          </div>

          {/* Scrollable area for chat responses */}
          <div className="flex-1 overflow-auto p-3">
            {/* model output will come here later */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AiMultiModels;
