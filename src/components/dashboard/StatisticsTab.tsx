import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  habitCheck: Array<{
    isDone: boolean;
    date: string;
  }>;
}

interface StatisticsTabProps {
  token: string;
}

export function StatisticsTab({ token }: StatisticsTabProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error('Error fetching habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [token]);

  // Calculate statistics
  const getOverallStats = () => {
    const totalHabits = habits.length;
    const totalChecks = habits.reduce((sum, habit) => sum + (habit.habitCheck?.length || 0), 0);
    const completedChecks = habits.reduce((sum, habit) => 
      sum + (habit.habitCheck?.filter(check => check.isDone).length || 0), 0
    );
    const completionRate = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

    // Calculate streak (consecutive days with at least one habit completed)
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasCompletedHabit = habits.some(habit =>
        habit.habitCheck?.some(check =>
          check.isDone && new Date(check.date).toDateString() === checkDate.toDateString()
        )
      );
      
      if (hasCompletedHabit) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { totalHabits, totalChecks, completedChecks, completionRate, currentStreak };
  };

  // Get weekly completion data
  const getWeeklyData = () => {
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
      
      const completedToday = habits.reduce((sum, habit) => {
        const completedOnDay = habit.habitCheck?.filter(check =>
          check.isDone && new Date(check.date).toDateString() === date.toDateString()
        ).length || 0;
        return sum + completedOnDay;
      }, 0);

      weekData.push({
        day: dayName,
        completed: completedToday,
        date: date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })
      });
    }
    
    return weekData;
  };

  // Get habit performance data
  const getHabitPerformance = () => {
    return habits.map(habit => {
      const totalChecks = habit.habitCheck?.length || 0;
      const completedChecks = habit.habitCheck?.filter(check => check.isDone).length || 0;
      const rate = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
      
      return {
        name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
        rate,
        completed: completedChecks,
        total: totalChecks
      };
    });
  };

  // Get monthly trend data
  const getMonthlyTrend = () => {
    const monthData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      
      const completedToday = habits.reduce((sum, habit) => {
        const completedOnDay = habit.habitCheck?.filter(check =>
          check.isDone && new Date(check.date).toDateString() === date.toDateString()
        ).length || 0;
        return sum + completedOnDay;
      }, 0);

      monthData.push({
        date: date.getDate(),
        completed: completedToday
      });
    }
    
    return monthData;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getOverallStats();
  const weeklyData = getWeeklyData();
  const habitPerformance = getHabitPerformance();
  const monthlyTrend = getMonthlyTrend();

  const pieData = habitPerformance.map((habit, index) => ({
    name: habit.name,
    value: habit.completed,
    color: `hsl(${258 + index * 40}, 70%, 60%)`
  }));

  const COLORS = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3F4F6'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Statystyki i postępy</h2>
        <p className="text-muted-foreground">Analizuj swoje wyniki i motywuj się do dalszego działania</p>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Brak danych do analizy</h3>
          <p className="text-muted-foreground">
            Dodaj nawyki i zacznij je śledzić, aby zobaczyć swoje statystyki
          </p>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-6 rounded-2xl hover-glow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">{stats.totalHabits}</div>
                  <div className="text-sm text-muted-foreground">Aktywnych nawyków</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl hover-glow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">{stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Skuteczność</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl hover-glow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">{stats.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Seria dni</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl hover-glow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">{stats.completedChecks}</div>
                  <div className="text-sm text-muted-foreground">Wykonane akcje</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Aktywność w tym tygodniu</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-glass))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background-secondary))', 
                      border: '1px solid hsl(var(--border-glass))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="completed" fill="url(#gradient)" radius={4} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(258, 90%, 66%)" />
                      <stop offset="100%" stopColor="hsl(275, 80%, 55%)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Habit Performance */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Skuteczność nawyków</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={habitPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-glass))" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background-secondary))', 
                      border: '1px solid hsl(var(--border-glass))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="rate" fill="url(#gradient2)" radius={4} />
                  <defs>
                    <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(258, 90%, 66%)" />
                      <stop offset="100%" stopColor="hsl(310, 85%, 60%)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Trend miesięczny</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-glass))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background-secondary))', 
                      border: '1px solid hsl(var(--border-glass))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="hsl(258, 90%, 66%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(258, 90%, 66%)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Habit Distribution */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Rozkład wykonanych nawyków</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background-secondary))', 
                      border: '1px solid hsl(var(--border-glass))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}