import config from 'config/config';
import React, { createContext, useState } from 'react'
import { isElectron } from 'react-device-detect';
import LoggerService from 'services/LoggerService';


export type GlobalVariablesContextType = {
  autoPrint: boolean;
  setAutoPrint: React.Dispatch<React.SetStateAction<boolean>>;
  soundNotification: boolean;
  setSoundNotification: React.Dispatch<React.SetStateAction<boolean>>;
  isDarwinElectron: boolean;
  soundRepeats: number;
  setSoundRepeats: React.Dispatch<React.SetStateAction<number>>;
  showCounterSaleCloseModal: boolean;
  setShowCounterSaleCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalVariablesContext = createContext<GlobalVariablesContextType | null>(null);

const  GlobalVariablesProvider: React.FC<React.ReactNode> = ({ children }) => {
  //Add global variables here
  const [autoPrint, setAutoPrint] = useState(true);
  const [soundNotification, setSoundNotification] = useState(true);
  const [soundRepeats, setSoundRepeats] = useState(3);
  const [showCounterSaleCloseModal, setShowCounterSaleCloseModal] = useState(true);
  const isDarwinElectron: boolean = isElectron;
  LoggerService.initialize(config.environment, isDarwinElectron);


  return (
    <GlobalVariablesContext.Provider 
    value={{autoPrint, setAutoPrint, 
            soundNotification, setSoundNotification, 
            isDarwinElectron,
            soundRepeats, setSoundRepeats, 
            showCounterSaleCloseModal, setShowCounterSaleCloseModal}}>
      {children}
    </GlobalVariablesContext.Provider>
  )
}

export default GlobalVariablesProvider;