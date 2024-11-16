class MyBuffer {
  private buffer: Uint8Array;

  // Constructor to initialize MyBuffer
  constructor(
    input: string | number | Array<number>,
    encoding: BufferEncoding = "utf-8"
  ) {
    if (typeof input === "number") {
      // Create a buffer of the given size filled with zeros
      this.buffer = new Uint8Array(input);
    } else if (typeof input === "string") {
      // Create a buffer from the given string
      this.buffer = this.fromString(input, encoding);
    } else if (Array.isArray(input)) {
      // Create a buffer from an array of numbers
      this.buffer = new Uint8Array(input);
    } else {
      throw new Error("Invalid input type for MyBuffer");
    }
  }

  // Helper method to encode a string into a buffer based on the encoding
  private fromString(input: string, encoding: BufferEncoding): Uint8Array {
    switch (encoding) {
      case "utf-8":
      case "utf8":
        return new TextEncoder().encode(input);
      case "hex":
        return this.fromHex(input);
      default:
        throw new Error("Unsupported encoding");
    }
  }

  // Convert a hex string to a Uint8Array
  private fromHex(input: string): Uint8Array {
    if (input.length % 2 !== 0) throw new Error("Invalid hex string");
    const result = new Uint8Array(input.length / 2);
    for (let i = 0; i < input.length; i += 2) {
      result[i / 2] = parseInt(input.slice(i, i + 2), 16);
    }
    return result;
  }

  // Get the length of the buffer
  get length(): number {
    return this.buffer.length;
  }

  // Write a string to the buffer with specified encoding
  write(value: string, encoding: BufferEncoding = "utf-8"): number {
    const data = this.fromString(value, encoding);
    const length = Math.min(data.length, this.buffer.length);
    for (let i = 0; i < length; i++) {
      this.buffer[i] = data[i];
    }
    return length;
  }

  // Convert the buffer to a string
  toString(encoding: BufferEncoding = "utf-8"): string {
    switch (encoding) {
      case "utf-8":
      case "utf8":
        return new TextDecoder().decode(this.buffer);
      case "hex":
        return Array.from(this.buffer)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
      default:
        throw new Error("Unsupported encoding");
    }
  }

  // Get a slice of the buffer
  slice(start: number, end?: number): MyBuffer {
    return new MyBuffer(
      Array.from(this.buffer.slice(start, end || this.buffer.length))
    );
  }

  // Read an unsigned 8-bit integer at the given offset
  readUInt8(offset: number): number {
    if (offset >= this.buffer.length)
      throw new RangeError("Offset is out of bounds");
    return this.buffer[offset];
  }

  // Set value at a specific index
  set(value: number, offset: number): void {
    if (offset >= this.buffer.length)
      throw new RangeError("Offset is out of bounds");
    this.buffer[offset] = value;
  }

  // Static method to create a buffer from an array
  static from(
    data: string | Array<number>,
    encoding: BufferEncoding = "utf-8"
  ): MyBuffer {
    return new MyBuffer(data, encoding);
  }
}

// Example usage
const myBuffer = new MyBuffer("Hello", "utf-8");
console.log(myBuffer.toString()); // "Hello"

const hexBuffer = MyBuffer.from("68656c6c6f", "hex");
console.log(hexBuffer.toString("utf-8")); // "hello"

const sliceBuffer = myBuffer.slice(1, 3);
console.log(sliceBuffer.toString()); // "el"

myBuffer.set(65, 0);
console.log(myBuffer.toString()); // "Aello"

console.log(myBuffer.readUInt8(0)); // 65
