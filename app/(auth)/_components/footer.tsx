import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mx-auto max-w-xl p-8 pt-20">
      <p className="text-center text-xs text-muted-foreground">
        By clicking &quot;Continue with Google/Facebook/Email & Password&quot; above, you
        acknowledge that you have read and understood, and agree to Station&apos;s{" "}
        <Link href="#" className="underline">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </footer>
  )
}
