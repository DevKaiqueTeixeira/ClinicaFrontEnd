import { AlertCircle, type LucideIcon } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useId } from "react";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon: Icon, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="ml-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700"
        >
          {label}
        </label>
        <div className="relative">
          {Icon ? <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600/90" /> : null}
          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full rounded-xl border border-zinc-300/90 bg-white px-3 py-2.5 text-sm text-zinc-900",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition",
              "placeholder:text-zinc-400 focus:border-orange-500 focus:bg-orange-50/20",
              Icon ? "pl-9" : "",
              error ? "border-red-400" : "",
              className,
            ].join(" ")}
            {...props}
          />
        </div>
        {error ? (
          <p className="flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle size={14} />
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
