"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleCheckIcon, CircleX, Loader2 } from "lucide-react";

import { subscribeAction } from "@/app/_actions/subscribe";

import { Button } from "../ui/button";
import { SubscribeSchema } from "@/app/schemas/subscribe.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const SubscribeButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={"default"}
      disabled={pending}
      type="submit"
      className="font-bold rounded-bl-none rounded-tl-none"
    >
      {pending && (
        <Loader2 aria-hidden="true" className="w-4 h-4 shrink-0 animate-spin" />
      )}{" "}
      <ArrowRight className="h-7 w-7" />
    </Button>
  );
};

export const NewsLetterForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(subscribeAction, {
    success: false,
    message: "",
  });

  const form = useForm({
    resolver: zodResolver(SubscribeSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleFormAction = async (formData: FormData) => {
    const valid = await form.trigger();
    if (!valid) return;
    
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <div className="w-ful">
      <h3 className="text-sm md:text-xl text-center md:text-start font-bold text-foreground py-2">
        Subscribe to out newsletter
      </h3>
      <Form {...form}>
        <form
          action={handleFormAction}
          ref={formRef}
          onSubmit={() => null}
          className="space-y-2"
        >
          <div className="flex flex-col w-full space-y-3">
            <div className="flex items-center justify-between w-full gap-x-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="bg-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="bg-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full justify-start items-start">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="E-mail"
                        className="bg-muted rounded-br-none rounded-tr-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <SubscribeButton/>
            </div>
            {state.success && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-600 p-3 text-white">
                <CircleCheckIcon className="w-5 h-5" />
                <span>Success! {state.message}</span>
              </div>
            )}
            {!state.success && state.message && (
              <div className="flex items-center gap-2 rounded-md bg-destructive p-3 text-white">
                <CircleX className="w-5 h-5" />
                <span>Error! {state.message}</span>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
