import { useState } from "react";
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const mockBudgets = [
  { id: 1, category: "Food", budget: 500, spent: 143, period: "monthly" },
  { id: 2, category: "Transportation", budget: 200, spent: 60, period: "monthly" },
  { id: 3, category: "Utilities", budget: 300, spent: 200, period: "monthly" },
  { id: 4, category: "Entertainment", budget: 150, spent: 95, period: "monthly" },
  { id: 5, category: "Healthcare", budget: 200, spent: 0, period: "monthly" },
  { id: 6, category: "Shopping", budget: 250, spent: 180, period: "monthly" },
];

export function BudgetConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<typeof mockBudgets[0] | null>(null);

  const handleEdit = (budget: typeof mockBudgets[0]) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // This would call your MongoDB backend API
    console.log("Delete budget:", id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would call your MongoDB backend API to create/update
    console.log("Submit budget:", editingBudget);
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const getPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = getPercentage(totalSpent, totalBudget);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Configuration</h1>
          <p className="text-gray-600 mt-2">Set and manage budgets for different categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBudget(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
              <DialogDescription>
                {editingBudget ? "Update budget details" : "Set a budget for a category"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={editingBudget?.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Amount</Label>
                  <Input 
                    id="budget" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    defaultValue={editingBudget?.budget} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select defaultValue={editingBudget?.period || "monthly"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBudget ? "Update" : "Add"} Budget
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Budget Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Budget Summary</CardTitle>
          <CardDescription>Total budget across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className={`text-2xl font-bold ${getStatusColor(totalPercentage)}`}>
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(totalBudget - totalSpent).toFixed(2)}
                </p>
              </div>
            </div>
            <Progress value={totalPercentage} className="h-3" />
            <p className="text-sm text-gray-600">
              {totalPercentage.toFixed(1)}% of total budget used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBudgets.map((budget) => {
          const percentage = getPercentage(budget.spent, budget.budget);
          const remaining = budget.budget - budget.spent;
          
          return (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                    <CardDescription className="capitalize">{budget.period}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(budget.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className={`font-semibold ${getStatusColor(percentage)}`}>
                      ${budget.spent.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold">${budget.budget.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`h-4 w-4 ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`font-bold ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(remaining).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
