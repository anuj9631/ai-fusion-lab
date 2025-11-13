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
import { Loader, Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

function AiMultiModels() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext); // ✅ MOVED INSIDE
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);

  const onToggleChnage = (model, value) => {
    setAiModelList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
  };

  const onSelectValue = async (parentModel, value) => {
    const updatedModels = {
      ...aiSelectedModels,
      [parentModel]: { modelId: value },
    };
    setAiSelectedModels(updatedModels);

    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, {
      selectedModelPref: updatedModels,
    });
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-60px)] border-b">
      {aiModelList.map((model, index) => {
        const isPremiumUser = userDetail?.plan === 'Premium' || userDetail?.plan === 'Pro';
        const shouldShowLock = model.premium && !isPremiumUser;

        return (
          <div
            key={index}
            className={`flex flex-col border-r h-full transition-all duration-100 ${
              model.enable ? "flex-1 min-w-[350px]" : "w-[100px] flex-none"
            }`}
          >
            {/* Header */}
            <div className="flex w-full h-[60px] items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center gap-4">
                <Image src={model.icon} alt={model.model} width={24} height={24} />

                {model.enable && (
                  <Select
                    defaultValue={aiSelectedModels[model.model].modelId}
                    onValueChange={(value) => onSelectValue(model.model, value)}
                    disabled={model.premium}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder={aiSelectedModels[model.model].modelId} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="px-3">
                        <SelectLabel className="text-sm text-gray-400">Free</SelectLabel>
                        {model.subModel.map(
                          (subModel, i) =>
                            subModel.premium === false && (
                              <SelectItem key={i} value={subModel.id}>
                                {subModel.name}
                              </SelectItem>
                            )
                        )}
                      </SelectGroup>

                      <SelectGroup className="px-3">
                        <SelectLabel className="text-sm text-gray-400">Premium</SelectLabel>
                        {model.subModel.map(
                          (subModel, i) =>
                            subModel.premium === true && (
                              <SelectItem key={i} value={subModel.name} disabled={subModel.premium}>
                                {subModel.name} {subModel.premium && <Lock className="h-4 w-4" />}
                              </SelectItem>
                            )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {model.enable ? (
                <Switch checked={model.enable} onCheckedChange={(v) => onToggleChnage(model.model, v)} />
              ) : (
                <MessageSquare onClick={() => onToggleChnage(model.model, true)} />
              )}
            </div>

            {/* Show lock screen for premium models */}
            {shouldShowLock && model.enable && (
              <div className="flex items-center justify-center h-full">
                <Button>
                  <Lock /> Upgrade to unlock
                </Button>
              </div>
            )}

            {/* Show messages only if not locked */}
            {!shouldShowLock && model.enable && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                  {messages[model.model]?.map((m, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-md ${
                        m.role === "user" ? "bg-blue-50 text-blue-900" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {m.role === "assistant" && (
                        <span className="text-sm text-gray-400">{m.model ?? model.model}</span>
                      )}
                      {(m.content === "Loading..." || m.loading) && (
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin h-4 w-4" />
                          <span>Thinking....</span>
                        </div>
                      )}
                      {m.content !== "Loading..." && !m.loading && <h2>{m.content}</h2>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AiMultiModels;