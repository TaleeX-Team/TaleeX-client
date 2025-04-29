import { useState } from 'react';

export function OptimizedImage({
                                   src,
                                   alt,
                                   className = "",
                                   width = 200,
                                   height = 200,
                                   fallbackSrc = null,
                                   objectFit = "cover",
                                   ...props
                               }) {
    const [error, setError] = useState(false);

    // Generate a placeholder if no fallback is provided
    const placeholder = fallbackSrc || `public/logo.svg?height=${height}&width=${width}`;

    return (
        <img
            src={error ? placeholder : src}
            alt={alt}
            className={`${className} object-${objectFit}`}
            onError={() => setError(true)}
            loading="lazy"
            {...props}
        />
    );
}
