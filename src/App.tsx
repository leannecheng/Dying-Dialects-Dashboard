import { useState, useEffect } from 'react';
import { LineChart } from './components/LineChart';
import { Card } from './components/Card';
import asianlanData from './data/asianlan.json';
import { LanguageSelectGroup } from './components/LanguageSelectGroup';

import './App.css';

interface EnrollmentRecord {
  year: string;
  term: string;
  level?: string;
  enrollment: number;
  language: string;
}

interface EnrollmentData {
  [year: string]: number;
}

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all-languages');
  const [lineChartData, setLineChartData] = useState<{
    year: string;
    Winter: number;
    Fall: number;
  }[]>([]);
  const [lineChartData2, setLineChartData2] = useState<{
    year: string;
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  }[]>([]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedLanguage(value);
  };

  useEffect(() => {
    function processEnrollmentData(data: EnrollmentRecord[]) {
      const winterEnrollments: EnrollmentData = {};
      const fallEnrollments: EnrollmentData = {};

      data.forEach(({ year, term, enrollment, language }) => {
        if (language === selectedLanguage || selectedLanguage === 'all-languages') {
          if (term === 'Winter') {
            winterEnrollments[year] = (winterEnrollments[year] || 0) + enrollment;
          }
          if (term === 'Fall') {
            fallEnrollments[year] = (fallEnrollments[year] || 0) + enrollment;
          }
        }
      });

      return { winterEnrollments, fallEnrollments };
    }

    function processEnrollmentDataLevels(data: EnrollmentRecord[]) {
      const beginner: EnrollmentData = {};
      const intermediate: EnrollmentData = {};
      const advanced: EnrollmentData = {};

      data.forEach(({ year, level, enrollment, language }) => {
        if (language === selectedLanguage || selectedLanguage === 'all-languages') {
          if (level === 'Beginner') {
            beginner[year] = (beginner[year] || 0) + enrollment;
          }
          if (level === 'Intermediate') {
            intermediate[year] = (intermediate[year] || 0) + enrollment;
          }
          if (level === 'Advanced') {
            advanced[year] = (advanced[year] || 0) + enrollment;
          }
        }
      });

      return { beginner, intermediate, advanced };
    }

    const cleanedData: EnrollmentRecord[] = asianlanData.map((item: any) => ({
      ...item,
      year: item.year.toString(),
    }));

    const processed = processEnrollmentData(cleanedData);
    const levelData = processEnrollmentDataLevels(cleanedData);

    const allYears = Array.from({ length: 2024 - 2002 + 1 }, (_, i) => (2002 + i).toString());

    const computedLineChartData = allYears.map((year) => ({
      year,
      Winter: processed.winterEnrollments[year] || 0,
      Fall: processed.fallEnrollments[year] || 0,
    }));

    const computedLineChartData2 = allYears.map((year) => ({
      year,
      Beginner: levelData.beginner[year] || 0,
      Intermediate: levelData.intermediate[year] || 0,
      Advanced: levelData.advanced[year] || 0,
    }));

    setLineChartData(computedLineChartData);
    setLineChartData2(computedLineChartData2);
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen px-4 py-6 font-sans bg-[#090E1A] transition-colors duration-500">
      {/* Top Banner: Title + Selector */}
      <div className="bg-gradient-to-r from-[#111827] to-[#0f172a] rounded-xl shadow-xl px-6 py-6 mb-10 max-w-6xl mx-auto border border-gray-700 transition-all">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Dying Dialects Dashboard
            </h1>
            <p className="text-md text-gray-300 mt-1">
              U-M ASIANLAN Enrollment Trends (2002–2024)
            </p>
          </div>
          <LanguageSelectGroup onSelect={handleSelectChange} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-12 max-w-6xl mx-auto">
        <Card className="p-6 shadow-md transition-shadow hover:shadow-xl animate-fade-in">
          <h2 className="text-2xl font-semibold text-center text-white mb-4">
            Enrollment by Term (Fall vs Winter)
          </h2>
          <LineChart
            data={lineChartData}
            index="year"
            categories={['Fall', 'Winter']}
            colors={['amber', 'cyan']}
            valueFormatter={(value) => value.toLocaleString()}
            yAxisLabel="Enrollments"
            xAxisLabel="Years"
            showLegend={true}
            allowDecimals={false}
          />
        </Card>

        <Card className="p-6 shadow-md transition-shadow hover:shadow-xl animate-fade-in">
          <h2 className="text-2xl font-semibold text-center text-white mb-4">
            Enrollment by Course Level (Beginner, Intermediate, Advanced)
          </h2>
          <LineChart
            data={lineChartData2}
            index="year"
            categories={['Beginner', 'Intermediate', 'Advanced']}
            colors={['lime', 'violet', 'emerald']}
            valueFormatter={(value) => value.toLocaleString()}
            yAxisLabel="Enrollments"
            xAxisLabel="Years"
            showLegend={true}
            allowDecimals={false}
          />
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-24 text-sm text-gray-400 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 border-t pt-6 border-gray-700">
          <img
            src={`${import.meta.env.BASE_URL}umich-lrc-logo.png`}
            alt="University of Michigan LRC"
            className="w-[36rem] h-auto object-contain opacity-95"
          />
          <div className="text-center leading-relaxed">
            Built by{' '}
            <a
              href="https://github.com/leannecheng"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-300 transition-colors"
            >
              Leanne Cheng
            </a>{' '}
            • Powered by React + Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
