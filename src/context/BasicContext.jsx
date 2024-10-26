import { useState , createContext } from "react";

export const BasicContext=createContext();


function BasicProvider(props){
    const [showFormModel,setShowFormModel]=useState(false);
    const [purchaseData,setPurchaseData]=useState({});
    const [comingSoonModel,setComingSoonModel] = useState(false);


    const options={
        showFormModel,
        setShowFormModel,
        purchaseData,
        setPurchaseData,
        comingSoonModel,
        setComingSoonModel
    }
    
    
    return(
     <BasicContext.Provider value={options}>
        {props.children}
     </BasicContext.Provider>

    )}

export default BasicProvider;