import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';

/**
 * SearchableSelect — a custom searchable dropdown that matches the project's ghost-border design.
 *
 * Props:
 * - name: field name for react-hook-form
 * - control: from useForm()
 * - label: string label shown above
 * - options: [{ value, label }]
 * - placeholder: string
 * - isLoading: bool
 * - rules: react-hook-form validation rules
 * - error: error message string
 * - disabled: bool — disables the dropdown (uses react-select's isDisabled)
 * - wrapperClassName: extra classes for outer wrapper
 */
const SearchableSelect = ({
    name,
    control,
    label,
    options = [],
    placeholder = 'Search...',
    isLoading = false,
    rules = {},
    error,
    disabled = false,
    wrapperClassName = '',
}) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: disabled ? 'transparent' : 'var(--surface-container-low)',
            border: `1.5px solid ${error ? 'var(--error)' : state.isFocused ? 'var(--primary)' : 'transparent'}`,
            borderRadius: '0.75rem',
            boxShadow: 'none',
            minHeight: '2.75rem',
            padding: '0 0.25rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'border-color 0.15s ease',
            '&:hover': {
                borderColor: state.isFocused ? 'var(--primary)' : 'transparent',
            },
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 0.5rem',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--on-surface)',
            fontSize: '0.875rem',          // text-sm
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--on-surface-variant)',
            opacity: 0.5,
            fontSize: '0.875rem',
            fontWeight: 400,
        }),
        input: (base) => ({
            ...base,
            color: 'var(--on-surface)',
            fontSize: '0.875rem',
            margin: 0,
            padding: 0,
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            zIndex: 50,
        }),
        menuList: (base) => ({
            ...base,
            padding: '0.25rem',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'var(--primary)'
                : state.isFocused
                    ? 'var(--surface-container-high)'
                    : 'transparent',
            color: state.isSelected ? 'var(--on-primary)' : 'var(--on-surface)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            transition: 'background-color 0.1s ease',
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: 'var(--on-surface-variant)',
            padding: '0 0.5rem',
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        clearIndicator: (base) => ({
            ...base,
            color: 'var(--on-surface-variant)',
            '&:hover': { color: 'var(--error)' },
        }),
        loadingMessage: (base) => ({
            ...base,
            color: 'var(--on-surface-variant)',
            fontSize: '0.875rem',
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: 'var(--on-surface-variant)',
            fontSize: '0.875rem',
        }),
    };

    return (
        <div className={`w-full flex flex-col gap-1 ${wrapperClassName}`}>
            {label && (
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <ReactSelect
                        {...field}
                        options={options}
                        isLoading={isLoading}
                        placeholder={placeholder}
                        isSearchable
                        isDisabled={disabled}
                        isRtl={isRTL}
                        styles={customStyles}
                        onChange={(selected) => field.onChange(selected?.value ?? null)}
                        value={options.find(o => String(o.value) === String(field.value)) || null}
                        classNamePrefix="rs"
                    />
                )}
            />

            {error && (
                <p className="text-error text-xs mt-1 font-medium">{error}</p>
            )}
        </div>
    );
};

SearchableSelect.displayName = 'SearchableSelect';

export default SearchableSelect;
