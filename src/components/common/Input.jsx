import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    defaultValue,
    type = 'text',
    placeholder,
    prefix,
    error,
    className = '',
    wrapperClassName = '',
    inputClassName = 'text-base',
    rows = 4,
    ...nativeProps
}, ref) => {

    const isTextArea = type === 'textarea';

    return (
        <div className={`w-full ${wrapperClassName}`}>
            {label && (
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                    {label}
                </label>
            )}
            {isTextArea ? (
                <div className={`bg-surface-container-low rounded-xl px-4 py-3 transition-colors ghost-border ${error ? '!border-error' : ''} ${className}`}>
                    <textarea
                        ref={ref}
                        placeholder={placeholder}
                        rows={rows}
                        style={{
                            resize: 'vertical',
                            minHeight: `${rows * 1.6}rem`,
                            height: `${rows * 1.6}rem`,
                            overflowY: 'auto'
                        }}
                        className={`bg-transparent border-none focus:ring-0 text-sm text-on-surface w-full placeholder:text-on-surface-variant/50 p-0 outline-none ${inputClassName}`}
                        {...nativeProps}
                    />
                </div>
            ) : (
                <div className={`bg-surface-container-low rounded-xl px-4 py-3 flex items-center transition-colors ghost-border ${error ? '!border-error' : ''} ${className}`}>
                    {prefix && (
                        <span className="text-on-surface-variant text-lg font-headline font-bold mr-2">
                            {prefix}
                        </span>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        className={`bg-transparent border-none focus:ring-0 text-sm text-on-surface w-full placeholder:text-on-surface-variant/50 placeholder:font-normal p-0 outline-none font-normal ${inputClassName}`}
                        {...nativeProps}
                    />
                </div>
            )}
            {error && <p className="text-error text-xs mt-1 font-medium">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;