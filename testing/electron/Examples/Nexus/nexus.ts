import { ThreadComm } from "../../out/ThreadComm.js";
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

/* setTimeout(async () => {
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
 */

await tasksCommManager.waitTillAllAreReady();
tasksCommManager.syncData("nexus-data", [0, 1, 2, 3, 4]);
console.log("[nexus]");
