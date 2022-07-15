import { useRef, useEffect, PropsWithChildren, FunctionComponent } from 'react';
import root from 'react-shadow/emotion';
// import { setRoot } from '../store/actions';
// import { store } from '../store';
// import { useTypedSelector } from '../store/reducers';

const style = {}
const ShadowRoot: FunctionComponent = ({ children }: PropsWithChildren<{}>) => {
  const node = useRef((null as unknown) as HTMLElement);
  // const { style, minimized } = useTypedSelector(state => state.general);
  // useEffect(() => {
  //   store.dispatch(setRoot(node));
  // }, [node]);

  return (
    <root.div
      ref={node}
      style={{
        ...style,
        // boxShadow: minimized
        //   ? ''
        //   : `0 1px 1px rgba(0,0,0,0.11),
        //   0 2px 2px rgba(0,0,0,0.11),
        //   0 4px 4px rgba(0,0,0,0.11),
        //   0 6px 8px rgba(0,0,0,0.11),
        //   0 8px 16px rgba(0,0,0,0.11)`,
      }}
    >
      <link
        id="load-css-0"
        rel="stylesheet"
        type="text/css"
        href="https://www.gstatic.com/charts/47/css/core/tooltip.css"
      />
      <link
        id="load-css-1"
        rel="stylesheet"
        type="text/css"
        href="https://www.gstatic.com/charts/47/css/util/util.css"
      />
      {children}
    </root.div>
  );
};

export default ShadowRoot;
