import React, { useState } from "react";

const WindowContext = React.createContext({
    windowList: {},
    openWindow: () => {},
    closeWindow: () => {},
});

export default WindowContext;

export const WindowContextWrapper = ({ children }) => {
    let [windowList, setWindowList] = useState({
        notes: [],
        pomodoro: [],
        calendar: [],
        project: [],
    });

    /**
     * Open a "window" pane attached to its following winObj state.
     *
     * If singleInstance (optional) is true, runOnAnotherInstance function is
     * executed with the existing winObj as its param. the return value of
     * runOnAnotherInstance will determine if new window will be created or not.
     * i.e., if returned true, only then, new window is opened. else it
     * is not opened
     *
     * winObj should have addon, id and page attributes at minimum
     *
     * @param {object} winObj
     * @param {boolean} singleInstance
     * @param {function} runOnAnotherInstance
     */
    const openWindow = (winObj, singleInstance, runOnAnotherInstance) => {
        let alreadyOpen = false;
        let addon = winObj.addon;
        let openWindows = windowList[addon] || [];
        let newList = [...openWindows, winObj];

        if (singleInstance && openWindows.length > 0) {
            // alreadyOpen = !(await runOnAnotherInstance(openWindows[0]));
            // if (!alreadyOpen) newList = [winObj]; // remove older window

            if (runOnAnotherInstance) {
                // if function is given
                runOnAnotherInstance(openWindows[0]).then((openNewWindow) => {
                    if (openNewWindow) {
                        newList = [winObj];
                        setWindowList((prevState) => ({
                            ...prevState,
                            [addon]: newList,
                        }));
                    }
                });
            } else {
                setWindowList((prevState) => ({
                    ...prevState,
                    [addon]: [winObj],
                }));
            }
        } else {
            openWindows.forEach((val) => {
                if (val.id === winObj.id) alreadyOpen = true;
            });

            if (!alreadyOpen) {
                setWindowList((prevState) => ({
                    ...prevState,
                    [addon]: newList,
                }));
            }
        }
    };

    const closeWindow = (winObj) => {
        let addon = winObj.addon;
        let index = windowList[addon].indexOf(winObj);
        if (index !== -1) {
            let otherFiles = [...windowList[addon]];
            otherFiles.splice(index, 1);
            setWindowList((prevState) => ({
                ...prevState,
                [addon]: otherFiles,
            }));
        }
    };

    return (
        <WindowContext.Provider value={{ windowList, openWindow, closeWindow }}>
            {children}
        </WindowContext.Provider>
    );
};
