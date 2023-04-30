import { useNavigate } from "react-router";
import { useLocalStorageListener, validateLocalStorage } from "../../../lib/helpers/LocalStorageListener";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DropDown, CustomButton, CustomDecorations } from "../../../components/componentConfig";
import { useLogout } from "../../../hooks/auth/useAuth";
import { HOME } from "../../../lib/routes";
import { fadeAnimation } from "../../../lib/helpers/Motion";
import { useGetCurrentUser, useParcel } from "../../../hooks/hooksConfig";
import { Parcel as ParcelType } from "../../../hooks/hooksConfig";
import { clientState } from "../../../store/storeConfig";
import { useToast } from "@chakra-ui/react";
import { SearchBar } from "../../../components/SearchBar";
import { ParcelHistory } from "../../../components/ParcelHistory";
import '../../../stylesheets/MerchantHistoryStyle.css';
import { 
    ParcelHistoryBG, dropDownBtn, returnBtn, whiteCircle, pinkSquare, whiteSquare,
} from "../../../assets/assetsConfig";



export const MerchantHistory = () => {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const [ showActiveParcels, setShowActiveParcels ] = useState< boolean | null>(null);
    const [ pastParcels, setPastParcels ] = useState<string[]>();
    const { fetchUserInfo } = useGetCurrentUser();
    const [ selectedTrackingNumber, setSelectedTrackingNumber ] = useState<string | null>(null);
    const [ parcelSnapshot, setParcelSnapShot ] = useState<ParcelType | undefined | null>(null);
    const { getParcel } = useParcel();
    const toast = useToast();

    const handlePastParcelChoice = async (trackingNumber: string) => {
        setSelectedTrackingNumber(trackingNumber);
        setShowActiveParcels(false);
        try {
            const parcelSnapshot = await getParcel(trackingNumber, 'data') as ParcelType;
            clientState.parcelIsFound = true;
            clientState.parcelID = trackingNumber;
            setParcelSnapShot(parcelSnapshot as ParcelType);
        } catch(err: unknown) {
            if(err instanceof Error) {
                toast({
                    title: 'Something went wrong...',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: err.message,
                    duration: 3000,
                });
                clientState.parcelID = '';
                setParcelSnapShot(null);
            } 
        }
    };

    const handleFetch = async () => {
        try {
            const activeParcels = await fetchUserInfo('pastParcels') as string[];
            setPastParcels(activeParcels);
        } catch(error: unknown) {
            if(error instanceof Error)
                console.log(error.message);
        };
    };

    useEffect(() => {
        const isMerchant = validateLocalStorage('merchant');
        if(!isMerchant) navigate('/InvalidRequest?_Redirect');
        // Grabbing all the data
        handleFetch();
    }, []);

    useLocalStorageListener();

    return (
        <AnimatePresence>
            <div className = 'merchntAPWrapper'>
                <motion.div {...fadeAnimation}>
                    {showActiveParcels && (
                        <div className = 'merchantAPContainer'>
                            { pastParcels && (
                                <DropDown 
                                    parcelArr = {pastParcels}
                                    handleChoice = {handlePastParcelChoice}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
                <motion.div>
                    <SearchBar
                        trackingNumber = {selectedTrackingNumber? selectedTrackingNumber : 'Select a Parcel...'}
                    />
                </motion.div>
                <CustomButton 
                    btnType = ''
                    btnText = 'Logout' 
                    customStyles = 'mt-2 fixed text-white w-24 h-8' 
                    handleClick = {async () => await logout()}
                    image = ''
                    cssName = 'globalLoginBtn'                
                />
                <motion.div>
                    {parcelSnapshot && (
                        <div className = 'ParcelHistoryContainer'>
                            <ParcelHistory 
                                address={parcelSnapshot.address}
                                information={parcelSnapshot.information}
                                location={parcelSnapshot.location}
                                recipient={parcelSnapshot.recipient}
                                visualCue={parcelSnapshot.visualCue}
                                locationHistory={parcelSnapshot.locationHistory}
                                informationHistory={parcelSnapshot.informationHistory}
                                cueHistory={parcelSnapshot.cueHistory}
                                timeDelivered={parcelSnapshot.timeDelivered} 
                                provider= ''                         
                            />
                        </div>
                    )}
                </motion.div>
                <motion.div>
                    <CustomButton 
                        btnType = 'img'
                        btnText = ''
                        customStyles = 'cursor-pointer'
                        handleClick={() => navigate(HOME)}
                        image = { returnBtn }
                        cssName = 'returnBtnGlobal'             
                    />
                    <CustomButton 
                        btnType = 'img'
                        btnText = ''
                        customStyles = 'cursor-pointer'
                        handleClick={() => {
                            setShowActiveParcels(!showActiveParcels);
                        }}
                        image = { dropDownBtn }
                        cssName = 'globalDropDownBtn'             
                    />
                </motion.div>
                <motion.div>
                    <CustomDecorations 
                        decors = {[
                            {
                                iconName: ParcelHistoryBG,
                                cssName: 'MerchantHistoryParcelBG',
                                customStyles: 'w-full h-full m-0 overflow-hidden box-border fixed pointer-events-none',
                            },
                            {
                                iconName: whiteCircle,
                                cssName: 'mhpWC1',
                                customStyles: ''
                            },
                            {
                                iconName: whiteCircle,
                                cssName: 'mhpWC2',
                                customStyles: ''
                            },
                            {
                                iconName: whiteCircle,
                                cssName: 'mhpWC3',
                                customStyles: ''
                            },
                            {
                                iconName: pinkSquare,
                                cssName: 'mhpPS1',
                                customStyles: ''
                            },
                            {
                                iconName: pinkSquare,
                                cssName: 'mhpPS2',
                                customStyles: ''
                            },
                            {
                                iconName: pinkSquare,
                                cssName: 'mhpPS3',
                                customStyles: ''
                            },
                            {
                                iconName: pinkSquare,
                                cssName: 'mhpPS4',
                                customStyles: ''
                            },
                            {
                                iconName: pinkSquare,
                                cssName: 'mhpPS5',
                                customStyles: ''
                            },
                            {
                                iconName: whiteSquare,
                                cssName: 'mhpWS1',
                                customStyles: ''
                            },
                        ]}                
                    />
                </motion.div>
            </div>
        </AnimatePresence>
    );
};