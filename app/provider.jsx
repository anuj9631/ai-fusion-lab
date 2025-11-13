"use client"

import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { DefaultModel } from '@/shared/AiModelsShared'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children, ...props }) {
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel)
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState();
  const [messages, setMessages] = useState({})

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user])

  const CreateNewUser = async () => {
    // if user exist
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Existing User");
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelPref ?? DefaultModel);
      setUserDetail(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5, // only for free user
        plan: 'Free',
        credits: 1000, // paid user
        selectedModelPref: DefaultModel,
      }
      await setDoc(userRef, userData);
      console.log('New User Data Saved')
      setUserDetail(userData);
    }
    // if user not exist insert
  }

  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange 
      {...props}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels, messages, setMessages }}>
          <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider