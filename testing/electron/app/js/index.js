import { ThreadComm } from "../out/ThreadComm.js";
await ThreadComm.$INIT("render");
const tasksCommManager = ThreadComm.createCommManager({
    name: "tasks",
    onPortSet: (comm, portName) => { },
});
let numTasksThreads = 6;
const tasksWorkers = [];
for (let i = 0; i < numTasksThreads; i++) {
    tasksWorkers.push(new Worker(new URL("./tasks/tasks.js", import.meta.url), { type: "module" }));
}
tasksCommManager.addPorts(tasksWorkers);
const nexusWorker = new Worker(new URL("./nexus/nexus.js", import.meta.url), {
    type: "module",
});
const nexusComm = ThreadComm.createComm("nexus");
nexusComm.setPort(nexusWorker);
tasksCommManager.connectToCom(nexusComm);
