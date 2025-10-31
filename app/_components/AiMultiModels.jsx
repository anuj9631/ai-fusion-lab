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

function AiMultiModels() {
  const [aiModelList, setAiModelList] = useState(AiModelList);

  return (
    <div className="flex flex-1 h-[85vh] border-b pb-[100px]">

      {aiModelList.map((model, index) => (
        <div
          className="flex flex-col border-r h-full min-w-[400px]"
        >
          {/* Header */}
          <div   key={index} className="flex w-full items-center justify-between p-4 border-b bg-white">
            <div  className="flex items-center gap-4">
              <Image src={model.icon} alt={model.model} width={24} height={24} />

              <Select>
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
              </Select>
            </div>

            <Switch />
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
