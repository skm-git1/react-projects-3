import { useState } from "react"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useAuth } from "../context/AuthContext";

export default function Layout(props){
    const {children} = props
    const [showModal, setShowModal] = useState(false);
    const {globalUser, logout} = useAuth()
    
    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Coffee Insatiates</p>
            </div>
            {globalUser ? 
                (<button onClick={logout}>
                    <p>Logout</p>
                </button>) : 
                (<button onClick={()=>{setShowModal(true)}}>
                <p>Sign up for free</p>
                <i class="fa-solid fa-mug-hot"></i>
                </button>)}
        </header>
    )

    const footer = (
        <footer>
            <p>Caffiend was made by <a target="_blank" href="https://www.github.com/skm-git1">Samant</a> using React and Firebase.</p>
        </footer>
    )

    return(
        <>
            {showModal && 
            (<Modal handleCloseModal = {()=>{setShowModal(false)}}>
                <Authentication handleCloseModal = {()=>{setShowModal(false)}}/>
            </Modal>)
            }
            {header}
            <main>
                {children}                
            </main>
            {footer}
        </>
    )
}