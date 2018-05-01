import React from 'react';
import forEach from 'callbag-for-each';

export default function connect({sources={}, signals=[]}){
  return function(Comp){
    class SourceWrapper extends React.Component {
      constructor(props){
        super(props);
        this.state = {};
        this.comp = React.createRef();
      }
      componentDidMount(){
        Object.keys(sources).forEach(name => {
          forEach(d => this.setState({[name]: d}))(sources[name]);
        });
        signals.forEach(([source, callback]) => forEach(d => callback(this.comp.current, d))(source));
      }
      render() {
        const passOn = {
          ...this.props,
          ...this.state
        };
        return <Comp ref={this.comp} {...passOn} />;
      }
    }
    return SourceWrapper;
  }
};
