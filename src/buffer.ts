import { Buffer } from "buffer";

const memoryContainer = Buffer.alloc(4); // 4 bytes

memoryContainer[0] = 0xf4;
console.log(memoryContainer);
console.log(memoryContainer[0]);
