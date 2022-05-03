import {readGitLabConfig} from '../scripts/gitlab/access';
import {getProjects} from "../scripts/gitlab/projects";
import {Modal} from "bootstrap";

readGitLabConfig().then(config => document.getElementById('txtGitLab')?.setAttribute("value", config.host));

// search button implementation
const btnSearchProject = document.getElementById("btnSearchProject") as HTMLButtonElement;
const txtSearchProject = document.getElementById("txtSearchProject") as HTMLInputElement;
const dlgSelectProject = document.getElementById("dlgSelectProject") as HTMLDivElement;
const pnlProjectsToSelect = document.getElementById("pnlProjectsToSelect") as HTMLDivElement;
const modalSelectProject = dlgSelectProject ? new Modal(dlgSelectProject) : null;
const btnSelectProjectsCancel = document.getElementById("btnSelectProjectsCancel") as HTMLButtonElement;
btnSelectProjectsCancel.addEventListener("click", evt => {
   modalSelectProject?.hide();
});
btnSearchProject.addEventListener("click", evt => {
    if(modalSelectProject) {
        getProjects(txtSearchProject.value)
            .then(console.log);
        modalSelectProject.show();
    }
});
