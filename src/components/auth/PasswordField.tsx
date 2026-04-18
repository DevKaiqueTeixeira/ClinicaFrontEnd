import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useId, useState } from "react";

export interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
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
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600/90" />
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={[
              "w-full rounded-xl border border-zinc-300/90 bg-white px-3 py-2.5 pl-9 pr-10 text-sm text-zinc-900",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition",
              "placeholder:text-zinc-400 focus:border-orange-500 focus:bg-orange-50/20",
              error ? "border-red-400" : "",
              className,
            ].join(" ")}
            {...props}
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
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

PasswordField.displayName = "PasswordField";

export default PasswordField;
