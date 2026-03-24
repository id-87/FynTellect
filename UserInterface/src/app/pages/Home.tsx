import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", balance: 4500 },
  { month: "Feb", balance: 5200 },
  { month: "Mar", balance: 4800 },
  { month: "Apr", balance: 6100 },
  { month: "May", balance: 5900 },
  { month: "Jun", balance: 7200 },
];

const recentTransactions = [
  { id: 1, description: "Grocery Shopping", amount: -85.50, date: "2026-03-23", category: "Food" },
  { id: 2, description: "Salary Deposit", amount: 3500.00, date: "2026-03-22", category: "Income" },
  { id: 3, description: "Electric Bill", amount: -120.00, date: "2026-03-21", category: "Utilities" },
  { id: 4, description: "Restaurant", amount: -45.00, date: "2026-03-20", category: "Food" },
];

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to FinTellect</h1>
        <p className="text-gray-600 mt-2">Your intelligent financial management companion</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,200.00</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (This Month)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$3,500.00</div>
            <p className="text-xs text-muted-foreground mt-1">From 3 sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (This Month)</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$1,250.50</div>
            <p className="text-xs text-muted-foreground mt-1">Across 8 categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,749.50</div>
            <p className="text-xs text-muted-foreground mt-1">58% of monthly budget</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
            <CardDescription>Your account balance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Last 4 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/transactions">
              <Button variant="outline" className="w-full mt-4">View All Transactions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/transactions">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Add Transaction
              </CardTitle>
              <CardDescription>Record a new income or expense</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/budget">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <TrendingUp className="h-5 w-5 mr-2" />
                Set Budget
              </CardTitle>
              <CardDescription>Configure budgets for categories</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/agent-chat">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <DollarSign className="h-5 w-5 mr-2" />
                Ask Agent
              </CardTitle>
              <CardDescription>Get financial insights and advice</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
