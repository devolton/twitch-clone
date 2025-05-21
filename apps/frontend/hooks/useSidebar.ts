import {sidebarStore} from "@/store/sidebar/sidebar.store";

export function useSidebar() {
    const {isCollapsed, setIsCollapsed} = sidebarStore(state => state);

    const open = () => setIsCollapsed(false);
    const close = () => setIsCollapsed(true);

    return {
        isCollapsed,
        open,
        close,
    }
}