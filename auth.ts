import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

// import { getAccountByUserId } from "@/data/account";


// const prisma = new PrismaClient()

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    // update
   } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
      },
    events: {
        async linkAccount({ user }) {
          await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date()}
          })
        }
      },
    callbacks: {
        async signIn({user, account}){
            console.log('PREMIER  CALLBACK ==>> ', {user, account});
           //Autoriser OAuth sans vérification de l'e-mail
            if (account?.provider !== "credentilas") return true;
      
            const existingUser = await getUserById(user.id);
            console.log('USER EXISTANT  ==>> ', existingUser);
            //Empêcher la connexion sans vérification de l'e-mail
            if (!existingUser?.emailVerified) return false;


            //2FA
            if (existingUser?.isTwoFactorEnabled) {
              const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                  console.log('USER ID EXISTANT  ==>> ', existingUser);
                  console.log('TWO FACTOR STATUS ==>> ', {twoFactorConfirmation});
                  

                  if (!twoFactorConfirmation) return false;

                  //Supprimer 2FA confirmation pour la prochaine connexion
                  await db.twoFactorConfirmation.delete({
                      where: { id: twoFactorConfirmation.id }
                  });
            }
                  return true;
          },
        async session({token, session}){
             console.log({session, token});

             if (token.sub && session.user) { 
                session.user.id = token.sub;
             }   

             if (token.role && session.user) { 
                session.user.role = token.role as UserRole;
             }   

             if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isOAuth = token.isOAuth as boolean;
            }
             return session;     
        },    
        async jwt({ token }) {
            console.log({ token });
            token.customField = "test";

            if (!token.sub) return token;
      
            const existingUser = await getUserById(token.sub);
      
            if (!existingUser) return token;
      
           // const existingAccount = await getAccountByUserId(existingUser.id);
      
           // token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;


            return token;            
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    });