"use client";

import { transformToWordsArray } from "@/lib/utils";
import { secureAptosAccountSchema } from "@/lib/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type ValidationSchema = z.infer<typeof secureAptosAccountSchema>;
export const SecurePrivateKeyForm: React.FC<{
  onSubmit: (props: { accessCode: string; catchPhrases: string[] }) => void;
}> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(secureAptosAccountSchema),
  });
  const submitFn: SubmitHandler<ValidationSchema> = (data) =>
    onSubmit({
      accessCode: data.accessCode,
      catchPhrases: transformToWordsArray(data.catchPhrases),
    });
  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitFn)}>
        <input
          placeholder="Enter an access code"
          className="border px-4 py-2"
          {...register("accessCode")}
        />
        {errors.accessCode && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.accessCode?.message}
          </p>
        )}
        <textarea
          placeholder="Enter 10 Catch Phrases separated by commas"
          className="border px-4 py-2"
          rows={5}
          {...register("catchPhrases")}
        />
        {errors.catchPhrases && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.catchPhrases?.message}
          </p>
        )}
        <button className="border px-4 py-2">Submit</button>
      </form>
    </div>
  );
};
