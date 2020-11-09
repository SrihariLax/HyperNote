import React, { useState } from 'react';

import Navbar from './Navbar';
import Searchbar from './Searchbar';
import Explorer from '../explorer/Explorer';
import FileSystem from '../explorer/FileSystem';
import UserPreferences from '../settings/UserPreferences';

const style = {
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        height: "100%",
    },
    fillFlex: {
        flex: "1",
        width: "calc(100% - 35px)"
    }
}

const Navspace = (props) => {
    let [selection, setSelection] = useState('explorer');

    let test = FileSystem.getTree(UserPreferences.get('userStorage'));
    const EXPLORER = <Explorer
        key={test.id}
        id={test.id}
        name={test.name}
        type={test.type}
        path={test.path}
        subtree={test.children}
        openFile={props.openFile}
    />;
    const SEARCH = <Searchbar />;

    const showSelection = () => {
        switch (selection) {
            case "explorer": return EXPLORER;
            case "search": return SEARCH;
            default: return;
        }
    }

    return (
        <div style={style.container}>
            <Navbar changeSelection={setSelection} />
            <div style={style.fillFlex}>
                {showSelection()}
            </div>
        </div>
    );
}

export default Navspace;