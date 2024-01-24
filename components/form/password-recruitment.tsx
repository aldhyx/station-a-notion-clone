import { CheckIcon, DotIcon, InfoIcon } from "lucide-react"
import React, { useEffect, useState } from "react"

export default function PasswordRecruitment({
  prefix,
  password,
}: {
  prefix?: string
  password?: string
}) {
  const [matchPassword, setMatchPassword] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
  })

  const checkPassword = (password?: string) => {
    setMatchPassword({
      length: Boolean(password && password.length >= 8),
      uppercase: Boolean(password && password.match(/.*[A-Z].*/)),
      lowercase: Boolean(password && password.match(/.*[a-z].*/)),
      digit: Boolean(password && password.match(/.*\d.*/)),
    })
  }

  useEffect(() => {
    checkPassword(password)
  }, [password])

  return (
    <div className="rounded-md bg-sky-500/10 p-3 text-xs text-primary">
      <p className="mb-2 flex items-center gap-x-2 font-medium">
        <InfoIcon size={16} />
        <span>{`${prefix || "Password"} must contain at least:`}</span>
      </p>

      <ul className="flex flex-col gap-1 text-primary/90">
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.length ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>8 characters</span>
        </li>
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.lowercase ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>1 lowercase letter</span>
        </li>
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.uppercase ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>1 uppercase letter</span>
        </li>
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.digit ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>1 digit (0-9)</span>
        </li>
      </ul>
    </div>
  )
}
