import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import { HomeIcon } from "@heroicons/react/solid";
import { DotsHorizontalIcon, BellIcon, BookmarkIcon, ClipboardIcon, DotsCircleHorizontalIcon, HashtagIcon, InboxIcon, UserIcon } from "@heroicons/react/outline";
import { useSession, signIn, signOut } from "next-auth/react"

const Sidebar = () => {
    const { data: session } = useSession()
    return (
        <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
            {/* Twitter Logo */}

            <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
                <Image width="57" height="45" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/1200px-Twitter-logo.svg.png"></Image>
            </div>

            {/* Menu */}

            <div className="mt-4 mb-2.5 xl:items-start">
                <SidebarMenuItem text="Home" Icon={HomeIcon} active />
                <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
                {session && (
                    <>
                        <SidebarMenuItem text="Notifications" Icon={BellIcon} />
                        <SidebarMenuItem text="Messages" Icon={InboxIcon} />
                        <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} />
                        <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
                        <SidebarMenuItem text="Profile" Icon={UserIcon} />
                        <SidebarMenuItem text="More" Icon={DotsCircleHorizontalIcon} />
                    </>
                )}
            </div>

            {/* Button */}

            {session ? (
                <button onClick={signOut} className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">Sign Out</button>
            ) : (
                <button onClick={signIn} className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">Sign in</button>
            )}

            {/* Mini-profile */}

            {session && (
                <>
                    <div className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto w-[250px] relative">
                        <img className="h-10 w-10 rounded-full xl:mr-2" src={session.user.image} alt="User image" />
                        <div className="leading-5 hidden xl:inline w-[220px]">
                            <h4 className="font-bold">{session.user.name}</h4>
                            <p className="text-gray-500 w-[70%] truncate">@{session.user.username}</p>
                        </div>
                        <DotsHorizontalIcon className="h-5 hidden xl:inline absolute right-5" />
                    </div>
                </>
            )}

        </div>
    )
}

export default Sidebar