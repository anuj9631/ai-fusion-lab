import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import AiMultiModels from './AiMultiModels'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { UserDetailContext } from '@/context/UserDetailContext'; // ✅ ADD THIS
import axios from 'axios';
import AiModelList from '@/shared/AiModelList';

function ChatinputBox() {
  const [userInput, setUserInput] = useState(''); // ✅ Initialize with empty string
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);
  const { userDetail } = useContext(UserDetailContext); // ✅ ADD THIS

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModels).forEach((modelKey) => {
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: userInput },
        ];
      });
      return updated;
    });

    const currentInput = userInput;
    setUserInput(""); // ✅ This will now work properly with value prop

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiSelectedModels).forEach(async ([parentModel, modelInfo]) => {
      if (!modelInfo.modelId) return;

      // Check if model is premium and user doesn't have access
      const modelConfig = AiModelList.find(m => m.model === parentModel);
      const isModelPremium = modelConfig?.premium;
      const isPremiumUser = userDetail?.plan === 'Premium' || userDetail?.plan === 'Pro';

      if (isModelPremium && !isPremiumUser) {
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: "assistant",
              content: "🔒 Upgrade to Premium to use this model",
              locked: true
            },
          ],
        }));
        return;
      }

      // Add loading placeholder
      setMessages((prev) => ({
        ...prev,
        [parentModel]: [
          ...(prev[parentModel] ?? []),
          { role: "assistant", content: "Loading...", model: parentModel, loading: true },
        ],
      }));

      try {
        const result = await axios.post("/api/ai-multi-model", {
          model: modelInfo.modelId,
          msg: [{ role: "user", content: currentInput }],
          parentModel,
        });

        const { aiResponse, model } = result.data;

        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const loadingIndex = updated.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            updated[loadingIndex] = {
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            };
          } else {
            updated.push({
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            });
          }

          return { ...prev, [parentModel]: updated };
        });
      } catch (err) {
        console.error(`❌ Error for ${parentModel}:`, err);

        const errorMessage = err.response?.data?.details
          || err.response?.data?.error
          || "Error fetching response.";

        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const loadingIndex = updated.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            updated[loadingIndex] = {
              role: "assistant",
              content: `⚠️ ${errorMessage}`,
              error: true,
              loading: false,
            };
          }

          return { ...prev, [parentModel]: updated };
        });
      }
    });
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='h-[calc(100vh-140px)] overflow-hidden'>
        <AiMultiModels />
      </div>
      
      <div className='fixed bottom-0 left-0 right-0 z-50w-full flex justify-center px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent pt-4'>
        <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 bg-white'>
          <input 
            type='text' 
            placeholder='Ask me anything...' 
            className='border-0 outline-none w-full'
            value={userInput} // ✅ ADD THIS
            onChange={(event) => setUserInput(event.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} // ✅ BONUS: Send on Enter
          />
          <div className='mt-5 flex justify-between items-center'>
            <Button variant={'ghost'} size={'icon'}>
              <Paperclip className='h-5 w-5' />
            </Button>
            <div className='flex gap-5'>
              <Button variant={'ghost'} size={'icon'}>
                <Mic />
              </Button>
              <Button size={'icon'} className={'bg-blue-600'} onClick={handleSend}>
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//incompleted
export default ChatinputBox;