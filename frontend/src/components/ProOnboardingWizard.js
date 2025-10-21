import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, ChevronRight, Sparkles, TrendingUp, Target, Calendar, Clock, Brain, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const ProOnboardingWizard = ({ isOpen, onClose, onComplete }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [checklist, setChecklist] = useState({
    day1: {
      welcome: false,
      setupGoals: false,
      logFirstActivity: false,
      explorePnL: false
    },
    day2: {
      logActivity: false,
      dailyReflection: false,
      checkAICoach: false,
      reviewGoals: false
    },
    day3: {
      timeBlocking: false,
      weeklyReview: false,
      customizeDashboard: false,
      masterAI: false
    }
  });

  // Calculate progress
  const getDayProgress = (day) => {
    const tasks = Object.values(checklist[`day${day}`]);
    const completed = tasks.filter(Boolean).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const toggleTask = (day, task) => {
    setChecklist(prev => ({
      ...prev,
      [`day${day}`]: {
        ...prev[`day${day}`],
        [task]: !prev[`day${day}`][task]
      }
    }));
  };

  // Save progress to localStorage
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('pro_onboarding_checklist', JSON.stringify(checklist));
      localStorage.setItem('pro_onboarding_day', currentDay.toString());
    }
  }, [checklist, currentDay, isOpen]);

  // Load progress from localStorage
  useEffect(() => {
    const savedChecklist = localStorage.getItem('pro_onboarding_checklist');
    const savedDay = localStorage.getItem('pro_onboarding_day');
    
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
    if (savedDay) {
      setCurrentDay(parseInt(savedDay));
    }
  }, []);

  const dayContent = {
    1: {
      title: "Day 1: Foundation & Setup",
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      description: "Let's get you set up for success! Today we'll establish your foundation.",
      tasks: [
        {
          id: 'welcome',
          title: 'Welcome to I Need Numbers Pro! 🎉',
          description: 'Understanding your new tools',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium text-emerald-700">You now have access to powerful tools that work together:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span><strong>Activity Tracker:</strong> Log your daily actions (calls, appointments, listings)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span><strong>P&L Tracker:</strong> Track income and expenses to understand your profitability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span><strong>Fairy AI Coach:</strong> Your personal AI that learns from your data to give tailored insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span><strong>Goals Tab:</strong> Set targets and track progress toward your income goals</span>
                </li>
              </ul>
              <div className="bg-emerald-50 p-3 rounded-lg mt-3">
                <p className="text-emerald-900 font-medium">🔑 Key Insight:</p>
                <p className="text-emerald-800 text-xs">These tools feed each other. Your activity logs help AI understand your patterns. Your P&L shows what's working. Your goals keep you focused.</p>
              </div>
            </div>
          )
        },
        {
          id: 'setupGoals',
          title: 'Set Your Monthly Goals',
          description: 'Define your targets for income and activities',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Navigate to Dashboard → Goals Tab</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>Set your <strong>Monthly Income Goal</strong> (e.g., $8,000)</li>
                <li>Set <strong>Activity Targets</strong>:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Conversations: 12/day (360/month)</li>
                    <li>• Appointments: 2/day (60/month)</li>
                    <li>• New Listings: 1/week (4/month)</li>
                  </ul>
                </li>
                <li>Review your daily/monthly targets</li>
              </ol>
              <div className="bg-blue-50 p-3 rounded-lg mt-3">
                <p className="text-blue-900 font-medium">💡 Pro Tip:</p>
                <p className="text-blue-800 text-xs">Start with realistic numbers. You can always adjust as you learn your capacity.</p>
              </div>
            </div>
          )
        },
        {
          id: 'logFirstActivity',
          title: 'Log Your First Activities',
          description: 'Record today\'s conversations and appointments',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Navigate to Action Tracker → Click "Log Activity"</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>Enter the activities you completed today:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• How many conversations did you have?</li>
                    <li>• How many appointments?</li>
                    <li>• Any new listings or offers?</li>
                  </ul>
                </li>
                <li>Log the hours spent on different tasks</li>
                <li>Add a brief reflection (optional for now)</li>
                <li>Click "Save" to log your activities</li>
              </ol>
              <div className="bg-purple-50 p-3 rounded-lg mt-3">
                <p className="text-purple-900 font-medium">🎯 Why This Matters:</p>
                <p className="text-purple-800 text-xs">Tracking activities shows you what leads to results. The AI uses this data to spot patterns and give you personalized recommendations.</p>
              </div>
            </div>
          )
        },
        {
          id: 'explorePnL',
          title: 'Explore the P&L Tracker',
          description: 'Add your first deal and expenses',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Navigate to Agent P&L Tracker</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li><strong>Add a Deal:</strong> Enter a recent closed transaction
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Sale price, commission split, GCI earned</li>
                    <li>• Deal costs (photos, staging, etc.)</li>
                  </ul>
                </li>
                <li><strong>Add Expenses:</strong> Track your business costs
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• MLS dues, insurance, marketing</li>
                    <li>• Set recurring expenses to auto-track</li>
                  </ul>
                </li>
                <li>Review your profitability dashboard</li>
              </ol>
              <div className="bg-amber-50 p-3 rounded-lg mt-3">
                <p className="text-amber-900 font-medium">💰 Business Insight:</p>
                <p className="text-amber-800 text-xs">Most agents focus on GCI, but profit is what matters. P&L tracking shows your real take-home and helps AI identify areas to improve margins.</p>
              </div>
            </div>
          )
        }
      ]
    },
    2: {
      title: "Day 2: Building Habits",
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      description: "Let's establish your daily routine and explore AI insights.",
      tasks: [
        {
          id: 'logActivity',
          title: 'Log Today\'s Activities',
          description: 'Make activity logging a daily habit',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Action Tracker → Log Activity</p>
              <p>Today, focus on being thorough:</p>
              <ul className="space-y-2 ml-4">
                <li>• Record ALL conversations (not just promising ones)</li>
                <li>• Track appointments, showings, and listings</li>
                <li>• Note the hours spent in each activity category</li>
              </ul>
              <div className="bg-emerald-50 p-3 rounded-lg mt-3">
                <p className="text-emerald-900 font-medium">⏰ Time Blocking Tip:</p>
                <p className="text-emerald-800 text-xs">Block 10 minutes at end of day to log activities. Consistency beats perfection. Even rough numbers are better than none!</p>
              </div>
            </div>
          )
        },
        {
          id: 'dailyReflection',
          title: 'Complete Your First Daily Reflection',
          description: 'Review your day and learn from it',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Why Daily Reflection Matters</p>
              <p>Reflection turns experience into wisdom. Answer these:</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>What worked well today?</li>
                <li>What would you do differently?</li>
                <li>Any insights or lessons learned?</li>
                <li>How did you feel about your productivity?</li>
              </ol>
              <div className="bg-blue-50 p-3 rounded-lg mt-3">
                <p className="text-blue-900 font-medium">🧠 AI Learning:</p>
                <p className="text-blue-800 text-xs">Your reflections help Fairy AI understand context. When you note "struggled with follow-ups," AI can suggest time management strategies.</p>
              </div>
            </div>
          )
        },
        {
          id: 'checkAICoach',
          title: 'Get Your First AI Insights',
          description: 'See what Fairy AI has learned about you',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Try AI Coach in Multiple Places:</p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Dashboard:</strong> Click AI Coach for daily insights</li>
                <li>• <strong>Calculators:</strong> Get deal analysis with AI recommendations</li>
                <li>• <strong>P&L Tracker:</strong> Ask AI about expense patterns</li>
              </ul>
              <div className="bg-purple-50 p-3 rounded-lg mt-3">
                <p className="text-purple-900 font-medium">✨ AI Gets Smarter:</p>
                <p className="text-purple-800 text-xs">The more you use the platform (log activities, track deals, reflect), the better AI's insights become. It learns YOUR patterns, not generic advice.</p>
              </div>
            </div>
          )
        },
        {
          id: 'reviewGoals',
          title: 'Review Your Goal Progress',
          description: 'Check how you\'re tracking against targets',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Goals Tab → Review Progress</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>Compare actual activities vs. targets</li>
                <li>Check your income projection based on current pace</li>
                <li>Note any gaps (e.g., "need 3 more appointments")</li>
                <li>Adjust tomorrow's focus based on gaps</li>
              </ol>
              <div className="bg-amber-50 p-3 rounded-lg mt-3">
                <p className="text-amber-900 font-medium">🎯 Course Correction:</p>
                <p className="text-amber-800 text-xs">Daily reviews let you adjust before falling behind. If you're short on conversations, tomorrow you know to prioritize prospecting.</p>
              </div>
            </div>
          )
        }
      ]
    },
    3: {
      title: "Day 3: Mastery & Optimization",
      icon: <Trophy className="w-6 h-6 text-purple-600" />,
      description: "You're ready to master time blocking and leverage advanced features.",
      tasks: [
        {
          id: 'timeBlocking',
          title: 'Implement Time Blocking',
          description: 'Structure your day for maximum productivity',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Time Blocking Framework for Real Estate Agents:</p>
              <div className="space-y-2">
                <div className="bg-emerald-50 p-2 rounded">
                  <p className="font-medium text-emerald-900">🌅 Morning (8-10 AM): Lead Generation</p>
                  <p className="text-xs text-emerald-800">Prospecting calls, follow-ups, sphere outreach</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="font-medium text-blue-900">☀️ Mid-Day (10 AM-2 PM): Appointments</p>
                  <p className="text-xs text-blue-800">Showings, buyer consultations, listing presentations</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="font-medium text-purple-900">🌆 Afternoon (2-5 PM): Admin & Marketing</p>
                  <p className="text-xs text-purple-800">Paperwork, social media, email, transaction management</p>
                </div>
                <div className="bg-amber-50 p-2 rounded">
                  <p className="font-medium text-amber-900">🌙 Evening (5-6 PM): Review & Planning</p>
                  <p className="text-xs text-amber-800">Log activities, daily reflection, plan tomorrow</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg mt-3">
                <p className="text-gray-900 font-medium text-xs">📚 Learn More:</p>
                <a 
                  href="https://placester.com/real-estate-marketing-academy/time-blocking-for-real-estate-agents-getting-started-guide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 text-xs underline"
                >
                  Complete Time Blocking Guide for Real Estate Agents →
                </a>
              </div>
            </div>
          )
        },
        {
          id: 'weeklyReview',
          title: 'Plan Your Weekly Review Process',
          description: 'Set up your rhythm for long-term success',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Weekly Review Checklist (Every Sunday):</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>Review last week's activity totals vs. goals</li>
                <li>Check P&L: deals closed, profit margins, expense trends</li>
                <li>Read AI Coach insights for the week</li>
                <li>Identify patterns: What days/activities were most productive?</li>
                <li>Set next week's priorities based on gaps</li>
              </ol>
              <div className="bg-emerald-50 p-3 rounded-lg mt-3">
                <p className="text-emerald-900 font-medium">📊 Data-Driven Decisions:</p>
                <p className="text-emerald-800 text-xs">Weekly reviews reveal trends daily tracking misses. Maybe Tuesdays are your best prospecting days, or certain expense categories are creeping up.</p>
              </div>
            </div>
          )
        },
        {
          id: 'customizeDashboard',
          title: 'Customize Your Dashboard',
          description: 'Make the platform work for YOUR workflow',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Dashboard Customization:</p>
              <ul className="space-y-2 ml-4">
                <li>• Pin your most-used calculators</li>
                <li>• Set up recurring expenses in P&L</li>
                <li>• Customize activity categories to match your business</li>
                <li>• Upload your branding for investor PDFs</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-lg mt-3">
                <p className="text-blue-900 font-medium">⚡ Power User Tip:</p>
                <p className="text-blue-800 text-xs">The platform adapts to you. The more you customize and use it, the more valuable it becomes. Make it YOUR business command center.</p>
              </div>
            </div>
          )
        },
        {
          id: 'masterAI',
          title: 'Master the Fairy AI Coach',
          description: 'Unlock the full power of AI insights',
          content: (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Getting the Most from Fairy AI:</p>
              <ol className="space-y-2 ml-4 list-decimal">
                <li><strong>Be Consistent:</strong> AI needs 2-3 weeks of data to spot patterns</li>
                <li><strong>Be Detailed:</strong> More context = better insights</li>
                <li><strong>Act on Insights:</strong> AI learns what works when you try its suggestions</li>
                <li><strong>Ask Questions:</strong> Use AI Coach on calculators for deal-specific advice</li>
              </ol>
              <div className="bg-purple-50 p-3 rounded-lg mt-3">
                <p className="text-purple-900 font-medium">🧠 AI Feedback Loop:</p>
                <p className="text-purple-800 text-xs">Track activities → AI spots patterns → Suggests improvements → You test them → Track results → AI refines suggestions. It's your personal business analyst!</p>
              </div>
            </div>
          )
        }
      ]
    }
  };

  if (!isOpen) return null;

  const currentDayData = dayContent[currentDay];
  const progress = getDayProgress(currentDay);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex justify-between items-start">
          <div className="flex items-start space-x-3">
            {currentDayData.icon}
            <div>
              <h2 className="text-2xl font-bold">{currentDayData.title}</h2>
              <p className="text-emerald-100 text-sm mt-1">{currentDayData.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-emerald-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Day {currentDay} Progress</span>
            <span className="text-sm font-bold text-emerald-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Day Navigation */}
        <div className="flex space-x-2 px-6 pt-4">
          {[1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                currentDay === day
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentDayData.tasks.map((task, index) => (
            <Card 
              key={task.id}
              className={`border-2 transition-all ${
                checklist[`day${currentDay}`][task.id]
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTask(currentDay, task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {checklist[`day${currentDay}`][task.id] ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    {task.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              localStorage.setItem('pro_onboarding_dismissed', 'true');
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            I'll do this later
          </button>
          <div className="flex items-center space-x-3">
            {currentDay < 3 && (
              <Button
                onClick={() => setCurrentDay(currentDay + 1)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next Day <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {currentDay === 3 && progress === 100 && (
              <Button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Complete Onboarding 🎉
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProOnboardingWizard;
