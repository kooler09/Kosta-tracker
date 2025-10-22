import React, { useState, useEffect } from 'react';
import { Check, Download, Copy, TrendingUp, Calendar, Target, Flame } from 'lucide-react';

export default function KostaTrackerApp() {
  const [currentWeight, setCurrentWeight] = useState(186);
  const [targetWeight] = useState(170);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekData, setWeekData] = useState({});
  const [showExport, setShowExport] = useState(false);

  // Initialize today's data if it doesn't exist
  useEffect(() => {
    if (!weekData[selectedDate]) {
      setWeekData(prev => ({
        ...prev,
        [selectedDate]: createEmptyDay()
      }));
    }
  }, [selectedDate]);

  function createEmptyDay() {
    return {
      morning: {
        wokeOnTime: false,
        supplements: false,
        proteinShake: false
      },
      work: {
        deepWork1: false,
        deepWork2: false,
        noSocialMedia: false
      },
      meals: {
        meal2: false,
        meal3: false,
        meal4: false,
        meal5: false,
        proteinTarget: false,
        calorieTarget: false,
        noSnacks: false
      },
      workout: {
        completed: false,
        preWorkout: false,
        postWorkout: false,
        exercises: {
          exercise1: { weight: '', sets: '' },
          exercise2: { weight: '', sets: '' },
          exercise3: { weight: '', sets: '' },
          exercise4: { weight: '', sets: '' },
          exercise5: { weight: '', sets: '' },
          exercise6: { weight: '', sets: '' },
          exercise7: { weight: '', sets: '' }
        }
      },
      evening: {
        peptides: false,
        prepped: false,
        bedtime: false
      },
      weight: currentWeight,
      notes: ''
    };
  }

  const today = weekData[selectedDate] || createEmptyDay();

  function updateField(category, field, value) {
    setWeekData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [category]: {
          ...prev[selectedDate]?.[category],
          [field]: value
        }
      }
    }));
  }

  function updateExercise(exerciseNum, field, value) {
    setWeekData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        workout: {
          ...prev[selectedDate]?.workout,
          exercises: {
            ...prev[selectedDate]?.workout?.exercises,
            [`exercise${exerciseNum}`]: {
              ...prev[selectedDate]?.workout?.exercises?.[`exercise${exerciseNum}`],
              [field]: value
            }
          }
        }
      }
    }));
  }

  function calculateScore() {
    const m = today.morning;
    const w = today.work;
    const ml = today.meals;
    const wo = today.workout;
    const e = today.evening;

    let score = 0;
    
    // Morning (15 pts)
    if (m.wokeOnTime) score += 5;
    if (m.supplements) score += 5;
    if (m.proteinShake) score += 5;

    // Work (25 pts)
    if (w.deepWork1) score += 10;
    if (w.deepWork2) score += 10;
    if (w.noSocialMedia) score += 5;

    // Meals (25 pts)
    if (ml.proteinTarget) score += 10;
    if (ml.calorieTarget) score += 10;
    if (ml.noSnacks) score += 5;

    // Workout (20 pts)
    if (wo.completed) score += 15;
    if (wo.preWorkout || wo.postWorkout) score += 5;

    // Evening (15 pts)
    if (e.peptides) score += 5;
    if (e.prepped) score += 5;
    if (e.bedtime) score += 5;

    return score;
  }

  const dailyScore = calculateScore();

  function getScoreColor(score) {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getScoreLevel(score) {
    if (score >= 90) return 'LEGEND';
    if (score >= 80) return 'ELITE';
    if (score >= 70) return 'SOLID';
    if (score >= 60) return 'AVERAGE';
    return 'RESET NEEDED';
  }

  function calculateWeeklyScore() {
    const scores = Object.values(weekData).map(day => {
      const m = day.morning;
      const w = day.work;
      const ml = day.meals;
      const wo = day.workout;
      const e = day.evening;
      
      let score = 0;
      if (m.wokeOnTime) score += 5;
      if (m.supplements) score += 5;
      if (m.proteinShake) score += 5;
      if (w.deepWork1) score += 10;
      if (w.deepWork2) score += 10;
      if (w.noSocialMedia) score += 5;
      if (ml.proteinTarget) score += 10;
      if (ml.calorieTarget) score += 10;
      if (ml.noSnacks) score += 5;
      if (wo.completed) score += 15;
      if (wo.preWorkout || wo.postWorkout) score += 5;
      if (e.peptides) score += 5;
      if (e.prepped) score += 5;
      if (e.bedtime) score += 5;
      return score;
    });
    return scores.reduce((a, b) => a + b, 0);
  }

  function exportToCSV() {
    const headers = ['Date', 'Weight', 'Daily Score', 'Morning Complete', 'Work Complete', 'Meals Complete', 'Workout Complete', 'Evening Complete', 'Notes'];
    const rows = Object.entries(weekData).map(([date, day]) => {
      const m = day.morning;
      const w = day.work;
      const ml = day.meals;
      const wo = day.workout;
      const e = day.evening;
      
      let score = 0;
      if (m.wokeOnTime) score += 5;
      if (m.supplements) score += 5;
      if (m.proteinShake) score += 5;
      if (w.deepWork1) score += 10;
      if (w.deepWork2) score += 10;
      if (w.noSocialMedia) score += 5;
      if (ml.proteinTarget) score += 10;
      if (ml.calorieTarget) score += 10;
      if (ml.noSnacks) score += 5;
      if (wo.completed) score += 15;
      if (wo.preWorkout || wo.postWorkout) score += 5;
      if (e.peptides) score += 5;
      if (e.prepped) score += 5;
      if (e.bedtime) score += 5;

      return [
        date,
        day.weight,
        score,
        (m.wokeOnTime && m.supplements && m.proteinShake) ? 'Yes' : 'No',
        (w.deepWork1 && w.deepWork2 && w.noSocialMedia) ? 'Yes' : 'No',
        (ml.proteinTarget && ml.calorieTarget && ml.noSnacks) ? 'Yes' : 'No',
        wo.completed ? 'Yes' : 'No',
        (e.peptides && e.prepped && e.bedtime) ? 'Yes' : 'No',
        `"${day.notes || ''}"`
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kosta-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  function copyForGoogleSheets() {
    const headers = ['Date', 'Weight', 'Daily Score', 'Morning', 'Work', 'Meals', 'Workout', 'Evening', 'Notes'];
    const rows = Object.entries(weekData).map(([date, day]) => {
      const m = day.morning;
      const w = day.work;
      const ml = day.meals;
      const wo = day.workout;
      const e = day.evening;
      
      let score = 0;
      if (m.wokeOnTime) score += 5;
      if (m.supplements) score += 5;
      if (m.proteinShake) score += 5;
      if (w.deepWork1) score += 10;
      if (w.deepWork2) score += 10;
      if (w.noSocialMedia) score += 5;
      if (ml.proteinTarget) score += 10;
      if (ml.calorieTarget) score += 10;
      if (ml.noSnacks) score += 5;
      if (wo.completed) score += 15;
      if (wo.preWorkout || wo.postWorkout) score += 5;
      if (e.peptides) score += 5;
      if (e.prepped) score += 5;
      if (e.bedtime) score += 5;

      return [
        date,
        day.weight,
        score,
        (m.wokeOnTime && m.supplements && m.proteinShake) ? 'Yes' : 'No',
        (w.deepWork1 && w.deepWork2 && w.noSocialMedia) ? 'Yes' : 'No',
        (ml.proteinTarget && ml.calorieTarget && ml.noSnacks) ? 'Yes' : 'No',
        wo.completed ? 'Yes' : 'No',
        (e.peptides && e.prepped && e.bedtime) ? 'Yes' : 'No',
        day.notes || ''
      ].join('\t');
    });

    const text = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(text);
    alert('Data copied! Paste directly into Google Sheets.');
  }

  const CheckboxItem = ({ label, checked, onChange, points }) => (
    <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
      }`}>
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className="flex-1 text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-blue-600">{points}pts</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );

  const weeklyScore = calculateWeeklyScore();
  const daysLogged = Object.keys(weekData).length;
  const avgDailyScore = daysLogged > 0 ? Math.round(weeklyScore / daysLogged) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kosta's Transformation Tracker</h1>
              <p className="text-gray-600 mt-1">Build the best version of yourself, one day at a time</p>
            </div>
            <Flame className="w-12 h-12 text-orange-500" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-sm text-blue-600 font-medium">Current Weight</div>
              <div className="text-2xl font-bold text-blue-900">{today.weight} lbs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-green-600 font-medium">Target Weight</div>
              <div className="text-2xl font-bold text-green-900">{targetWeight} lbs</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-sm text-purple-600 font-medium">To Go</div>
              <div className="text-2xl font-bold text-purple-900">{Math.max(0, today.weight - targetWeight)} lbs</div>
            </div>
            <div className={`bg-orange-50 p-4 rounded-xl`}>
              <div className="text-sm text-orange-600 font-medium">Today's Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(dailyScore)}`}>{dailyScore}/100</div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="mt-6 flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              value={today.weight}
              onChange={(e) => updateField('weight', null, parseFloat(e.target.value))}
              placeholder="Weight"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg w-32 focus:border-blue-500 focus:outline-none"
            />
            <span className="text-gray-600">lbs</span>
          </div>
        </div>

        {/* Daily Score Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Daily Performance</div>
              <div className="text-4xl font-bold mt-1">{dailyScore} / 100</div>
              <div className="text-lg mt-2 opacity-90">{getScoreLevel(dailyScore)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Weekly Average</div>
              <div className="text-3xl font-bold mt-1">{avgDailyScore}</div>
              <div className="text-sm mt-2 opacity-90">{daysLogged} days logged</div>
            </div>
          </div>
        </div>

        {/* Morning Routine */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              ☀️
            </div>
            Morning Routine (15 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem
              label="Woke up by 6:00 AM"
              checked={today.morning.wokeOnTime}
              onChange={(e) => updateField('morning', 'wokeOnTime', e.target.checked)}
              points={5}
            />
            <CheckboxItem
              label="Took all morning supplements (Adderall, Semax, Multivitamin)"
              checked={today.morning.supplements}
              onChange={(e) => updateField('morning', 'supplements', e.target.checked)}
              points={5}
            />
            <CheckboxItem
              label="Had Premier Protein shake"
              checked={today.morning.proteinShake}
              onChange={(e) => updateField('morning', 'proteinShake', e.target.checked)}
              points={5}
            />
          </div>
        </div>

        {/* Work Productivity */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              💼
            </div>
            Work Productivity (25 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem
              label="Deep Work Block 1 completed (7:00-9:00 AM)"
              checked={today.work.deepWork1}
              onChange={(e) => updateField('work', 'deepWork1', e.target.checked)}
              points={10}
            />
            <CheckboxItem
              label="Deep Work Block 2 completed (9:15 AM-12:00 PM)"
              checked={today.work.deepWork2}
              onChange={(e) => updateField('work', 'deepWork2', e.target.checked)}
              points={10}
            />
            <CheckboxItem
              label="No social media during work blocks"
              checked={today.work.noSocialMedia}
              onChange={(e) => updateField('work', 'noSocialMedia', e.target.checked)}
              points={5}
            />
          </div>
        </div>

        {/* Nutrition */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              🥗
            </div>
            Nutrition (25 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem
              label="Hit 200g protein target"
              checked={today.meals.proteinTarget}
              onChange={(e) => updateField('meals', 'proteinTarget', e.target.checked)}
              points={10}
            />
            <CheckboxItem
              label="Stayed within calorie target (±100 cal)"
              checked={today.meals.calorieTarget}
              onChange={(e) => updateField('meals', 'calorieTarget', e.target.checked)}
              points={10}
            />
            <CheckboxItem
              label="No unplanned snacks/cheat meals"
              checked={today.meals.noSnacks}
              onChange={(e) => updateField('meals', 'noSnacks', e.target.checked)}
              points={5}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={today.meals.meal2}
                onChange={(e) => updateField('meals', 'meal2', e.target.checked)}
                className="rounded"
              />
              <span>12:00 PM - Ground beef + rice</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={today.meals.meal3}
                onChange={(e) => updateField('meals', 'meal3', e.target.checked)}
                className="rounded"
              />
              <span>4:00 PM - Chicken + sweet potato</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={today.meals.meal4}
                onChange={(e) => updateField('meals', 'meal4', e.target.checked)}
                className="rounded"
              />
              <span>8:00 PM - Cod/chicken + rice + veg</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={today.meals.meal5}
                onChange={(e) => updateField('meals', 'meal5', e.target.checked)}
                className="rounded"
              />
              <span>9:30 PM - Ninja Creami</span>
            </div>
          </div>
        </div>

        {/* Workout */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              💪
            </div>
            Workout (20 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem
              label="Completed full workout"
              checked={today.workout.completed}
              onChange={(e) => updateField('workout', 'completed', e.target.checked)}
              points={15}
            />
            <CheckboxItem
              label="Took pre-workout (Vapor X5 + ClearMuscle)"
              checked={today.workout.preWorkout}
              onChange={(e) => updateField('workout', 'preWorkout', e.target.checked)}
              points={2.5}
            />
            <CheckboxItem
              label="Took post-workout (Cell Tech + Creatine)"
              checked={today.workout.postWorkout}
              onChange={(e) => updateField('workout', 'postWorkout', e.target.checked)}
              points={2.5}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-3">Exercise Log (Optional)</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <div key={num} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Exercise ${num}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={today.workout.exercises[`exercise${num}`]?.weight || ''}
                    onChange={(e) => updateExercise(num, 'weight', e.target.value)}
                    placeholder="Weight"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={today.workout.exercises[`exercise${num}`]?.sets || ''}
                    onChange={(e) => updateExercise(num, 'sets', e.target.value)}
                    placeholder="Sets"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evening Routine */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              🌙
            </div>
            Evening Routine (15 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem
              label="Took evening peptides (Tesamorelin + Ipamorelin + Collagen)"
              checked={today.evening.peptides}
              onChange={(e) => updateField('evening', 'peptides', e.target.checked)}
              points={5}
            />
            <CheckboxItem
              label="Prepped for tomorrow (gym bag, clothes, tasks)"
              checked={today.evening.prepped}
              onChange={(e) => updateField('evening', 'prepped', e.target.checked)}
              points={5}
            />
            <CheckboxItem
              label="In bed by 10:45 PM"
              checked={today.evening.bedtime}
              onChange={(e) => updateField('evening', 'bedtime', e.target.checked)}
              points={5}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Notes</h2>
          <textarea
            value={today.notes}
            onChange={(e) => setWeekData(prev => ({
              ...prev,
              [selectedDate]: { ...prev[selectedDate], notes: e.target.value }
            }))}
            placeholder="How did you feel today? Any wins or challenges?"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none min-h-[100px]"
          />
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Export Data</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyForGoogleSheets}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Copy className="w-5 h-5" />
              Copy for Google Sheets
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
            <strong>How to use:</strong>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Click "Copy for Google Sheets"</li>
              <li>Open Google Sheets</li>
              <li>Paste (Ctrl/Cmd + V) into cell A1</li>
              <li>Your data will populate automatically!</li>
            </ol>
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white text-center">
          <Target className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Remember Your Why</h3>
          <p className="text-lg opacity-90">
            You're not building motivation. You're building a system. Show up, check the boxes, trust the process.
          </p>
          <p className="mt-4 text-xl font-bold">
            {today.weight > targetWeight ? `${(today.weight - targetWeight).toFixed(1)} lbs to go!` : 'TARGET REACHED! 🎉'}
          </p>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Track daily. Export weekly. Win consistently.</p>
        </div>
      </div>
    </div>
  );
}