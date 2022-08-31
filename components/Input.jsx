import { EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, uploadString, ref } from "firebase/storage";

const Input = () => {
    const { data: session } = useSession();
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null);


    const addImagetoPost = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "posts"), {
            id: session.user.uid,
            text: input,
            userImg: session.user.image,
            timestamp: serverTimestamp(),
            name: session.user.name,
            username: session.user.username
        })

        const imageRef = ref(storage, `posts/${docRef.id}/image`)

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(async () => {
                const downloadUrl = await getDownloadURL(imageRef)
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadUrl
                })
            })
        }

        setInput("");
        setSelectedFile(null);
        setLoading(false);
    }

    return (
        <>
            {session && (
                <div className="flex border-b border-gray-200 p-3 space-x-3">
                    <img onClick={signOut} title="Log Out" className="h-11 w-11 cursor-pointer hover:brightness-95 rounded-full" src={session.user.image} alt="User image" />
                    <div className="w-full divide-y divide-gray-200">
                        <div>
                            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700" rows="2" placeholder="What's happening?">
                            </textarea>
                        </div>
                        {selectedFile && (
                            <>
                            <div className="relative">
                                <XIcon onClick={() => setSelectedFile(null)} className="h-7 absolute cursor-pointer right-0 shadow-md rounded-full" />
                                <img src={selectedFile} className={`${loading && "animate-pulse"}`} alt="" />
                            </div>
                            </>
                        )}
                        {!loading && (
                            <>
                                <div className="flex items-center justify-between pt-2.5">
                                    <div className="flex">
                                        <div onClick={() => filePickerRef.current.click()}>
                                            <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                            <input type="file" hidden ref={filePickerRef} onChange={addImagetoPost} />
                                        </div>
                                        <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                    </div>
                                    <button onClick={sendPost} disabled={!input.trim() && !selectedFile} className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50">Tweet</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>

    )
}

export default Input