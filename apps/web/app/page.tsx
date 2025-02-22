import { ExpandableCardDemo } from "./components/DashboardCard";
import Topbar from "./components/topBar";




export default function Page() {
  return (
    <div>
      <div>
        <Topbar/>
      </div>
      <div className="p-4">
        <ExpandableCardDemo/>
      </div>
    </div>
  );
}
