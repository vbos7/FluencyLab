type Feature = {
  label: string;
  included: boolean;
  highlight?: boolean;
};

export default function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {features.map((f) => (
        <li key={f.label} className="flex items-start gap-2 text-sm">
          <span
            className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
              f.included
                ? f.highlight
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {f.included ? (f.highlight ? "★" : "✓") : "–"}
          </span>
          <span className={f.included ? "text-gray-800" : "text-gray-400"}>
            {f.label}
          </span>
        </li>
      ))}
    </ul>
  );
}