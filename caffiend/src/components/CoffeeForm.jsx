import { useState } from "react";
import { coffeeOptions } from "../utils";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CoffeeForm(props){
    const {isAuthenticated} = props;
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    const [coffeeCost, setCoffeeCost] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const {globalData, setGlobalData, globalUser} = useAuth()

    async function handleSubmit (){
        if(!isAuthenticated){
            setShowModal(true);
            return;
        }

        try {
            // define a god clause that only submits the form if it is complete
            if(!selectedCoffee){
                return
            }

            // then we're going to create a new data object
            const newGlobalData = {
                ... (globalData || {})
            }

            const nowTime = Date.now()
            const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000)
            const timestamp = nowTime - timeToSubtract;
            const newData = {
                name: selectedCoffee,
                cost: coffeeCost
            }
            newGlobalData[timestamp] = newData
            // update the global state
            setGlobalData(newGlobalData)

            // persist the data in the firebase firestore
            console.log(selectedCoffee, coffeeCost, hour, min);
            const userRef = doc(db, 'users', globalUser.uid)
            const res = await setDoc(userRef, {
                [timestamp]: newData
            }, {merge: true})
            setSelectedCoffee(null);
            setHour(0)
            setMin(0)
            setCoffeeCost(0)
        } catch (err) {
            console.log(err.message)
        }        
    }

    return(
        <>
            {showModal && 
                (<Modal handleCloseModal = {()=>{setShowModal(false)}}>
                    <Authentication handleCloseModal = {()=>{setShowModal(false)}}/>
                </Modal>)
            }
            <div className="section-header">
                <i className="fa-solid fa-pencil" />
                <h2>Start Tracking Today</h2>
            </div>
            <h4>Select Coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0, 5).map((coffeeOption, optionIdx)=>{
                        return (
                        <button className={"button-card " + (coffeeOption.name == selectedCoffee ? 'coffee-button-selected': '')} key={optionIdx} 
                            onClick={()=>{
                                setSelectedCoffee(coffeeOption.name)
                                setShowCoffeeTypes(false);
                            }}>
                            <h4>{coffeeOption.name}</h4>
                            <p>{coffeeOption.caffeine} mg</p>
                        </button>
                        )
                    })}
                <button className={"button-card " + (showCoffeeTypes == true ? 'coffee-button-selected': '')} onClick={()=>{
                    setShowCoffeeTypes(true)
                    setSelectedCoffee(null)
                }} >
                    <h4>Other</h4>
                    <p>n/a</p>
                </button>
            </div>
            {showCoffeeTypes && 
                (<select name="coffee-list" id="coffee-list" onChange={(e)=>{
                    setSelectedCoffee(e.target.value)
                }}> 
                    <option value="null">Select Type</option>
                    {coffeeOptions.map((option, optionIdx)=>{
                        return(
                        <option value={option.name} key={optionIdx}
                            /*onClick={()=>{
                                setSelectedCoffee(option.name)
                            }}*/>
                            {option.name} ({option.caffeine} mg)
                        </option>
                        ) 
                    })}
                </select>)
            }

            <h4>Add the cost ($)</h4>
            <input value={coffeeCost} onChange={(e)=>{setCoffeeCost(e.target.value)}} className="w-full" type="number" 
                placeholder="4.50" />
            
            <h4>Time since consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select onClick={(e)=>{setHour(e.target.value)}} id="hours-select">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour, hourIdx)=>{
                            return(
                                <option key = {hourIdx} value={hour}>{hour}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <h6>Minutes</h6>
                    <select onClick={(e)=>{setMin(e.target.value)}} id="min-select">
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min, minIdx)=>{
                            return(
                                <option key = {minIdx} value={min}>{min}</option>
                            )
                        })}
                    </select>
                </div>
                <button onClick={handleSubmit}>
                    Add entry
                </button>
            </div>

        </>
    )
}