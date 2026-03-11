import { useDashboard } from "../hooks/useDashboard";
import DashboardHeader from "../components/DashboardHeader";
import StatCards from "../components/StatCards";
import StatusCards from "../components/StatusCards";
import SalesCharts from "../components/SalesCharts";
import OrdersCharts from "../components/OrdersCharts";
import BottomCharts from "../components/BottomCharts";

export default function DashboardPage() {
  const { data, isLoading, isFetching, refetch } = useDashboard();

  return (
    <div className="space-y-5 p-4 lg:p-8">
      <DashboardHeader isFetching={isFetching} onRefetch={refetch} />
      <StatCards data={data} isLoading={isLoading} />
      <StatusCards data={data} isLoading={isLoading} />
      <SalesCharts data={data} isLoading={isLoading} />
      <OrdersCharts data={data} isLoading={isLoading} />
      <BottomCharts data={data} isLoading={isLoading} />
    </div>
  );
}
