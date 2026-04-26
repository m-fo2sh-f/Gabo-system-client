import { forwardRef } from 'react';
import { IoCaretDownSharp } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

const Select = forwardRef(({
    label,
    options = [],
    error,
    className = '',
    wrapperClassName = '',
    placeholder = 'Select an option',
    ...rest // دي بتلم الـ name والـ onChange والـ onBlur اللي جايين من الـ register
}, ref) => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    return (
        <div className={`w-full max-w-full flex flex-col gap-1 ${wrapperClassName}`}>
            {/* 1. العنوان */}
            {label && (
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider pl-1">
                    {label}
                </label>
            )}

            {/* 2. الحقل نفسه */}
            <div className="relative">
                <select
                    ref={ref}
                    {...rest}
                    className={`w-full max-w-full truncate appearance-none bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium rounded-xl px-4 py-2 sm:py-3 h-10 sm:h-12 outline-none ghost-border transition-colors cursor-pointer pe-10
                    ${error ? '!border-error' : 'focus:!border-primary'} ${className}`}
                    defaultValue=""
                >

                    <option value="" disabled hidden className="text-on-surface-variant/50">
                        {placeholder}
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value} className="text-on-surface bg-surface text-xs sm:text-sm">
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* 3. الأيقونة بتاعتك (هتفضل موجودة ومش هتتأثر بالضغطة لأننا مدينها pointer-events-none) */}
                <span className="absolute end-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    <IoCaretDownSharp />
                </span>
            </div>

            {/* 4. رسالة الخطأ */}
            {error && <p className="text-error text-xs mt-1 font-medium pl-1">{error}</p>}
        </div>
    );
});

// دي بتخلي اسم الـ Component واضح في الـ React DevTools
Select.displayName = 'Select';

export default Select;
