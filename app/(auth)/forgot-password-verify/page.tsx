import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { emailSchema } from "./_schema"

const ForgotPasswordVerifyPage = dynamic(() => import("./forgot-password-verify"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

type Props = {
  searchParams: { mailto: string }
}

export default function ForgotPasswordVerifyRootPage({ searchParams }: Props) {
  const email = emailSchema.safeParse(searchParams.mailto)

  if (!email.success) return redirect("/forgot-password")

  return <ForgotPasswordVerifyPage />
}
