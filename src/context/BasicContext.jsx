import { useState , createContext } from "react";

export const BasicContext=createContext();


function BasicProvider(props){
    const [showFormModel,setShowFormModel]=useState(false);
    const [comingSoonModel,setComingSoonModel] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState();
    const [videoFormData, setVideoFormData] = useState();
    const [personalizationFormData,setPersonalizationFormData] = useState();
    const [giftFormData, setGiftFormData] = useState();



    const options={
        showFormModel,
        setShowFormModel,
        comingSoonModel,
        setComingSoonModel,
        selectedVideo,
        setSelectedVideo,
        videoFormData,
        setVideoFormData,
        personalizationFormData,
        setPersonalizationFormData,
        giftFormData,
        setGiftFormData
    }
    
    
    return(
     <BasicContext.Provider value={options}>
        {props.children}
     </BasicContext.Provider>

    )}

export default BasicProvider;