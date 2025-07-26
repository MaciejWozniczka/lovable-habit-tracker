import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Calendar, Target, BarChart3 } from "lucide-react";
import { HabitsTab } from "./HabitsTab";
import { CalendarTab } from "./CalendarTab";
import { StatisticsTab } from "./StatisticsTab";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export function Dashboard({ token, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("calendar");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    onLogout();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border-glass glass-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Habit Tracker</h1>
              <p className="text-sm text-muted-foreground">Buduj systematyczność każdego dnia</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="glass-card border-border-glass hover-glow"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass border-border-glass w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="calendar" className="flex-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Kalendarz</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex-1 flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Nawyki</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statystyki</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <CalendarTab token={token} />
          </TabsContent>

          <TabsContent value="habits">
            <HabitsTab token={token} />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTab token={token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}