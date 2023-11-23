import * as React from 'react';

export type LoginProps<
    D extends React.ElementType = div['defaultComponent'],
    P = unknown,
> = div<P, D>;
