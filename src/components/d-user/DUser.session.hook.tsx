import React from "react";
import type {UserSession} from "@code0-tech/sagittarius-graphql-types";

export const useUserSession = () => {
    const [session, setSession] = React.useState<UserSession | null>(null)

    React.useEffect(() => {
        const userSession = JSON.parse(localStorage.getItem("ide_code-zero_session")!!) as UserSession
        if (userSession && userSession.token) setSession(userSession)
    }, [])

    return session
}

export const setUserSession = (userSession: UserSession) => {
    localStorage.setItem("ide_code-zero_session", JSON.stringify(userSession))
}