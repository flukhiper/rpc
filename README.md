# RPC

To init project:

```bash
bun init
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Setup
### 1. Run Typescript Code

- Add a script to `package.json`:

```json
{
  "scripts": {
    "dev": "bun run index.ts",
    "build": "bun run tsc",
    "start": "bun run dist/index.ts"
  }
}
```

- Run script:

```bash
bun run dev
```

### 2. Integrating ESLint

- Install ESLint:

```bash
bun add -d eslint
```

- Initialize ESLint:

```bash
bun run eslint --init
```
> Select these anwsers
> - How would you like to use ESLint? : **To check syntax and find problems**
> - What type of modules does your project use? : **JavaScript modules (import/export)**
> - Which framework does your project use? : **None of these**
> - Does your project use TypeScript? : **Yes**
> - Where does your code run? : **Node**
> - Would you like to install them now? : **Yes**
> - Which package manager do you want to use? : **bun**

- Install Stylistic ESLint:

```bash
bun add -d @stylistic/eslint-plugin
```

- Add ESLint configuration to `eslint.config.js`:

```javascript
import stylistic from '@stylistic/eslint-plugin'

export default [
  // ...your other config items
  stylistic.configs.customize({}),
]
```

- Set VSCode ESLint:
  1. Install **Eslint** extension.
  2. Press **Ctrl+Shift+P**, which brings up the **Command Palette**. Form here, type ***Preferences: Open Settings(UI)*** and **enter**.
  3. Type ***Default Formatter*** and set to ***None***
  4. Press **Ctrl+Shift+P**, which brings up the **Command Palette**. Form here, type ***Preferences: Open Workspace Settings (JSON)*** and **enter**.
  5. Add editor setting to `.vscode/settings.json`.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
}
```

# What is RPC?

Remote Procedure Call หรือ RPC เป็น technique ที่ใช้งานได้ดีกับ distributed systems (microservice เป็นต้น)

เป็น technique ที่ช่วยให้โปรแกรมสามารถเรียกใช้ procedure (function หรือ method) บน remote machine (client เป็นต้น)ได้เสมือนว่าเป็นการเรียกใช้งาน procedure ใน local machine (server เป็นต้น)

## Components Involved in RPC
- **Client**: Process ที่ initiates RPC แล้วทำการเรียกใช้ procedure เสมือนว่าเป็น local
- **Server**: Remote process ที่เก็บการ implementation ของ procedure ที่ถูกเรียกใช้
- **Client Stub**: Proxy บน client ที่ทำตัวเป็น interface ของ procedure ที่เมื่อ client ทำการเรียกใช้ procedure ตัว client stub จะทำการแปลง (serializes หรือ marshals) arguments และส่งต่อผ่านทาง network.
- **Server Stub**: Proxy บน server ที่รับ request จาก client แล้วทำการแปลงกลับ (deserializes หรือ unmarshals) arguments แล้วเรียกใช้ procedure ที่อยู่บน server ซึ่งเมื่อเสร็จจะทำการส่งกลับ results ไปที่ client.
- **Transport Layer**: ส่วนที่ดูเรื่องการส่งข้อมูลที่ serialized แล้วระหว่าง client และ server บน network

## How RPC Works Step-by-Step

### 1. Client Calls the Procedure
client ทำการเรียกใช้ procedure โดยทำเหมือนว่า procedure อยู่ใน local แต่การเรียกใช้นั้นจริง ๆ แล้วถูกส่งไปที่ client stub

### 2. Marshaling the Request (Serialization)
client stub ทำการ marshaling (serialization) arguments ให้อยู่ในรูปแบบที่สามารถส่งผ่าน network ได้ ซึ่งอาจรวมถึงการแปลงข้อมูลประเภทง่าย ๆ เช่น integers และ strings ให้เป็น stream ของ bytes หรือแม้กระทั่งการ serialize โครงสร้างข้อมูลที่ซับซ้อน เช่น lists หรือ objects

### 3. Network Communication
เมื่อทำการ marshaling เสร็จแล้ว client stub จะใช้ transport layer (เช่น TCP, UDP) ในการส่ง request ไปยัง server โดย request ส่วนใหญ่จะประกอบด้วย
- **Procedure identifier**: ชื่อหรือ ID ของฟังก์ชันที่ถูกเรียกใช้
- **Arguments**: arguments ที่ถูก marshaled

### 4. Unmarshaling the Request (Deserialization)
server stub จะรับ request จาก network และทำการ unmarshaling (deserialize) arguments เช่นการแปลง stream ของ bytes กลับไปเป็นรูปแบบของข้อมูลที่ถูกต้อง

### 5. Executing the Procedure
server stub จะเรียกใช้ procedure จริงที่อยู่บน server โดยใช้ arguments ที่ถูก deserialize แล้ว

### 6. Marshaling the Response
หลังจาก procedure ทำงานเสร็จ result (หรือ error ใด ๆ) จะถูกส่งกลับไปที่ server stub ซึ่งทำการ marshaling ส่งกลับ

### 7. Network Communication (Return Trip)
server stub จะส่ง response ที่ถูก marshaled กลับไปยัง client ผ่าน network โดยใช้ transport layer เดิม

### 8. Unmarshaling the Response
client stub จะรับ response และทำการ unmarshaling ตัว response กลับเป็นรูปแบบข้อมูลที่ถูกต้อง

### 9. Client Receives the Result
client stub ส่ง response ที่ถูก unmarshaled กลับไปยัง procedure ที่เรียกใช้งานตอนแรกและ client ก็จะทำงานต่อไปเสมือนว่า procedure ได้ถูกเรียกใช้ในเครื่อง local

## RPC Frameworks
- **XML-RPC**: RPC แบบเรียบง่ายที่ encode ในรูปแบบ XML
- **JSON-RPC**: RPC แบบเรียบง่ายที่ encode ในรูปแบบ JSON
- **gRPC**: RPC framework ที่พัฒนาโดย Google โดยใช้ buffers protocol สำหรับการ serialize และส่งข้อมูล
- **tRPC**: RPC framework ที่ให้ปัจจัยด้าน type safety ระหว่าง client และ server โดยใช้ TypeScript

# gRPC (Google Remote Procedure Call)
