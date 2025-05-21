import {type PropsWithChildren} from "react";
import Header from "@/components/layouts/header/Header";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import Sidebar from "@/components/layouts/header/sidebar/Sidebar";


export default function SiteLayout({children}: PropsWithChildren<unknown>) {

    return <div className={'d-flex flex-col h-full'}>
        <div className={'flex-1'}>
            <div className={'fixed inset-y-0 w-full z-50 h-[75px]'}>
                <Header/>
            </div>
            <Sidebar/>
            <LayoutContainer className={'mt-[75px] flex-1 p-8'}>{children}</LayoutContainer>
        </div>
    </div>
}