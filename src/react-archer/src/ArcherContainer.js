// @flow

import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import Point from './Point';

import SvgArrow from './SvgArrow';

type Props = {
  arrowLength: number,
  arrowThickness: number,
  strokeColor: string,
  strokeWidth: number,
  strokeDasharray?: string,
  noCurves?: boolean,
  children: React$Node,
  style?: Object,
  svgContainerStyle?: Object,
  className?: string,
  offset?: number,
};

type SourceToTargetsArrayType = Array<SourceToTargetType>;

// For typing when munging sourceToTargetsMap
type JaggedSourceToTargetsArrayType = Array<SourceToTargetsArrayType>;

type State = {
  refs: {
    [string]: HTMLElement,
  },
  sourceToTargetsMap: {
    [string]: SourceToTargetsArrayType,
  },
  observer: ResizeObserver,
  parent: ?HTMLElement,
};

const defaultSvgContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  background: 'black',
};

function rectToPoint(rect: ClientRect) {
  return new Point(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: ClientRect,
) {
  switch (anchorPosition) {
    case 'top':
      return rectToPoint(rect).add(new Point(rect.width / 2, 0));
    case 'bottom':
      return rectToPoint(rect).add(new Point(rect.width / 2, rect.height));
    case 'left':
      return rectToPoint(rect).add(new Point(0, rect.height / 2));
    case 'right':
      return rectToPoint(rect).add(new Point(rect.width, rect.height / 2));
    case 'middle':
      return rectToPoint(rect).add(new Point(rect.width / 2, rect.height / 2));
    default:
      return new Point(0, 0);
  }
}

export type ArcherContainerContextType = {
  registerChild?: (string, HTMLElement) => void,
  registerTransitions?: (string, Array<SourceToTargetType>) => void,
  unregisterChild?: string => void,
  unregisterTransitions?: string => void,
};

const ArcherContainerContext = React.createContext<ArcherContainerContextType>({});

export const ArcherContainerContextProvider = ArcherContainerContext.Provider;
export const ArcherContainerContextConsumer = ArcherContainerContext.Consumer;

export class ArcherContainer extends React.Component<Props, State> {
  arrowMarkerUniquePrefix: string;

  constructor(props: Props) {
    super(props);

    const observer = new ResizeObserver(() => {
      this.refreshScreen();
    });

    this.state = {
      refs: {},
      sourceToTargetsMap: {},
      observer,
      parent: null,
    };

    const arrowMarkerRandomNumber = Math.random()
      .toString()
      .slice(2);

    this.arrowMarkerUniquePrefix = `arrow${arrowMarkerRandomNumber}`;
  }

  static defaultProps = {
    arrowLength: 10,
    arrowThickness: 6,
    strokeColor: '#f00',
    strokeWidth: 2,
    svgContainerStyle: {},
  };

  componentDidMount() {
    if (window) window.addEventListener('resize', this.refreshScreen);
  }

  componentWillUnmount() {
    const { observer } = this.state;

    Object.keys(this.state.refs).map(elementKey => {
      observer.unobserve(this.state.refs[elementKey]);
    });

    if (window) window.removeEventListener('resize', this.refreshScreen);
  }

  refreshScreen = (): void => {
    this.setState({ ...this.state });
  };

  storeParent = (ref: ?HTMLElement): void => {
    if (this.state.parent) return;

    this.setState(currentState => ({ ...currentState, parent: ref }));
  };

  getRectFromRef = (ref: ?HTMLElement): ?ClientRect => {
    if (!ref) return null;

    return ref.getBoundingClientRect();
  };

  getParentCoordinates = (): Point => {
    const rectp = this.getRectFromRef(this.state.parent);

    if (!rectp) {
      return new Point(0, 0);
    }
    return rectToPoint(rectp);
  };

  getPointCoordinatesFromAnchorPosition = (
    position: AnchorPositionType,
    index: string,
    parentCoordinates: Point,
  ): Point => {
    const rect = this.getRectFromRef(this.state.refs[index]);

    if (!rect) {
      return null;
    }
    const absolutePosition = computeCoordinatesFromAnchorPosition(position, rect);

    var retPos = absolutePosition.substract(parentCoordinates);
    retPos.x = retPos.x / this.props.scale;
    retPos.y = retPos.y / this.props.scale;

    return retPos;
  };

  registerTransitions = (
    elementId: string,
    newSourceToTargets: Array<SourceToTargetType>,
  ): void => {
    this.setState((prevState: State) => ({
      sourceToTargetsMap: {
        ...prevState.sourceToTargetsMap,
        [elementId]: newSourceToTargets,
      },
    }));
  };

  unregisterTransitions = (elementId: string): void => {
    this.setState(currentState => {
      const sourceToTargetsMapCopy = { ...currentState.sourceToTargetsMap };
      delete sourceToTargetsMapCopy[elementId];
      return { sourceToTargetsMap: sourceToTargetsMapCopy };
    });
  };

  registerChild = (id: string, ref: HTMLElement): void => {
    if (!this.state.refs[id]) {
      this.state.observer.observe(ref);

      this.setState((currentState: State) => ({
        refs: { ...currentState.refs, [id]: ref },
      }));
    }
  };

  unregisterChild = (id: string): void => {
    this.setState((currentState: State) => {
      currentState.observer.unobserve(currentState.refs[id]);
      const newRefs = { ...currentState.refs };
      delete newRefs[id];
      return { refs: newRefs };
    });
  };

  getSourceToTargets = (): Array<SourceToTargetType> => {
    const { sourceToTargetsMap } = this.state;

    // Object.values is unavailable in IE11
    const jaggedSourceToTargets: JaggedSourceToTargetsArrayType = Object.keys(
      sourceToTargetsMap,
    ).map((key: string) => sourceToTargetsMap[key]);

    // Flatten
    return [].concat.apply([], jaggedSourceToTargets);
  };

  computeArrows = (): React$Node => {
    const parentCoordinates = this.getParentCoordinates();

    var sourceToTargets = this.getSourceToTargets();
    var idDict = {};
    sourceToTargets.map(data => {
      idDict[data.source.id] = '';
      idDict[data.target.id] = '';
    });

    console.log(idDict);

    Object.keys(idDict).map(id => {
      var startIsId = sourceToTargets.filter(data => data.source.id === id);
      var endIsId = sourceToTargets.filter(data => data.target.id === id);

      // startIsId.map((line, index) => {
      //   var medianVal = 0.5 * (startIsId.length - 1);
      //   line.relativeStartOffset = (index - medianVal) * relativeOffsetUnit;
      // });

      // endIsId.map((line, index) => {
      //   var medianVal = 0.5 * (startIsId.length - 1);
      //   line.relativeEndOffset = (index - medianVal) * relativeOffsetUnit;
      // });
    });

    return this.getSourceToTargets().map(({ source, target, label, style }: SourceToTargetType) => {
      const strokeColor = (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength = (style && style.arrowLength) || this.props.arrowLength;

      const strokeWidth = (style && style.strokeWidth) || this.props.strokeWidth;

      const strokeDasharray = (style && style.strokeDasharray) || this.props.strokeDasharray;

      const arrowThickness = (style && style.arrowThickness) || this.props.arrowThickness;

      const noCurves = (style && style.noCurves) || this.props.noCurves;

      const offset = this.props.offset || 0;

      var startingRect = this.getRectFromRef(this.state.refs[source.id]);
      var endingRect = this.getRectFromRef(this.state.refs[target.id]);

      if (!startingRect || !endingRect) {
        return null;
      }

      var startingAnchorOrientation = source.anchor;
      var startingPoint = this.getPointCoordinatesFromAnchorPosition(
        'middle',
        source.id,
        parentCoordinates,
      );

      var endingAnchorOrientation = target.anchor;
      var endingPoint = this.getPointCoordinatesFromAnchorPosition(
        'middle',
        target.id,
        parentCoordinates,
      );

      var xDiff = startingPoint.x - endingPoint.x;
      var yDiff = startingPoint.y - endingPoint.y;

      if (Math.abs(yDiff) > Math.abs(xDiff)) {
        if (yDiff > 0) {
          target.anchor = 'bottom';
          source.anchor = 'top';
        } else {
          target.anchor = 'top';
          source.anchor = 'bottom';
        }
      } else {
        if (xDiff < 0) {
          target.anchor = 'left';
          source.anchor = 'right';
        } else {
          target.anchor = 'right';
          source.anchor = 'left';
        }
      }

      source.anchor = 'right';
      target.anchor = 'left';

      endingAnchorOrientation = target.anchor;
      endingPoint = this.getPointCoordinatesFromAnchorPosition(
        target.anchor,
        target.id,
        parentCoordinates,
      );

      startingAnchorOrientation = source.anchor;
      startingPoint = this.getPointCoordinatesFromAnchorPosition(
        source.anchor,
        source.id,
        parentCoordinates,
      );

      // if (source.anchor === 'top' || source.anchor === 'bottom') {
      //   startingPoint.x += relativeStartOffset;
      // } else {
      //   startingPoint.y += relativeStartOffset;
      // }

      // if (target.anchor === 'top' || target.anchor === 'bottom') {
      //   endingPoint.x += relativeEndOffset;
      // } else {
      //   endingPoint.y += relativeEndOffset;
      // }

      return (
        <SvgArrow
          key={JSON.stringify({ source, target })}
          startingPoint={startingPoint}
          startingAnchorOrientation={startingAnchorOrientation}
          endingPoint={endingPoint}
          endingAnchorOrientation={endingAnchorOrientation}
          strokeColor={strokeColor}
          arrowLength={arrowLength}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          arrowLabel={label}
          arrowThickness={arrowThickness}
          arrowMarkerId={this.getMarkerId(source, target)}
          noCurves={!!noCurves}
          offset={offset}
        />
      );
    });
  };

  /** Generates an id for an arrow marker
   * Useful to have one marker per arrow so that each arrow
   * can have a different color!
   * */
  getMarkerId = (source: EntityRelationType, target: EntityRelationType): string => {
    return `${this.arrowMarkerUniquePrefix}${source.id}${target.id}`;
  };

  /** Generates all the markers
   * We want one marker per arrow so that each arrow can have
   * a different color or size
   * */
  generateAllArrowMarkers = (): React$Node => {
    return this.getSourceToTargets().map(({ source, target, label, style }: SourceToTargetType) => {
      const strokeColor = (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength = (style && style.arrowLength) || this.props.arrowLength;

      const arrowThickness = (style && style.arrowThickness) || this.props.arrowThickness;

      const arrowPath = `M0,0 L0,${arrowThickness} L${arrowLength - 1},${arrowThickness / 2} z`;

      return (
        <marker
          id={this.getMarkerId(source, target)}
          key={this.getMarkerId(source, target)}
          markerWidth={arrowLength}
          markerHeight={arrowThickness}
          refX="0"
          refY={arrowThickness / 2}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d={arrowPath} fill={strokeColor} />
        </marker>
      );
    });
  };

  svgContainerStyle = () => ({
    ...defaultSvgContainerStyle,
    ...this.props.svgContainerStyle,
  });

  render() {
    const SvgArrows = this.computeArrows();

    return (
      <ArcherContainerContextProvider
        value={{
          registerTransitions: this.registerTransitions,
          unregisterTransitions: this.unregisterTransitions,
          registerChild: this.registerChild,
          unregisterChild: this.unregisterChild,
        }}
      >
        <div style={{ ...this.props.style }} className={this.props.className}>
          <div>
            <svg
              viewBox={`${-this.props.left / this.props.scale} ${-this.props.top /
                this.props.scale} ${window.innerWidth / this.props.scale} ${window.innerHeight /
                this.props.scale}`}
              style={{
                position: 'absolute',
                top: -this.props.top / this.props.scale,
                left: -this.props.left / this.props.scale,
                width: window.innerWidth / this.props.scale,
                height: window.innerHeight / this.props.scale,
              }}
            >
              <defs>{this.generateAllArrowMarkers()}</defs>

              {SvgArrows}
            </svg>
          </div>
          <div style={{ height: '100%' }} ref={this.storeParent}>
            {this.props.children}
          </div>
        </div>
      </ArcherContainerContextProvider>
    );
  }
}

export default ArcherContainer;
