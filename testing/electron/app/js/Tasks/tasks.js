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
nexusComm.onSetPort(() => { });
nexusComm.listenForMessage("sup", (data) => {
    console.log(data);
});
await ThreadComm.$INIT("tasks");
setTimeout(() => {
    ThreadComm.parent.sendMessage("hello", ["hello from " + ThreadComm.threadName]);
}, 2000);
console.log("[tasks]");
