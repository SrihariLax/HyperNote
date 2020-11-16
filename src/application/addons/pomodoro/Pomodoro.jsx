import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify'

import Tooltip from '../../ui/Tooltip';
import PomodoroPage from './PomodoroPage';
import WindowContext from '../../WindowContext';

const style = {
    container: {
        height: "100%",
        padding: "0.2rem",
    },
    header: {
        fontSize: "2rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
    },
    controls: {
        margin: "0 0.2rem",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-evenly",
        borderTop: "2px solid var(--dividerColor)",
        borderBottom: "2px solid var(--dividerColor)",
    },
    controlItem: {
        padding: "0.3rem",
        cursor: "pointer",
    },
    taskList: {
        display: "flex",
        flexFlow: "column nowrap",
    },
    task: {
        margin: "0.15rem",
        padding: "0.25rem",
        borderRadius: "0.3rem",
        cursor: "pointer",
    }
};

const Pomodoro = (props) => {
    let [ taskList, setTaskList ] = useState(['Task1', 'Task2', 'Task3']);
    const { openWindow } = useContext(WindowContext);

    const handleNewTask = () => {
        setTaskList([...taskList, "newTask"]);
    }

    const handleTaskOpen = (e) => {
        let name = e.currentTarget.innerHTML;
        let id = `pomodoro/${name}`
        let task = {
            addon: "pomodoro",
            name: name,
            id: id,
            page: undefined,
            running: false,
        }
        task.page = <PomodoroPage winObj={task} />;
        openWindow(task, true, async (winObj) => {
            if (winObj.id !== id) { // other than current open window
                if (winObj.running === true) { // if pomodoro is running
                    toast("Pomodoro in progress, Reset to change")
                    return false;
                }
                else {
                    return true; // open new window
                }
            }
        });
    }

    return (
        <div style={style.container}>
            <div style={style.header}>Tasks</div>
            <div style={style.controls}>
                <Tooltip style={style.controlItem} value="Add" position="bottom">
                    <FontAwesomeIcon icon={faPlus} onClick={handleNewTask} />
                </Tooltip>
                <Tooltip style={style.controlItem} value="Edit" position="bottom">
                    <FontAwesomeIcon icon={faPen} />
                </Tooltip>
                <Tooltip style={style.controlItem} value="Delete" position="bottom">
                    <FontAwesomeIcon icon={faTrash} />
                </Tooltip>
            </div>
            <div style={style.taskList}>
                {
                    taskList.map((task) => <div key={task} style={style.task} className="tree-item" onClick={handleTaskOpen}>{task}</div>)
                }
            </div>
        </div>
    );
}

export default Pomodoro;