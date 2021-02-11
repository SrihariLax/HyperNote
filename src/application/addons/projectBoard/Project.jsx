import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSync } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";

import Tooltip from "../../ui/Tooltip";
import Textbox from "../../ui/Textbox";
import ProjectEntry from "./ProjectEntry";
import WindowContext from "../../WindowContext";
import { openDatabase } from "../../Database";
import UserPreferences from "../../settings/UserPreferences";
import {
    createProjectsDb,
    listProjectRows,
    addProjectRow,
    deleteProjectRow,
    editProjectRow,
} from "./ProjectDB";

const style = {
    container: {
        height: "100%",
        padding: "0.2rem",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexFlow: "column",
    },
    header: {
        fontSize: "1.5rem",
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
    projectList: {
        flex: "10",
    },
};

const Project = () => {
    let [projectList, setProjectList] = useState([]);
    let [textbox, setTextbox] = useState(false);
    let [openProject, setOpenProject] = useState(null);
    const { closeWindow } = useContext(WindowContext);
    const db = openDatabase(UserPreferences.get("projectStorage"));

    createProjectsDb(db, () => listProjectRows(db));

    const createNewProject = (projectName) => {
        const projectItem = {
            id: null,
            name: projectName,
        };
        addProjectRow(db, projectItem, (err) => {
            if (err) return;
            listProjectRows(db, setProjectList);
            setTextbox(false);
        });
        return "";
    };

    const handleRefresh = () => {
        listProjectRows(db, setProjectList);
    };

    const handleDelete = (projectItem) => {
        deleteProjectRow(db, projectItem.id, (err) => {
            if (err) return;
            if (openProject && openProject.projectItem.id === projectItem.id) {
                closeWindow(openProject);
                setOpenProject(null);
            }
            listProjectRows(db, setProjectList);
        });
    };

    const handleEdit = (projectItem, newName) => {
        projectItem.name = newName;
        editProjectRow(db, projectItem, (err) => {
            if (err) return;
            listProjectRows(db, setProjectList);
        });
    };

    useEffect(() => {
        listProjectRows(db, setProjectList);
        return () => {
            db.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={style.container}>
            <div style={style.header}>Tasks</div>
            <div style={style.controls}>
                <div style={style.controlItem} onClick={() => setTextbox(true)}>
                    <Tooltip value="Add" position="bottom">
                        <FontAwesomeIcon icon={faPlus} />
                    </Tooltip>
                </div>
                <div style={style.controlItem} onClick={handleRefresh}>
                    <Tooltip value="Refresh" position="bottom">
                        <FontAwesomeIcon icon={faSync} />
                    </Tooltip>
                </div>
            </div>
            {textbox && (
                <Textbox
                    visible={textbox}
                    setVisible={setTextbox}
                    handleConfirm={createNewProject}
                    handleCancel={() => setTextbox(false)}
                    placeholder="New Project"
                />
            )}
            <div style={style.projectList}>
                {projectList.map((projectItem) => (
                    <div key={`${projectItem.id}`}>
                        <ProjectEntry
                            setOpenProject={setOpenProject}
                            projectItem={projectItem}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                        />
                        <div className="divider" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Project;
