import * as React from 'react';
import { Component, ReactNode } from 'react';
import { InitialPosition, Size, Coords } from './domain';
export interface CristalProps {
    children: ReactNode;
    title?: string;
    initialPosition?: InitialPosition | Coords;
    initialSize?: Size;
    isResizable?: boolean;
    isDraggable?: boolean;
    onClose?: () => void;
    onMove?: (state: CristalState) => void;
    onResize?: (state: CristalState) => void;
    className?: string;
}
export interface CristalState {
    x: number;
    y: number;
    isDragging: boolean;
    isResizingX: boolean;
    isResizingY: boolean;
    zIndex: number;
    width?: number;
    height?: number;
}
export declare class Cristal extends Component<CristalProps, CristalState> {
    headerElement?: Element;
    childrenElement?: Element;
    static defaultProps: CristalProps;
    state: CristalState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onWindowResize: () => void;
    saveWrapperRef: (el?: Element) => void;
    setInitialPosition: (size: Size) => void;
    saveHeaderRef: (el: Element) => void;
    onMouseDown: () => void;
    onMouseMove: (e: MouseEvent) => void;
    notifyMove: () => void;
    notifyResize: () => void;
    readonly isResizing: boolean;
    onMouseUp: () => void;
    startFullResize: () => void;
    startXResize: () => void;
    startYResize: () => void;
    readonly header: JSX.Element;
    readonly content: JSX.Element;
    renderResizeHandles: () => JSX.Element[];
    changeZIndex: () => void;
    render(): React.ReactPortal;
}
