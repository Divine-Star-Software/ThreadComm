import { ThreadComm } from "../out/ThreadComm.js";

await ThreadComm.$INIT("main");
ThreadComm.parent.listenForMessage("hello", (data) => {
	console.log(data);
});
const tasksCommManager = ThreadComm.createCommManager({
	name: "tasks",
	onPortSet: (comm, portName) => {},
});
let numTasksThreads = 6;
const tasksWorkers: Worker[] = [];
for (let i = 0; i < numTasksThreads; i++) {
	tasksWorkers.push(
		new Worker(new URL("./tasks/tasks.js", import.meta.url), { type: "module" })
	);
}
tasksCommManager.addPorts(tasksWorkers);
tasksCommManager.listenForMessage("hello", (data) => {
	console.log(data);
});
const nexusWorker = new Worker(new URL("./nexus/nexus.js", import.meta.url), {
	type: "module",
});
const nexusComm = ThreadComm.createComm("nexus");
nexusComm.setPort(nexusWorker);
nexusComm.listenForMessage("hello", (data) => {
	console.log(data);
});
tasksCommManager.connectToCom(nexusComm);
