export function useNavigationMenu() {
    const navigationMenu = () => {
        return [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
            },
            {
                label: 'Demo',
                items: [{ label: 'List Demo', icon: 'pi pi-fw pi-building', to: '/demo' }]
            },
            {
                label: 'Chatgpt Demo',
                items: [{ label: 'Chat!', icon: 'pi pi-fw pi-bars', to: '/chatgpt' }]
            },
        ]
    };
    return { navigationMenu }
}