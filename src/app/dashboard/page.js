import DashboardSummary from "@/components/dashboard-summary";
import CategoryPieChart from "@/components/category-pie-chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <DashboardSummary />
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">
            Category Breakdown
          </CardTitle>
          <CardDescription className="text-sm">
            See where your money goes by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <CategoryPieChart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
