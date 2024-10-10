import { CardWrapper } from "@/components/auth/card-wrapper";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const ErrorCard = () => {
    return (
        <CardWrapper  
            headerLabel="Oops! Quelque chose s'est mal passée !"  
            backButtonHref="/auth/login"
            backButtonLabel="Retour à la connexion"
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="text-destructive" />
            </div>
       </CardWrapper>     
    )
}

