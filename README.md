<h1 align="center">
  ThreadComm
</h1>

A TypeScript library for inter thread communication, thread queues, and thread tasks.

Here is a basic exmaple:

Main Thread :

```ts
import { ThreadComm } from "../out/ThreadComm.js";
await ThreadComm.$INIT("render");
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
const nexusWorker = new Worker(new URL("./nexus/nexus.js", import.meta.url), {
	type: "module",
});
const nexusComm = ThreadComm.createComm("nexus");
nexusComm.setPort(nexusWorker);

tasksCommManager.connectToCom(nexusComm);
```

Tasks Thread :

```ts
import { ThreadComm } from "../../out/ThreadComm.js";
ThreadComm.expectPorts(["nexus"]);
ThreadComm.registerTasks("say-hello", (data) => {
	console.log(`hello from ${ThreadComm.threadName} thread`, data);
	let k = 1_000_000_000;
	while (k--) {
		(32 >> 32) & 32;
	}
	if (ThreadComm.threadNumber == 1) {
		console.log("sup sup");
		ThreadComm.getComm("nexus").sendMessage("say-sup", ["sup"]);
	}
});
const nexusComm = ThreadComm.createComm("nexus");
nexusComm.onSetPort(() => {});
nexusComm.listenForMessage("sup", (data) => {
	console.log(data);
});
await ThreadComm.$INIT("tasks");

console.log("[tasks]");
```


Nexus Thread : 

```ts
import { ThreadComm } from "../../out/ThreadComm.js";
ThreadComm.expectPorts(["tasks"]);
const tasksCommManager = ThreadComm.createCommManager({
	name: "tasks",
	onPortSet(port, commName) {},
});
await ThreadComm.$INIT("nexus");
tasksCommManager.listenForMessage("say-sup", (data) => {
	console.log(data);
});

const sayHellopQueue = tasksCommManager.addQueue<string>(
	"say-hello",
	"say-hello"
);

setTimeout(async () => {
	let i = 10;
	while (i--) {
		tasksCommManager.runTask("say-hello", "sup");
	}
	sayHellopQueue.addQueue("main");
	let totalHellos = 100;
	while (totalHellos--) {
		sayHellopQueue.add("sup-" + totalHellos);
	}
	console.log(sayHellopQueue.__queueData);
	sayHellopQueue.run();
	await sayHellopQueue.awaitAll();
	console.log("ALL DONE");
}, 2000);

console.log("[nexus]");

```