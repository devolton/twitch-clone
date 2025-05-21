import React from 'react';
import Logo from "@/components/layouts/header/Logo";
import Search from "@/components/layouts/header/Search";
import HeaderMenu from "@/components/layouts/header/HeaderMenu";

const Header = () => {
    return (
        <header className="flex h-full items-center gap-x-4 border-b border-border bg-card p-4">
            <Logo/>
            <Search/>
            <HeaderMenu/>
        </header>
    );
};

export default Header;