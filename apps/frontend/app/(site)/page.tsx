'use client'

import {useCurrent} from "@/hooks/useCurrent";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";

export default function Home() {
    const {user, isLoadingProfile} = useCurrent();

    return (
        <div>
            {isLoadingProfile ? 'Loading...' :
                <ChannelAvatar channel={{
                    username: user?.username ?? 'Unauthorizated',
                    avatar: user?.avatar ?? null
                }
                }/>
            }

        </div>
    );
}
