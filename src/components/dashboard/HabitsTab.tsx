import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  habitCheck: Array<{
    isDone: boolean;
    date: string;
  }>;
}

interface HabitsTabProps {
  token: string;
}

// MOCK: Przykładowe dane nawyków
const mockHabitsData: Habit[] = [
  {
    id: "1",
    name: "Ćwiczenia",
    habitCheck: [
      { isDone: true, date: "2025-12-15" },
      { isDone: true, date: "2025-12-16" },
      { isDone: false, date: "2025-12-17" },
      { isDone: true, date: "2025-12-18" },
    ]
  },
  {
    id: "2",
    name: "Czytanie",
    habitCheck: [
      { isDone: true, date: "2025-12-15" },
      { isDone: true, date: "2025-12-16" },
      { isDone: true, date: "2025-12-17" },
      { isDone: true, date: "2025-12-18" },
    ]
  },
  {
    id: "3",
    name: "Medytacja",
    habitCheck: [
      { isDone: false, date: "2025-12-15" },
      { isDone: true, date: "2025-12-16" },
      { isDone: true, date: "2025-12-17" },
      { isDone: false, date: "2025-12-18" },
    ]
  }
];

export function HabitsTab({ token }: HabitsTabProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // MOCK: Ładowanie danych z localStorage lub domyślnych
  useEffect(() => {
    const savedHabits = localStorage.getItem('mockHabits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(mockHabitsData);
      localStorage.setItem('mockHabits', JSON.stringify(mockHabitsData));
    }
    setIsLoading(false);
  }, [token]);

  // MOCK: Dodawanie nawyku
  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      habitCheck: []
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem('mockHabits', JSON.stringify(updatedHabits));
    
    setNewHabitName("");
    setIsDialogOpen(false);
    toast({
      title: "Sukces!",
      description: "Nawyk został dodany (tryb demo).",
    });
    setIsAdding(false);
  };

  // MOCK: Usuwanie nawyku
  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);
    localStorage.setItem('mockHabits', JSON.stringify(updatedHabits));
    toast({
      title: "Usunięto",
      description: "Nawyk został usunięty (tryb demo).",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Twoje nawyki</h2>
          <p className="text-muted-foreground">Zarządzaj swoimi codziennymi nawykami</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary hover-glow">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj nawyk
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border-glass">
            <DialogHeader>
              <DialogTitle>Dodaj nowy nawyk</DialogTitle>
            </DialogHeader>
            <form onSubmit={addHabit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="habit-name">Nazwa nawyku</Label>
                <Input
                  id="habit-name"
                  placeholder="np. Ćwiczenia, Czytanie, Medytacja..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="glass-card border-border-glass"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full gradient-primary hover-glow"
              >
                {isAdding ? "Dodawanie..." : "Dodaj nawyk"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Brak nawyków</h3>
          <p className="text-muted-foreground mb-6">
            Zacznij budować systematyczność dodając swój pierwszy nawyk
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="gradient-primary hover-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj pierwszy nawyk
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => {
            const totalChecks = habit.habitCheck?.length || 0;
            const completedChecks = habit.habitCheck?.filter(check => check.isDone).length || 0;
            const completionRate = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

            return (
              <div key={habit.id} className="glass-card p-6 rounded-2xl hover-glow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Wykonano</span>
                    <span className="font-semibold">{completedChecks}/{totalChecks}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    {completionRate}% skuteczności
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}