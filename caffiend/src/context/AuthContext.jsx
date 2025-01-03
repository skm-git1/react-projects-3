import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext } from "react";
import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props){
    const {children} = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    // const [error, setError] = useState(null)

    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    // function resetPassword(email){
    //     return sendPasswordResetEmail(auth, email)
    // }

    function logout(){
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth);
    }

    const value = {globalUser, globalData, setGlobalData, isLoading, signup, login, logout}

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // if there's no user, empty the user state and return from this listener 
            console.log('Current user: ', user)
            setGlobalUser(user)
            if(!user) {
                console.log('No active user')
                return; 
            }

            // if there is a user, then check if the user has data in the database, and if they do, then fetch said data
            // and update the global state
            try {
                setIsLoading(true)
                
                // first we create a reference for the document (labelled json)
                // object, and then we get the doc
                const docRef = doc(db, 'users', user.uid);
                console.log('docRef: ', docRef)
                const docSnap = await getDoc(docRef);
                console.log("docSnap, ", docSnap)
                let firebaseData = {}
                if(docSnap.exists()){
                    firebaseData = docSnap.data()
                    console.log('Found user data')
                    console.log(firebaseData)
                }
                setGlobalData(firebaseData)
            } catch (error) {
                console.log(error.message)
            } finally{
                setIsLoading(false);
            }
        })
        return unsubscribe;
    }, [])

    return(
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    )
}