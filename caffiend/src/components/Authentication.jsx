import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Authentication(props){
    const {handleCloseModal} = props
    const [isRegistration, setIsRegistration] = useState(false) // whether user is signing up or logging in, default assumed: logging in
    const [email, setEmail] = useState('')
    const [password, setPasword] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState(null)

    const {signup, login} = useAuth()

    async function handleAuthenticate() {
        if(!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating){
            return;
        }
        try {
            setIsAuthenticating(true)
            setError(null)

            if(isRegistration){
                // register a user 
                await signup(email, password)
            } else {
                // login a user
                await login(email, password)
            }
            handleCloseModal()
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        } finally {
            setIsAuthenticating(false)
        }
    }

    return(
        <>
            <h2 className="sign-up-text">{isRegistration ? 'Sign Up': 'Login'}</h2>
            <p>{isRegistration ? 'Create a new account': 'Sign in to your account'}</p>
            {error && (
                <p>❌ {error}</p>
            )}
            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="text" placeholder="Email" />
            <input value={password} onChange={(e)=>{setPasword(e.target.value)}} type="password" placeholder="password" />
            <button onClick={handleAuthenticate}><p>{isAuthenticating ? 'Authenticating...': "Submit"}</p></button>
            <hr />
            <div className="register-content">
                <p>{isRegistration ? 'Already have an account?': "Don't have an account?"}</p>
                <button onClick={()=>{setIsRegistration(!isRegistration)}}>{isRegistration ? 'Login': 'Sign Up'}</button>
            </div>
        </>
    )
}