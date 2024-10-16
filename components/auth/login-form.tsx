"use client"

import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "./card-wrapper"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { login } from "@/actions/login";



export const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "E-mail déjà utilisé avec un autre fournisseur !"
    : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values, callbackUrl)
            .then ((data) => {
               if (data?.error) {
                    form.reset(); 
                    setError(data.error);
                    setSuccess(data.success);
                }

                if (data?.success) {
                    form.reset();   
                    setSuccess(data.success);
                }

                if (data?.twoFactor) {
                     setShowTwoFactor(true);
                }   
            }) 
            .catch(() => setError("Quelque chose s'est mal passé !"))  
        });
    }

    return (
        <CardWrapper
        headerLabel="Content de vous revoir !"
        backButtonLabel="Vous n'avez pas encore de compte ?"
        backButtonHref="/auth/register"
        showSocial
        >
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
        <div className="space-y-4">
            { showTwoFactor && (
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Votre Code d'identification</FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            disabled={isPending}
                            placeholder="123456"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
        { !showTwoFactor && (
            <>             
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email adresse</FormLabel>
                        <FormControl>
                            <Input 
                                {...field}
                                    disabled={isPending}
                                    placeholder=""
                                type="email"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}   
            />

                        <FormField
                           control={form.control}
                           name="password"
                           render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder=""
                                            type="password"
                                        />
                                    </FormControl>
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/auth/reset">Mot de passe oublié ?</Link>
                                    </Button>
                                </FormItem>
                            )}   
                        />
                     </>   
                    )}
                </div> 
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                     { showTwoFactor ? "Confirmer" : "Connexion" }  
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}