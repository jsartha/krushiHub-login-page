import React from 'react';
import { Check, X } from 'lucide-react';
import { evaluatePasswordSecurity } from '../../utils/security';

interface Props {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ password }) => {
  if (!password) return null;

  const result = evaluatePasswordSecurity(password);

  const getBarColor = (index: number) => {
    if (result.score >= index + 1) {
      if (result.score === 1) return 'bg-rose-500';
      if (result.score === 2) return 'bg-amber-500';
      if (result.score === 3) return 'bg-emerald-500';
      return 'bg-emerald-600';
    }
    return 'bg-slate-200';
  };

  const getLabelColor = () => {
    switch (result.label) {
      case 'Too Weak':
      case 'Weak':
        return 'text-rose-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Strong':
      case 'Very Strong':
        return 'text-emerald-700';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="mt-2 space-y-2 text-xs">
      <div className="flex items-center justify-between font-medium">
        <span className="text-slate-500">Password Security</span>
        <span className={getLabelColor()}>{result.label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        <div className={`rounded-full transition-all duration-300 ${getBarColor(0)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(1)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(2)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(3)}`} />
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          {result.hasMinLength ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={result.hasMinLength ? 'text-slate-800' : 'text-slate-500'}>
            8+ characters
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {result.hasUppercase ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={result.hasUppercase ? 'text-slate-800' : 'text-slate-500'}>
            Uppercase letter (A-Z)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {result.hasNumber ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={result.hasNumber ? 'text-slate-800' : 'text-slate-500'}>
            At least one number
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {result.hasSpecialChar ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={result.hasSpecialChar ? 'text-slate-800' : 'text-slate-500'}>
            Special character (@$#!)
          </span>
        </div>
      </div>
    </div>
  );
};
