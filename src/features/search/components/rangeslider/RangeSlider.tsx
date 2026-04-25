interface RangeValue {
  min: number;
  max: number;
}

interface RangeSliderProps {
  min: number;
  max: number;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  onChangeEnd?: () => void;
  step?: number;
  unitLabel?: string;
  minAriaLabel?: string;
  maxAriaLabel?: string;
  formatValue?: (value: number) => string;
}

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  onChangeEnd,
  step = 1,
  unitLabel,
  minAriaLabel = "Minimum value",
  maxAriaLabel = "Maximum value",
  formatValue = (rangeValue) => rangeValue.toLocaleString(),
}: RangeSliderProps) {
  const rangeSize = max - min || 1;
  const minThumbClass =
    "absolute inset-0 z-20 h-1.5 w-full appearance-none bg-transparent pointer-events-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary-blue-400 [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary-blue-400 [&::-webkit-slider-thumb]:shadow-sm";
  const maxThumbClass =
    "absolute inset-0 z-30 h-1.5 w-full appearance-none bg-transparent pointer-events-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary-blue-400 [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary-blue-400 [&::-webkit-slider-thumb]:shadow-sm";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-normal leading-[21px] text-grey-800">
        <span>
          {formatValue(value.min)}
          {unitLabel ? ` ${unitLabel}` : ""}
        </span>
        <span>
          {formatValue(value.max)}
          {unitLabel ? ` ${unitLabel}` : ""}
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-grey-100">
        <div
          className="absolute top-0 h-full rounded-full bg-primary-blue-400"
          style={{
            left: `${((value.min - min) / rangeSize) * 100}%`,
            right: `${100 - ((value.max - min) / rangeSize) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={(e) => {
            const rawMin = Number(e.target.value);
            const nextMin = Math.max(min, Math.min(rawMin, value.max - step));
            onChange({ ...value, min: nextMin });
          }}
          onMouseUp={onChangeEnd}
          onTouchEnd={onChangeEnd}
          onKeyUp={onChangeEnd}
          aria-label={minAriaLabel}
          className={minThumbClass}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={(e) => {
            const rawMax = Number(e.target.value);
            const nextMax = Math.min(max, Math.max(rawMax, value.min + step));
            onChange({ ...value, max: nextMax });
          }}
          onMouseUp={onChangeEnd}
          onTouchEnd={onChangeEnd}
          onKeyUp={onChangeEnd}
          aria-label={maxAriaLabel}
          className={maxThumbClass}
        />
      </div>
    </div>
  );
}