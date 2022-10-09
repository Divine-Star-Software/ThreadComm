import { ThreadComm } from "../../out/ThreadComm.js";
ThreadComm.expectPorts(["tasks"]);
const tasksCommManager = ThreadComm.createCommManager({
    name: "tasks",
    onPortSet(port, commName) { },
});
await ThreadComm.$INIT("nexus");
tasksCommManager.listenForMessage("say-sup", (data) => {
    console.log(data);
});
const sayHellopQueue = tasksCommManager.addQueue("say-hello", "say-hello");
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
