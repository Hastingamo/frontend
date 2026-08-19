// "use client"; // required since we're using useState and event handlers
// import { useState } from "react";

// async function addUser(name: string, age: number) {
//   const res = await fetch("http://localhost:3001/users", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, age}), // default age to 0 for now
//   });
//   return res.json();
// }

// export default function Home() {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState(0);
//   const [users, setUsers] = useState<any[]>([]);

//   const handleSubmit = async () => {
//     const newUser = await addUser(name, age );
//     setUsers([...users, newUser]); // update UI with new user
//     setName(""); // clear input
//     setAge(0); // clear age input
//   };

//   return (
//     <main>
//       <input
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Enter name"
//       />
//       <input
//         value={age}
//         onChange={(e) => setAge(Number(e.target.value))}
//         placeholder="Enter age"
//       />
//       <button onClick={handleSubmit}>Add User</button>

//       <ul>
//         {users.map((u) => (
//           <div key={u.id}>
//             <h1>{u.name}</h1> <h1>{u.age}</h1>
//           </div>
//         ))}
//       </ul>
//     </main>
//   );
// }

"use client"
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div>
      <Link href="/SingUp"> signup </Link>
    </div>
  )
}
