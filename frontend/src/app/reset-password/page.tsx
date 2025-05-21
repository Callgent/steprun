"use client"

import ForgotPassword from "@/components/reset-password"
import { Suspense } from "react"

export default function ForgotPasswordPage() {

  return (
    <Suspense>
      <ForgotPassword />
    </Suspense>
  )
}