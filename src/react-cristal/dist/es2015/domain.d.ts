export declare type InitialPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
export interface Coords {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export declare const isSmartPosition: (position: "center" | Coords | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right") => position is InitialPosition;
