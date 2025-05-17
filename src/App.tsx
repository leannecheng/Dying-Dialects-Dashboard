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
  const [showModal, setShowModal] = useState(false);

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
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 py-8 font-sans bg-[#090E1A] transition-colors duration-500">
      {/* Header */}
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#111827] to-[#0f172a] rounded-xl shadow-xl px-6 py-6 mb-10 w-full max-w-7xl mx-auto border border-gray-700">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Dying Dialects Dashboard
          </h1>
          <p className="text-md text-gray-300 mt-1">
            U-M ASIANLAN Enrollment Trends (2002–2024)
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
          <LanguageSelectGroup onSelect={handleSelectChange} />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-sm text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md shadow-sm transition duration-200"
            aria-label="About the project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9.75h.008v.008H11.25V9.75zm.375 3v3.75m.375-10.5a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5z" />
            </svg>
            About the project
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-10 w-full max-w-7xl mx-auto">
        {/* Term-Based Chart */}
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

        {/* Level-Based Chart */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#111827] text-white p-8 rounded-xl max-w-2xl w-full mx-4 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">About the project</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              This dashboard highlights <strong>enrollment and retention trends</strong> in underrepresented language courses at the University of Michigan. It tracks how student participation evolves from <strong>beginner (100-level)</strong> to <strong>intermediate (200-level)</strong> and <strong>advanced (300–400-level)</strong> courses.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              The goal is to make this data <strong>accessible, visual, and actionable</strong>. By surfacing these patterns, the project supports faculty and students in advocating for programs that often go underrepresented in traditional reporting.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Key features include:
            </p>
            <ul className="text-sm text-gray-300 list-disc list-inside space-y-2">
              <li><strong>Interactive graphs</strong> that break down enrollment by term and level</li>
              <li>Support for multiple languages through a <strong>filterable selector</strong></li>
              <li><strong>Visual emphasis</strong> on patterns of student progression and drop-off</li>
            </ul>
            <p className="text-sm text-gray-300 leading-relaxed mt-4">
              Built in collaboration with the <strong>Language Resource Center</strong>, this project promotes <strong>linguistic diversity</strong> in higher education and lays the groundwork for broader national comparisons.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-400 px-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8 border-t pt-6 border-gray-700">
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
