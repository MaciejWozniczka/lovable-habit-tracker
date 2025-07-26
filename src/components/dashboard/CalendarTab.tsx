import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  habitCheck: Array<{
    isDone: boolean;
    date: string;
  }>;
}

interface CalendarTabProps {
  token: string;
}

export function CalendarTab({ token }: CalendarTabProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = "https://lifemanager.bieda.it";

  const fetchHabits = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/habits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success && result.value?.habits) {
        setHabits(result.value.habits);
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać nawyków.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabitCheck = async (habitId: string, date: Date) => {
    const dateString = date.toISOString();
    const habit = habits.find(h => h.id === habitId);
    const existingCheck = habit?.habitCheck?.find(check => 
      new Date(check.date).toDateString() === date.toDateString()
    );

    try {
      if (existingCheck?.isDone) {
        // Remove check
        const response = await fetch(`${API_URL}/api/habit/${habitId}/check`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: dateString }),
        });

        const result = await response.json();
        if (result.success) {
          await fetchHabits(); // Refresh data
        }
      } else {
        // Add check
        const response = await fetch(`${API_URL}/api/habit/${habitId}/check`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: dateString }),
        });

        const result = await response.json();
        if (result.success) {
          await fetchHabits(); // Refresh data
        }
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować nawyku.",
        variant: "destructive",
      });
    }
  };

  const isHabitCompleted = (habitId: string, date: Date) => {
    const habit = habits.find(h => h.id === habitId);
    return habit?.habitCheck?.some(check => 
      check.isDone && new Date(check.date).toDateString() === date.toDateString()
    ) || false;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  const dayNames = ["Ndz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

  useEffect(() => {
    fetchHabits();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Kalendarz nawyków</h2>
          <p className="text-muted-foreground">Śledź swoje codzienne postępy</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth} className="glass-card border-border-glass">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-semibold min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <Button variant="outline" size="sm" onClick={nextMonth} className="glass-card border-border-glass">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Brak nawyków do śledzenia</h3>
          <p className="text-muted-foreground">
            Dodaj nawyki w zakładce "Nawyki", aby móc je śledzić w kalendarzu
          </p>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 rounded-lg border transition-all ${
                  date 
                    ? isToday(date)
                      ? 'border-primary bg-primary/10'
                      : 'border-border-glass hover:border-primary/50'
                    : 'border-transparent'
                }`}
              >
                {date && (
                  <>
                    <div className="text-sm font-medium mb-2 text-center">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {habits.map(habit => (
                        <button
                          key={habit.id}
                          onClick={() => toggleHabitCheck(habit.id, date)}
                          className={`w-full text-xs p-1 rounded transition-all ${
                            isHabitCompleted(habit.id, date)
                              ? 'gradient-primary text-white font-medium'
                              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                          }`}
                          title={habit.name}
                        >
                          {habit.name.length > 10 ? `${habit.name.substring(0, 10)}...` : habit.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-border-glass">
            <h4 className="text-sm font-medium mb-2">Legenda:</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded gradient-primary"></div>
                <span>Wykonano</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted"></div>
                <span>Nie wykonano</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}