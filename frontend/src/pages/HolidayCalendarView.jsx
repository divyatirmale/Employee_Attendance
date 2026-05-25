import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Calendar, ChevronDown } from 'lucide-react';

const HolidayCalendarView = () => {
    const { dark } = useTheme();
    const year = 2026;
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const holidays = {
        "JAN": [
            { date: "14 Wed", name: "Uttarayan" },
            { date: "15 Thu", name: "Compensatory Off (Independence Day)" },
            { date: "26 Mon", name: "Republic Day" }
        ],
        "MAR": [
            { date: "04 Wed", name: "Holi" }
        ],
        "AUG": [
            { date: "15 Sat", name: "Independence Day" },
            { date: "28 Fri", name: "Rakshabandhan" }
        ],
        "SEP": [
            { date: "04 Fri", name: "Janmashtami" }
        ],
        "OCT": [
            { date: "20 Tue", name: "Dussehra" }
        ],
        "NOV": [
            { date: "08 Sun", name: "Diwali" },
            { date: "09 Mon", name: "Compensatory Off (Diwali)" },
            { date: "10 Tue", name: "New Year (Bastu Varas)" },
            { date: "11 Wed", name: "Bhai Dooj" }
        ]
    };

    const monthColors = [
        'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
        'from-emerald-500 to-teal-600', 'from-sky-500 to-blue-600',
        'from-violet-500 to-purple-600', 'from-cyan-500 to-sky-600',
        'from-fuchsia-500 to-pink-600', 'from-orange-500 to-red-600',
        'from-teal-500 to-green-600', 'from-indigo-500 to-violet-600',
        'from-yellow-500 to-amber-600', 'from-red-500 to-rose-600'
    ];

    return (
        <div>
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
                        <Calendar size={22} className="text-sky-500" />
                        Holiday Calendar
                    </h2>
                    <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Plan your year with the official holiday schedule.
                    </p>
                </div>
                <div className="relative">
                    <select
                        className={`appearance-none input-field pr-8 cursor-pointer ${dark ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                        defaultValue="2026"
                    >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                    </select>
                    <ChevronDown size={16} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
            </header>

            {/* Holiday Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {months.map((m, idx) => {
                    const hasHolidays = holidays[m] && holidays[m].length > 0;
                    return (
                        <div key={m} className={`card overflow-hidden ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            {/* Month Header */}
                            <div className={`px-4 py-3 bg-gradient-to-r ${monthColors[idx]} text-white`}>
                                <h3 className="text-base font-bold tracking-wide">{m} {year}</h3>
                            </div>

                            {/* Holiday List */}
                            <div className="px-4 py-3">
                                {hasHolidays ? (
                                    <div className="space-y-2.5">
                                        {holidays[m].map((h, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${dark ? 'bg-sky-400' : 'bg-sky-500'
                                                    }`} />
                                                <div className="min-w-0">
                                                    <div className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {h.date}
                                                    </div>
                                                    <div className={`text-sm truncate ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {h.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`py-6 text-center text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        No Holidays
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HolidayCalendarView;
