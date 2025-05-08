import {
  createContext,
  useContext,
  useState,
  type JSX,
  type ReactNode,
} from "react";

export interface GlobalContextType {
  currentCompanionId: string;
  updateCompanionId: (companionId: string) => void;
}

export const GlobalContext = createContext<GlobalContextType>({
  currentCompanionId: "",
  updateCompanionId: () => {},
});

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({
  children,
}: GlobalProviderProps): JSX.Element => {
  const [currentCompanionId, setCurrentCompanionId] = useState<string>("");

  const updateCompanionId = (companionId: string) => {
    setCurrentCompanionId(companionId);
  };

  return (
    <GlobalContext.Provider value={{ currentCompanionId, updateCompanionId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobal must be used within an GlobalProvider");
  }

  return context;
};
