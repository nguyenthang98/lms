const config = require("../config.json");
const backendURL = `${config.backendUrl}`;
async function getReq(path = "/", options = {}) {
    try {
        const res = await fetch(`${backendURL}${path}`, {
            method: "GET",
            mode: 'cors',
            ...options
        });
        const jsonData = await res.json();
        return jsonData;
    } catch (e) {
        console.error(e);
    }
}

async function postReq(path = "/", data, options = {}) {
    try {
        const res = await fetch(`${backendURL}${path}`, {
            method: "POST",
            mode: 'cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        });
        const jsonData = await res.json();
    } catch (e) {
        console.error(e);
    }
}

async function deleteReq(path = "/", options = {}) {
    try {
        const res = await fetch(`${backendURL}${path}`, {
            method: "DELETE",
            mode: 'cors',
            ...options
        });
        const jsonData = await res.json();
    } catch (e) {
        console.error(e);
    }
}

export default {
    listTask: async () => {
        return await getReq("/api/task/list");
    },
    getTask: async (id) => {
        return await getReq(`/api/task/${id}`);
    },
    listSubmissionByTask: async (taskId) => {
        return await getReq(`/api/task/${taskId}/submission`);
    },
    createSubmission: async (submission) => {
        return await postReq(`/api/submission/new`, submission);
    },
    removeSubmission: async (id) => {
        return await deleteReq(`/api/submission/${id}`);
    },
    createTask: async (task) => {
        return await postReq(`/api/task/new`, task);
    },
    removeTask: async (id) => {
        return await deleteReq(`/api/task/${id}`);
    },
    editSubmission: async (submission) => {
        return await postReq(`/api/submission/edit`, submission);
    }
}
