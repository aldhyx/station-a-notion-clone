import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { emailSchema } from "./_schema"

const SignUpVerifyPage = dynamic(() => import("./signup-verify"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

type Props = {
  searchParams: { mailto: string }
}

export default function SignUpVerifyRootPage({ searchParams }: Props) {
  const email = emailSchema.safeParse(searchParams.mailto)

  if (!email.success) return redirect("/signup")

  return <SignUpVerifyPage />
}
