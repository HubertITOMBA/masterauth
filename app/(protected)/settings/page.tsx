"use client"

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
 

const SettingsPage = () => { 
    const user = useCurrentUser();
 

    const onClick = () => {
        // signOut();
        logout();
       
    }

  return (
    <div>
      {/*   SettingsPage
        {JSON.stringify(user)}     */}
        <button onClick={onClick} type="submit">
                Déconnexion
        </button>
    </div>
  )
}

export default SettingsPage