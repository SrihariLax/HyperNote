import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import EditorGroup from './EditorGroup';

export default class Workspace extends React.Component {
    render() {
        return (
            <SplitPane split="horizontal">
                {
                    this.props.openFiles &&
                    this.props.openFiles.map((fileObj, idx) => 
                        <Pane minSize="50px" >
                            <EditorGroup fileObj={fileObj} closeFile={this.props.closeFile} />
                        </Pane>
                    )
                }
            </SplitPane>
        );
    }
}