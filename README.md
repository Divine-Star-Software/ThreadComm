<h1 align="center">
  ThreadComm
</h1>

A TypeScript library for inter thread communication, thread queues, and thread tasks.

Here is a basic exmaple:

Main Thread :

```ts
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



setTimeout(()=>{
    ThreadComm.parent.sendMessage("hello", ["hello from " + ThreadComm.threadName]);
},2000);
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

setTimeout(() => {
	ThreadComm.parent.sendMessage("hello", ["hello from nexus"]);
}, 2000);

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
	sayHellopQueue.run();
	await sayHellopQueue.awaitAll();
	console.log("ALL DONE");
}, 3000);

console.log("[nexus]");
```