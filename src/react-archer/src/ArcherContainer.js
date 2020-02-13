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

  getDist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  p5NumberMap = (value, in_min, in_max, out_min, out_max) => {
    return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  setRelativeOffsets = (sourceToTargets, anchor, parentCoordinates, id) => {
    var relevantSourceToTargets = sourceToTargets.filter(
      data =>
        (data.source.id === id && data.source.anchor === anchor) ||
        (data.target.id === id && data.target.anchor === anchor),
    );

    var otherLocationPosList = [];
    var otherLocationPosDict = {};

    relevantSourceToTargets.map(data => {
      if (data.source.id === id) {
        var otherLocation = this.getPointCoordinatesFromAnchorPosition(
          'middle',
          data.target.id,
          parentCoordinates,
        );

        var location = this.getPointCoordinatesFromAnchorPosition(
          'middle',
          data.source.id,
          parentCoordinates,
        );
      }

      if (data.target.id === id) {
        var otherLocation = this.getPointCoordinatesFromAnchorPosition(
          'middle',
          data.source.id,
          parentCoordinates,
        );

        var location = this.getPointCoordinatesFromAnchorPosition(
          'middle',
          data.target.id,
          parentCoordinates,
        );
      }

      var opposite = -1 * (location.y - otherLocation.y);
      var adjacent = -1 * (location.x - otherLocation.x);
      var theta = Math.atan(opposite / adjacent);
      var thetaDegrees = (theta * 180) / Math.PI;

      if (opposite > 0 && adjacent > 0) {
      }

      if (opposite < 0 && adjacent > 0) {
        thetaDegrees = this.p5NumberMap(thetaDegrees, 0, -90, 0, 90);
      } else if (opposite < 0 && adjacent < 0) {
        thetaDegrees = this.p5NumberMap(thetaDegrees, 90, 0, 90, 180);
      } else if (opposite > 0 && adjacent < 0) {
        thetaDegrees = this.p5NumberMap(thetaDegrees, 0, -90, 180, 270);
      } else if (opposite > 0 && adjacent > 0) {
        thetaDegrees = this.p5NumberMap(thetaDegrees, 90, 0, 270, 360);
      }

      if (anchor === 'right' && thetaDegrees >= 270) {
        thetaDegrees -= 360;
      }

      var negationFactor;

      if (anchor === 'bottom') {
        negationFactor = 1;
        thetaDegrees = (thetaDegrees + 270) % 360;
      } else if (anchor === 'left') {
        negationFactor = 1;
        thetaDegrees = (thetaDegrees + 0) % 360;
      } else if (anchor === 'top') {
        thetaDegrees = (thetaDegrees + 90) % 360;
        negationFactor = -1;
      } else if (anchor === 'right') {
        thetaDegrees = (thetaDegrees + 180) % 360;
        negationFactor = -1;
      }

      otherLocationPosList.push(thetaDegrees);
      otherLocationPosDict[thetaDegrees] = data;

      // var negationFactor;
      // if (anchor === 'top' || anchor === 'right') {
      //   negationFactor = -1;
      // } else if (anchor === 'left' || anchor === 'bottom') {
      //   negationFactor = 1;
      // }

      otherLocationPosList.sort(function(a, b) {
        return a - b;
      });

      otherLocationPosList.map((pos, index) => {
        var data = otherLocationPosDict[pos];
        var medianVal = 0.5 * (otherLocationPosList.length - 1);
        if (data.source.id === id) {
          data.relativeSourceOffset =
            (index - medianVal) * this.props.relativeOffsetSize * negationFactor;
        } else {
          data.relativeTargetOffset =
            (index - medianVal) * this.props.relativeOffsetSize * negationFactor;
        }
      });
    });
  };

  getComputedAnchors = (source, target, parentCoordinates) => {
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

    var computedSourceAnchor;
    var computedTargetAnchor;

    if (Math.abs(yDiff) > Math.abs(xDiff)) {
      if (yDiff > 0) {
        computedTargetAnchor = 'bottom';
        computedSourceAnchor = 'top';
      } else {
        computedTargetAnchor = 'top';
        computedSourceAnchor = 'bottom';
      }
    } else {
      if (xDiff < 0) {
        computedTargetAnchor = 'left';
        computedSourceAnchor = 'right';
      } else {
        computedTargetAnchor = 'right';
        computedSourceAnchor = 'left';
      }
    }

    var newSource = Object.assign({}, source);
    var newTarget = Object.assign({}, target);

    if (source.anchor === 'middle') {
      newSource.anchor = computedSourceAnchor;
    }

    if (target.anchor === 'middle') {
      newTarget.anchor = computedTargetAnchor;
    }

    return { source: newSource, target: newTarget };
  };

  computeArrows = (): React$Node => {
    const parentCoordinates = this.getParentCoordinates();

    var sourceToTargets = this.getSourceToTargets();

    sourceToTargets = sourceToTargets.filter(data => {
      var startingPoint = this.getPointCoordinatesFromAnchorPosition(
        'middle',
        data.source.id,
        parentCoordinates,
      );

      var endingPoint = this.getPointCoordinatesFromAnchorPosition(
        'middle',
        data.target.id,
        parentCoordinates,
      );

      return startingPoint && endingPoint;
    });

    sourceToTargets = sourceToTargets.map(data => {
      var result = this.getComputedAnchors(data.source, data.target, parentCoordinates);
      data = Object.assign({}, data);
      data.source = result.source;
      data.target = result.target;
      return data;
    });

    var idDict = {};
    sourceToTargets.map(data => {
      idDict[data.source.id] = '';
      idDict[data.target.id] = '';
    });

    Object.keys(idDict).map(id => {
      this.setRelativeOffsets(sourceToTargets, 'left', parentCoordinates, id);
      this.setRelativeOffsets(sourceToTargets, 'right', parentCoordinates, id);
      this.setRelativeOffsets(sourceToTargets, 'top', parentCoordinates, id);
      this.setRelativeOffsets(sourceToTargets, 'bottom', parentCoordinates, id);
    });

    return sourceToTargets.map(data => {
      var source = data.source;
      var target = data.target;
      var label = data.label;
      var style = data.style;
      var relativeSourceOffset = data.relativeSourceOffset;
      var relativeTargetOffset = data.relativeTargetOffset;
      const strokeColor = (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength = (style && style.arrowLength) || this.props.arrowLength;

      const strokeWidth = (style && style.strokeWidth) || this.props.strokeWidth;

      const strokeDasharray = (style && style.strokeDasharray) || this.props.strokeDasharray;

      const arrowThickness = (style && style.arrowThickness) || this.props.arrowThickness;

      const noCurves = (style && style.noCurves) || this.props.noCurves;

      const offset = this.props.offset || 0;

      var endingAnchorOrientation = target.anchor;
      var endingPoint = this.getPointCoordinatesFromAnchorPosition(
        target.anchor,
        target.id,
        parentCoordinates,
      );

      var startingAnchorOrientation = source.anchor;
      var startingPoint = this.getPointCoordinatesFromAnchorPosition(
        source.anchor,
        source.id,
        parentCoordinates,
      );

      if (source.anchor === 'top' || source.anchor === 'bottom') {
        startingPoint.x += relativeSourceOffset;
      } else {
        startingPoint.y += relativeSourceOffset;
      }

      if (target.anchor === 'top' || target.anchor === 'bottom') {
        endingPoint.x += relativeTargetOffset;
      } else {
        endingPoint.y += relativeTargetOffset;
      }

      var onLineSelection = this.props.onLineSelection;
      if (!this.props.onLineSelection) {
        onLineSelection = () => null;
      }

      return (
        <SvgArrow
          onLineSelection={() => onLineSelection({ source: source, target: target })}
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
