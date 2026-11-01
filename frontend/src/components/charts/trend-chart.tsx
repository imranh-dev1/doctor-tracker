"use client";

import { useId } from "react";
import type { MonthlyTrendPoint } from "@/types";

const WIDTH = 760;
const HEIGHT = 260;
const PADDING = { top: 18, right: 18, bottom: 34, left: 34 };

const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

function buildPath(points: { x: number; y: number }[], close = false) {
  if (points.length === 0) {
    return "";
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const controlX = (previous.x + current.x) / 2;

    path += ` C ${controlX} ${previous.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`;
  }

  if (close) {
    path += ` L ${points[points.length - 1].x} ${PADDING.top + PLOT_HEIGHT}`;
    path += ` L ${points[0].x} ${PADDING.top + PLOT_HEIGHT} Z`;
  }

  return path;
}

export function TrendChart({ data }: { data: MonthlyTrendPoint[] }) {
  const gradientId = useId();

  const maxValue = Math.max(
    1,
    ...data.flatMap((point) => [point.patients, point.doctors]),
  );

  const stepX = data.length > 1 ? PLOT_WIDTH / (data.length - 1) : 0;

  const toX = (index: number) => PADDING.left + index * stepX;
  const toY = (value: number) =>
    PADDING.top + PLOT_HEIGHT - (value / maxValue) * PLOT_HEIGHT;

  const patientPoints = data.map((point, index) => ({
    x: toX(index),
    y: toY(point.patients),
  }));

  const doctorPoints = data.map((point, index) => ({
    x: toX(index),
    y: toY(point.doctors),
  }));

  const gridLines = Array.from({ length: 4 }, (_, index) => {
    const value = Math.round((maxValue / 3) * index);
    return { value, y: toY(value) };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          Patients
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-3" />
          Doctors
        </span>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Doctors and patients added over the last 12 months"
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridLines.map((line) => (
            <g key={line.y}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={line.y}
                y2={line.y}
                stroke="currentColor"
                strokeDasharray="4 6"
                className="text-border"
              />
              <text
                x={PADDING.left - 8}
                y={line.y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {line.value}
              </text>
            </g>
          ))}

          <path
            d={buildPath(patientPoints, true)}
            fill={`url(#${gradientId})`}
          />

          <path
            d={buildPath(patientPoints)}
            fill="none"
            stroke="var(--chart-2)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <path
            d={buildPath(doctorPoints)}
            fill="none"
            stroke="var(--chart-3)"
            strokeWidth="2"
            strokeDasharray="6 5"
            strokeLinecap="round"
          />

          {data.map((point, index) => {
            const x = toX(index);
            const tooltipX = Math.min(
              Math.max(x - 62, PADDING.left),
              WIDTH - PADDING.right - 136,
            );

            return (
              <g key={point.month} className="group/point">
                <text
                  x={x}
                  y={HEIGHT - 10}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {point.label}
                </text>

                <circle
                  cx={x}
                  cy={toY(point.patients)}
                  r="3.5"
                  fill="var(--chart-2)"
                  stroke="var(--background)"
                  strokeWidth="2"
                />

                <circle
                  cx={x}
                  cy={toY(point.doctors)}
                  r="3"
                  fill="var(--chart-3)"
                  stroke="var(--background)"
                  strokeWidth="2"
                />

                <rect
                  x={x - stepX / 2}
                  y={PADDING.top}
                  width={Math.max(stepX, 12)}
                  height={PLOT_HEIGHT}
                  fill="transparent"
                >
                  <title>
                    {`${point.label}: ${point.patients} patients, ${point.doctors} doctors`}
                  </title>
                </rect>

                <line
                  x1={x}
                  x2={x}
                  y1={PADDING.top}
                  y2={PADDING.top + PLOT_HEIGHT}
                  stroke="currentColor"
                  className="text-border opacity-0 transition-opacity group-hover/point:opacity-100"
                />

                <g
                  transform={`translate(${tooltipX}, ${PADDING.top})`}
                  className="pointer-events-none opacity-0 transition-opacity group-hover/point:opacity-100"
                >
                  <rect
                    width="136"
                    height="62"
                    rx="8"
                    className="fill-popover"
                    stroke="currentColor"
                    strokeOpacity="0.12"
                  />
                  <text
                    x="10"
                    y="18"
                    className="fill-foreground text-[11px] font-semibold"
                  >
                    {point.label}
                  </text>
                  <text
                    x="10"
                    y="34"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {`Patients: ${point.patients}`}
                  </text>
                  <text
                    x="10"
                    y="50"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {`Doctors: ${point.doctors}`}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
