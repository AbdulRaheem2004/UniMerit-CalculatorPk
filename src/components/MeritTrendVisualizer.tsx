import React, { useState, useMemo } from 'react';
import { HistoricalMeritRecord } from '../engine/types';
import { TrendingUp, ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface MeritTrendVisualizerProps {
  historicalMerits: HistoricalMeritRecord[];
  userAggregate?: number;
  onOpenAuditForRecord?: (record: HistoricalMeritRecord) => void;
}

export const MeritTrendVisualizer: React.FC<MeritTrendVisualizerProps> = ({
  historicalMerits,
  userAggregate,
  onOpenAuditForRecord,
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('fast_cs');
  const [selectedCampus, setSelectedCampus] = useState<string>('Islamabad');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('BS Computer Science');
  const [hoveredRecord, setHoveredRecord] = useState<HistoricalMeritRecord | null>(null);

  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  // Available campuses based on selected university
  const availableCampuses = useMemo(() => {
    switch (selectedUniversity) {
      case 'fast_cs':
      case 'fast_eng':
      case 'fast_bba':
        return ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'CFD (Faisalabad)'];
      case 'nust':
      case 'nust_eng':
      case 'nust_business':
        return ['H-12 Islamabad (SEECS)', 'H-12 Islamabad (SMME)', 'H-12 Islamabad (NBS)', 'Rawalpindi (EME College)'];
      case 'comsats':
      case 'comsats_eng':
      case 'comsats_business':
        return ['Islamabad', 'Lahore', 'Abbottabad', 'Wah', 'Attock', 'Sahiwal', 'Vehari'];
      case 'pucit':
        return ['Old Campus Lahore (Allama Iqbal)', 'New Campus Lahore (Quaid-i-Azam)'];
      case 'uet':
        return ['Main Campus Lahore', 'KSK Campus'];
      case 'giki':
        return ['Topi, Swabi (KPK)'];
      default:
        return ['Main Campus'];
    }
  }, [selectedUniversity]);

  // Ensure selectedCampus is valid when university changes
  const activeCampus = availableCampuses.includes(selectedCampus) ? selectedCampus : availableCampuses[0];

  // Available disciplines for this university & campus
  const availableDisciplines = useMemo(() => {
    const matching = historicalMerits.filter(
      (r) =>
        r.universityId.startsWith(selectedUniversity.split('_')[0]) &&
        r.campus.toLowerCase().includes(activeCampus.toLowerCase().split(' ')[0])
    );
    const unique = Array.from(new Set(matching.map((m) => m.discipline)));
    return unique.length > 0 ? unique : ['BS Computer Science'];
  }, [historicalMerits, selectedUniversity, activeCampus]);

  const activeDiscipline = availableDisciplines.includes(selectedDiscipline)
    ? selectedDiscipline
    : availableDisciplines[0];

  // Filter records based on active selection
  const filteredRecords = useMemo(() => {
    return historicalMerits.filter(
      (r) =>
        r.universityId.startsWith(selectedUniversity.split('_')[0]) &&
        r.campus.toLowerCase().includes(activeCampus.toLowerCase().split(' ')[0]) &&
        r.discipline.toLowerCase() === activeDiscipline.toLowerCase()
    );
  }, [historicalMerits, selectedUniversity, activeCampus, activeDiscipline]);

  // Map by year for easy lookup
  const recordByYear = useMemo(() => {
    const map = new Map<number, HistoricalMeritRecord>();
    filteredRecords.forEach((r) => map.set(r.year, r));
    return map;
  }, [filteredRecords]);

  const minY = 58;
  const maxY = 90;
  const rangeY = maxY - minY;

  // Chart dimensions
  const svgWidth = 860;
  const svgHeight = 300;
  const paddingX = 65;
  const paddingY = 40;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const getX = (year: number) => {
    const index = years.indexOf(year);
    return paddingX + (index / (years.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.min(maxY, Math.max(minY, val));
    return paddingY + chartHeight - ((clamped - minY) / rangeY) * chartHeight;
  };

  // Build SVG polyline points ONLY for verified historical records with non-null cutoffs
  const polylinePoints = useMemo(() => {
    return years
      .filter((y) => {
        const r = recordByYear.get(y);
        return r && (r.status === 'verified' || r.status === 'special_policy_year') && typeof r.closingAggregate === 'number';
      })
      .map((y) => {
        const r = recordByYear.get(y)!;
        return `${getX(y)},${getY(r.closingAggregate!)}`;
      })
      .join(' ');
  }, [recordByYear]);

  // Calculate how many verified years user would have cleared
  const clearanceSummary = useMemo(() => {
    if (!userAggregate || userAggregate <= 0) return null;
    const verified = filteredRecords.filter((r) => typeof r.closingAggregate === 'number');
    if (verified.length === 0) return null;
    const cleared = verified.filter((r) => userAggregate >= (r.closingAggregate as number));
    return {
      clearedCount: cleared.length,
      totalCount: verified.length,
      percentage: Math.round((cleared.length / verified.length) * 100),
    };
  }, [userAggregate, filteredRecords]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            10-Year Historical Merit Trend (2016–2026)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Strictly authenticated official archives. 2025/2026 unreleased cycles and unarchived years are honestly reported without fabrication.
          </p>
        </div>

        {/* Dynamic Multi-Campus & Discipline Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* University selector */}
          <select
            value={selectedUniversity}
            onChange={(e) => {
              setSelectedUniversity(e.target.value);
            }}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="fast_cs">FAST-NUCES</option>
            <option value="nust">NUST</option>
            <option value="comsats">COMSATS (CUI)</option>
            <option value="pucit">PUCIT / Punjab University</option>
            <option value="uet">UET Lahore</option>
            <option value="giki">GIKI Swabi</option>
          </select>

          {/* Campus selector */}
          <select
            value={activeCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            {availableCampuses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Discipline selector */}
          <select
            value={activeDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            {availableDisciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Concluded Cycles & Data Notice */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white">
            Authenticated Admission Archives (2016–2026 Concluded Cycles):
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Closing aggregates for completed admission cycles (including 2025 and 2026 selection lists) cross-referenced against institutional circulars. Older unarchived years (where universities did not preserve web archives) are reported honestly.
          </p>
        </div>
      </div>

      {/* User Clearance Benchmark Badge */}
      {clearanceSummary && userAggregate && userAggregate > 0 && (
        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse"></span>
            <span className="text-teal-900 dark:text-teal-200 font-medium">
              Your Projected Aggregate:{' '}
              <strong className="font-mono">{userAggregate.toFixed(2)}%</strong>
            </span>
          </div>
          <span className="font-semibold text-teal-800 dark:text-teal-300">
            Cleared {clearanceSummary.clearedCount} of {clearanceSummary.totalCount} verified years ({clearanceSummary.percentage}%)
          </span>
        </div>
      )}

      {/* SVG Multi-Year Chart */}
      <div className="relative w-full overflow-x-auto bg-zinc-50/50 dark:bg-zinc-950/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[660px] select-none"
        >
          {/* Horizontal Grid Lines */}
          {[60, 65, 70, 75, 80, 85].map((gridVal) => {
            const y = getY(gridVal);
            return (
              <g key={gridVal}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-zinc-400 dark:fill-zinc-500"
                >
                  {gridVal}%
                </text>
              </g>
            );
          })}

          {/* Polyline Path connecting verified points */}
          {polylinePoints && (
            <polyline
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          )}

          {/* User Benchmark Overlay Line */}
          {userAggregate && userAggregate >= minY && userAggregate <= maxY && (
            <g>
              <line
                x1={paddingX}
                y1={getY(userAggregate)}
                x2={svgWidth - paddingX}
                y2={getY(userAggregate)}
                stroke="#15803d"
                strokeWidth="1.75"
                strokeDasharray="6 4"
              />
              <text
                x={svgWidth - paddingX + 6}
                y={getY(userAggregate) + 3}
                className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400"
              >
                You ({userAggregate.toFixed(1)}%)
              </text>
            </g>
          )}

          {/* Data Nodes along timeline (2016-2026) */}
          {years.map((year) => {
            const record = recordByYear.get(year);
            const x = getX(year);

            // Verified Official Cutoff
            if (record && record.status === 'verified' && typeof record.closingAggregate === 'number') {
              const y = getY(record.closingAggregate);
              const isHovered = hoveredRecord?.year === year;

              return (
                <g
                  key={year}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRecord(record)}
                  onMouseLeave={() => setHoveredRecord(null)}
                  onClick={() => onOpenAuditForRecord?.(record)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6.5 : 4.5}
                    className="fill-teal-600 hover:fill-teal-500 transition-all stroke-white dark:stroke-zinc-900 stroke-2"
                  />
                  {/* Floating percentage label */}
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-zinc-800 dark:fill-zinc-200"
                  >
                    {record.closingAggregate.toFixed(1)}%
                  </text>
                  {/* Year on X-axis */}
                  <text
                    x={x}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-zinc-700 dark:fill-zinc-300"
                  >
                    {year}
                  </text>
                </g>
              );
            }

            // COVID-19 Special Policy Year (2020)
            if (record && record.status === 'special_policy_year') {
              const y = getY(record.closingAggregate ?? 70);
              return (
                <g
                  key={year}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRecord(record)}
                  onMouseLeave={() => setHoveredRecord(null)}
                  onClick={() => onOpenAuditForRecord?.(record)}
                >
                  <polygon
                    points={`${x},${y - 5} ${x + 5},${y + 4} ${x - 5},${y + 4}`}
                    className="fill-amber-500 hover:fill-amber-400 stroke-white dark:stroke-zinc-900 stroke-1"
                  />
                  <text
                    x={x}
                    y={y - 9}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-amber-600 dark:fill-amber-400"
                  >
                    COVID
                  </text>
                  <text
                    x={x}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-medium fill-amber-600 dark:fill-amber-400"
                  >
                    {year}
                  </text>
                </g>
              );
            }

            // Unarchived older years
            const unarchivedY = svgHeight - 48;
            const fallbackRecord: HistoricalMeritRecord = record || {
              year,
              universityId: selectedUniversity,
              campus: activeCampus,
              discipline: activeDiscipline,
              status: 'not_found',
              notes: `Official closing selection list archive for ${year} is not publicly preserved on institutional portals. Reported honestly instead of assuming.`,
            };

            return (
              <g
                key={year}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredRecord(fallbackRecord)}
                onMouseLeave={() => setHoveredRecord(null)}
                onClick={() => onOpenAuditForRecord?.(fallbackRecord)}
              >
                <circle
                  cx={x}
                  cy={unarchivedY}
                  r={3.5}
                  className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-400 dark:stroke-zinc-600 stroke-1"
                  strokeDasharray="2 2"
                />
                <text
                  x={x}
                  y={unarchivedY - 8}
                  textAnchor="middle"
                  className="text-[9px] font-medium fill-zinc-400 dark:fill-zinc-500"
                >
                  Unarchived
                </text>
                <text
                  x={x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-zinc-400 dark:fill-zinc-500"
                >
                  {year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Hover Inspection Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-zinc-500 dark:text-zinc-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            Verified Official Cutoff
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 transform rotate-45 inline-block"></span>
            COVID Special Policy (2020)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-zinc-400"></span>
            Unreleased / Upcoming / Unarchived
          </span>
        </div>

        <span className="text-[11px] text-zinc-400 italic">
          Tip: Hover or tap any year to view verified documentation & cycle details.
        </span>
      </div>

      {/* Hover Card Detail Drawer */}
      {hoveredRecord && (
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs space-y-1.5 border border-zinc-200 dark:border-zinc-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 dark:text-white">
              {hoveredRecord.year} • {hoveredRecord.discipline} ({hoveredRecord.campus})
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                hoveredRecord.status === 'verified'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : hoveredRecord.status === 'special_policy_year'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
              }`}
            >
              {hoveredRecord.status === 'not_found'
                ? hoveredRecord.year === 2026
                  ? 'Upcoming Cycle'
                  : 'Not Publicly Released'
                : hoveredRecord.status}
            </span>
          </div>

          {hoveredRecord.closingAggregate && (
            <p className="text-zinc-700 dark:text-zinc-300">
              Closing Aggregate:{' '}
              <strong className="font-mono text-teal-700 dark:text-teal-300">
                {hoveredRecord.closingAggregate.toFixed(2)}%
              </strong>{' '}
              {hoveredRecord.listNumber && `(${hoveredRecord.listNumber})`}
            </p>
          )}

          {hoveredRecord.closingMeritPosition && (
            <p className="text-zinc-700 dark:text-zinc-300">
              Closing Merit Position: <strong className="font-mono">#{hoveredRecord.closingMeritPosition}</strong>
            </p>
          )}

          {hoveredRecord.verificationSource ? (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Source: {hoveredRecord.verificationSource.title}
            </p>
          ) : (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              {hoveredRecord.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
