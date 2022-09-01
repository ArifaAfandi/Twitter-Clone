import { db } from "../../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Signin() {
    const router = useRouter();
    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            const user = auth.currentUser.providerData[0];
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    username: user.displayName.split(" ").join("").toLocaleLowerCase(),
                    userImg: user.photoURL,
                    uid: user.uid,
                    timestamp: serverTimestamp(),
                });
            }
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex justify-center mt-20 space-x-4">
            <img className="hidden object-cover rotate-6 md:w-44 md:h-80 md:inline-flex" src="https://cdn.cms-twdigitalassets.com/content/dam/blog-twitter/archive/twitter_alerts_newcountriesandfeatures95.thumb.1280.1280.png" alt="twitter's background" />
            <div>
                <div className="flex flex-col items-center">
                    <img
                        className="w-36 object-cover"
                        src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
                        alt="twitter logo"
                    />
                    <p className="text-center text-sm italic my-10">
                        This app is created for learning purposes
                    </p>
                    <button
                        onClick={onGoogleClick}
                        className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    )
}