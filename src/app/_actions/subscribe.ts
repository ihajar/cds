"use server";

import { CustomerStatus } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

import { prisma } from "@/lib/prisma";
import { PrevState } from "@/config/types";

import { SubscribeSchema } from "../schemas/subscribe.schema";


export const subscribeAction = async(_: PrevState, formData: FormData) => {
    try {
        const { data, success, error } = SubscribeSchema.safeParse({
            email: formData.get("email") as string,
        });
        if (!success) {
            return { success: false, message: error.message };
        }
        const subscriber = await prisma.customer.findFirst({
            where: { email: data.email },
        });
        if(subscriber) {
            return { success: false, message: "You  have already subscribed" };
        }
        await prisma.customer.create({
            data: {
                ...data,
                status: CustomerStatus.SUBSCRIBER,
            }
        });
        return { success: true, message: "Subscribed successfully." };
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) {
            return { success: false, message: error.message };
        }
        if(error instanceof PrismaClientValidationError) {
            return { success: false, message: error.message };
        }
        if(error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "Something went wrong!" };
    }
}