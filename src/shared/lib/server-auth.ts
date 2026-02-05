import {cookies} from "next/headers";

const COOKIE_TOKEN_KEY = "auth-token";

export async function getServerToken(): Promise <string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_TOKEN_KEY);
    return token?.value || null;
}
