import {authStore} from "@/store/auth/auth.store";

export function useAuth() {
    const {setIsAuthenticated, isAuthenticated} = authStore(state => state);

    const auth = () => setIsAuthenticated(true);
    const exit = () => setIsAuthenticated(false);

    return {
        isAuthenticated,
        auth,
        exit,
    }
}