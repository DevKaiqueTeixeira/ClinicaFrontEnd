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
        <label htmlFor={inputId} className="ml-1 block text-xs font-semibold text-slate-700">
          {label}
        </label>
        <div className="relative">
          {Icon ? <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/80" /> : null}
          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full rounded-xl border bg-white/90 px-3 py-2.5 text-sm text-slate-900 transition",
              "placeholder:text-slate-400 focus:border-teal-500",
              Icon ? "pl-9" : "",
              error ? "border-red-400" : "border-slate-200",
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
