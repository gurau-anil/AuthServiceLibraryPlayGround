export interface MenuType{
    textColor: string
}

export interface SideNavType{
    background: string,
    isCollapsed: boolean,
    textColor: string,
    width: string,
    collapsedWidth: string
}

export interface layoutPreferenceType {
    backgound: string,
    activeBg: string,
    defaultNavMode: 'drawer' | 'sidenav',
    sideNav: SideNavType,
    Menu: MenuType

}

const layoutPreference: layoutPreferenceType ={
    backgound: "",
    activeBg: "",
    defaultNavMode: 'sidenav',
    sideNav: {
        background: "white",
        isCollapsed: false,
        textColor: "red",
        width: "100px",
        collapsedWidth: "20px"
    },
    Menu:{
        textColor: "red"
    }

}

export default layoutPreference;