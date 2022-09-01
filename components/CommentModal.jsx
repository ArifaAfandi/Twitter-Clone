import { XIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import Moment from "react-moment";
import { userState } from "../atom/userAtom";
import { useRouter } from "next/router";

const CommentModal = () => {
    const [open, setOpen] = useRecoilState(modalState)
    const [post, setPost] = useState({})
    const [input, setInput] = useState("")
    const [postId] = useRecoilState(postIdState)
    const [currentUser] = useRecoilState(userState);
    const [selectedFile, setSelectedFile] = useState(null)
    const router = useRouter()

    useEffect(() => {
        onSnapshot(doc(db, "posts", postId), (snapshot) => setPost(snapshot))
    }, [postId, db])

    const sendComment = async () => {
        await addDoc(collection(db, "posts", postId, "comments"), {
            comment: input,
            name: currentUser.name,
            username: currentUser.username,
            userImg: currentUser.userImg,
            timestamp: serverTimestamp(),
            userId: currentUser.uid,
        })
        setOpen(false)
        setInput("")
        router.push(`/posts/${postId}`)
    }


    return (
        <div>
            {open && (
                <Modal isOpen={open} onRequestClose={() => setOpen(false)} className="max-w-lg w-[90%] border-2 border-gray-200 absolute top-24 left-[50%] translate-x-[-50%] bg-white rounded-xl shadow-md">
                    <div className="p-1">
                        <div className="border-b border-gray-200 py-2 px-1.5">
                            <div onClick={() => setOpen(false)} className="hoverEffect w-9 h-9 flex items-center justify-center">
                                <XIcon className="h-[22px] text-gray-700" />
                            </div>
                        </div>
                        <div className="p-2 flex items-center space-x-1 relative">
                            <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
                            <img className="w-11 h-11 rounded-full mr-4" src={post?.data()?.userImg} alt="userimg" />
                            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{post?.data()?.name}</h4>
                            <span className="text-sm sm:text-[15px]">@{post?.data()?.username} - </span>
                            <span className="text-sm sm:text-[15px] hover:underline"><Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment></span>
                        </div>
                        <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">{post?.data()?.text}</p>
                        <div className="flex p-3 space-x-3">
                            <img className="h-11 w-11 cursor-pointer hover:brightness-95 rounded-full" src={currentUser.userImg} alt="User image" />
                            <div className="w-full divide-y divide-gray-200">
                                <div>
                                    <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700" rows="2" placeholder="Tweet your reply..">
                                    </textarea>
                                </div>
                                {selectedFile && (
                                    <>
                                        <div className="relative">
                                            <XIcon onClick={() => setSelectedFile(null)} className="h-7 absolute cursor-pointer right-0 shadow-md rounded-full" />
                                            <img src={selectedFile} alt="" />
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center justify-between pt-2.5">
                                    <button onClick={sendComment} disabled={!input.trim() && !selectedFile} className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50">Reply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default CommentModal