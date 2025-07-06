import BudgetForm from "@/components/budget-form";
import BudgetVsActualChart from "@/components/budget-comparison";
import SpendingInsights from "@/components/spending-insights";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function BudgetPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  //console.log("currentMonth", currentMonth);
  return (
    <div className="container mx-auto px-1 md:px-4 sm:px-6 lg:px-8 py-1 md:py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <Card className="order-4">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">
            Budget Management
          </CardTitle>
          <CardDescription className="text-sm">
            Set and manage your monthly budgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle>Set Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <BudgetForm />
              </CardContent>
            </Card>
            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingInsights month={currentMonth} />
              </CardContent>
            </Card>
          </div>
          <BudgetVsActualChart month={currentMonth} />
        </CardContent>
      </Card>
    </div>
  );
}
