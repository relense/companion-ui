import { useAuth } from "../../hooks/useAuth";
import HistoryView from "../../views/HistoryView/HistoryView";

const History = () => {
  const auth = useAuth();

  const signOut = () => {
    auth.signOut();
  };

  return <HistoryView signOut={signOut} />;
};

export default History;
