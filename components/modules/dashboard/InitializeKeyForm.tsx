"use client";

import { useFormState, useFormStatus } from "react-dom";
import { initializeUserKey } from "@/app/action";
import Button from "../../ui/button";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="bg-blue-500"
      type="primary"
      htmlType="submit"
      aria-disabled={pending}
      loading={pending}
    >
      Initialize Keys
    </Button>
  );
}

export function InitializeKeyForm() {
  const [state, formAction] = useFormState(initializeUserKey, initialState);
  console.log("first", state);
  return (
    <form action={formAction}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  );
}
