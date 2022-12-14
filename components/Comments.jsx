import { ChartBarIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline"
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid"
import { doc, setDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import Moment from "react-moment"
import { db } from "../firebase"
import { userState } from "../atom/userAtom";
import { useRouter } from "next/router"
import { useRecoilState } from "recoil";


const Comments = ({ comment, commentId, originalPostId, id }) => {
    const router = useRouter()
    const [likes, setLikes] = useState([])
    const [hasLiked, setHasLiked] = useState([])
    const [currentUser] = useRecoilState(userState);

    useEffect(() => onSnapshot(collection(db, "posts", originalPostId, "comments", commentId, "likes"),
        (snapshot) => {
            setLikes(snapshot.docs)
        }
    )
        , [db, originalPostId, commentId])


    useEffect(() => {
        setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [likes, currentUser]);

    const likeComment = async () => {
        if (currentUser) {
            if (hasLiked) {
                await deleteDoc(doc(db, "posts", originalPostId, "comments", commentId, "likes", currentUser?.uid))
            }
            else {
                await setDoc(doc(db, "posts", originalPostId, "comments", commentId, "likes", currentUser?.uid), {
                    username: currentUser?.username,
                })
            }
        }
        else {
            router.push("/auth/signin");
        }
    }

    const deleteComment = async () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            await deleteDoc(doc(db, "posts", originalPostId, "comments", commentId))
        }
    }

    return (
        <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
            {/*User Image*/}
            <img className="w-11 h-11 rounded-full mr-4" src={comment?.userImg} alt="userimg" />
            {/*Right side*/}
            <div className="flex-1">
                {/*Post header*/}
                <div className="flex items-center justify-between">
                    {/*header div-1*/}
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{comment?.name}</h4>
                        <span className="text-sm sm:text-[15px]">@{comment?.username} - </span>
                        <span className="text-sm sm:text-[15px] hover:underline"><Moment fromNow>{comment?.timestamp?.toDate()}</Moment></span>
                    </div>
                    {/*header div-2*/}
                    <div>
                        <DotsHorizontalIcon className="h-10 w-10 hoverEffect hover:bg-sky-100 hover:text-sky-500 p-2" />
                    </div>
                </div>
                {/*text*/}
                <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">{comment?.comment}</p>
                {/*icons*/}
                <div className="flex justify-between text-gray-500 p-2">
                    {currentUser?.uid === comment?.userId && (
                        <TrashIcon onClick={() => {
                            if (!currentUser) {
                                // signIn();
                                router.push("/auth/signin");
                            }
                            else {
                                deleteComment()
                            }
                        }} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100" />
                    )}
                    <div className="flex items-center">
                        {hasLiked
                            ? <HeartIconFilled onClick={likeComment} className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100" />
                            : <HeartIcon onClick={likeComment} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100" />
                        }
                        {
                            likes.length > 0 && (
                                <span className={`${hasLiked && "text-red-600"} text-sm`}>{likes.length}</span>
                            )
                        }
                    </div>

                    <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                    <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                </div>
            </div>
        </div>
    )
}

export default Comments