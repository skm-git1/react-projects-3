import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getCaffeineAmount, timeSinceConsumption } from "../utils";

export default function History(){
    const {globalData} = useAuth()

    return(
        <>
            <div className="section-header">
                <i className="fa-solid fa-timeline" />
                <h2>History</h2>
            </div>
            <p><i>Hover over for more information</i></p>
            <div className="coffee-history">
                {Object.keys(globalData).sort((a, b) => b - a).map(
                    (utcTime, coffeeIdx) =>{
                        const coffee = globalData[utcTime]
                        const timeSinceCons = timeSinceConsumption(utcTime);
                        const originalAmount = getCaffeineAmount(coffee.name);
                        const remainingAmount = calculateCurrentCaffeineLevel({
                            [utcTime]: coffee
                        })

                        const summary = `${coffee.name} | ${timeSinceCons} ago | $ ${coffee.cost} | ${remainingAmount} mg / ${originalAmount} mg`;

                        return(
                            <div title={summary} key={coffeeIdx}>
                                <i className="fa-solid fa-mug-hot" />
                            </div>
                        )
                    }
                )}
            </div>
        </>
    )
}