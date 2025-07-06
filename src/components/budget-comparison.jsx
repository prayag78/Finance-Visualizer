"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryBudgets } from "@/lib/actions";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CATEGORIES, MONTH_NAMES } from "@/lib/items";


export default function BudgetComparison() {
  const [selectedCategory, setSelectedCategory] = useState("Food & Dining");
  const [chartData, setChartData] = useState([]);

  //console.log("chartData", chartData);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategoryBudgets(selectedCategory);
  
      // Create a map to combine duplicate months
      const monthMap = new Map();
  
      data.forEach((item) => {
        const key = `${item.month} ${item.year}`;
        if (monthMap.has(key)) {
          const existing = monthMap.get(key);
          monthMap.set(key, {
            name: key,
            Budget: Math.max(existing.Budget, item.budget),
            Spent: existing.Spent + item.spent,
          });
        } else {
          monthMap.set(key, {
            name: key,
            Budget: item.budget,
            Spent: item.spent,
          });
        }
      });
  
      let formatted = Array.from(monthMap.values());
  
      formatted.sort((a, b) => {
        const [monthA, yearA] = a.name.split(" ");
        const [monthB, yearB] = b.name.split(" ");
        const yearDiff = parseInt(yearA) - parseInt(yearB);
        if (yearDiff !== 0) return yearDiff;
        return MONTH_NAMES.indexOf(monthA) - MONTH_NAMES.indexOf(monthB);
      });
  
      setChartData(formatted);
    };
  
    fetchData();
  }, [selectedCategory]);
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Budget vs Spending</CardTitle>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px] mt-4">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `$${value.toFixed(2)}`,
                  name === "Budget" ? "Budget" : "Spent",
                ]}
              />
              <Legend />
              <Bar
                dataKey="Budget"
                fill="#8884d8"
                activeBar={<Rectangle fill="purple" stroke="blue" />}
              />
              <Bar
                dataKey="Spent"
                fill="#f97316"
                activeBar={<Rectangle fill="orange" stroke="red" />}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm">No data to display</p>
        )}
      </CardContent>
    </Card>
  );
}
