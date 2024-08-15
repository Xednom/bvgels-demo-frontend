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
        ]
    };
    return { navigationMenu }
}