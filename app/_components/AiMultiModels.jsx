import AiModelList from "./../../shared/AiModelList";
import Image from "next/image";
import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/nextjs";
 //2.5/44
function AiMultiModels() {
  const {user} =useUser();
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const {aiSelectedModels, setAiSelectedModels} =useContext(AiSelectedModelContext);

  const onToggleChnage=(model, value) =>{
   setAiModelList((prev)=>
  prev.map((m)=>m.model===model?{...m, enable:value} : m))
  }

 const onSelectValue = async (parentModel, value) => {
  const updatedModels = {
    ...aiSelectedModels,
    [parentModel]: { modelId: value },
  };
  setAiSelectedModels(updatedModels);

  // Update Firestore
  const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
  await updateDoc(docRef, {
    selectedModelPref: updatedModels,
  });
};


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

         {model.enable &&      <Select
  defaultValue={aiSelectedModels[model.model].modelId}
  onValueChange={(value) => onSelectValue(model.model, value)}
>

                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={aiSelectedModels[model.model].modelId} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="px-3">
                    <SelectLabel className='text-sm text-gray-400'>Free</SelectLabel>
                  {model.subModel.map((subModel, i) => subModel.premium ==false && (
                    <SelectItem key={i} value={subModel.id}>
                      {subModel.name}
                    </SelectItem>
                  ))}
                  </SelectGroup>


                  <SelectGroup className="px-3">
                    <SelectLabel className='text-sm text-gray-400'>Premimum</SelectLabel>
                  {model.subModel.map((subModel, i) => subModel.premium ==true && (
                    <SelectItem key={i} value={subModel.name} disabled={subModel.premium}>
                      {subModel.name} {subModel.premium && <Lock className="h-4 w-4" />}
                    </SelectItem>
                  ))}
                  </SelectGroup>
                </SelectContent>
              </Select>}
            </div>

        {model.enable ?    <Switch checked={model.enable} onCheckedChange={(v)=>onToggleChnage(model.model,v)}/> : <MessageSquare onClick={()=>onToggleChnage(model.model,true)} />}
          </div>
             { model.premium && model.enable && <div className="flex items-center justify-center h-full">
        <Button> <Lock /> Upgrade to unlock</Button>
       </div> }
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
