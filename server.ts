// import express from "express";

// const app = express();

// const apiKey = process.env.E2E_KEY!;
// const token = process.env.E2E_TOKEN!;
// const projectId = process.env.E2E_PROJECT_ID!;

// app.get("/", async (_, res) => {
//   try {
//     const response = await fetch(
//       `https://api.e2enetworks.com/myaccount/api/v1/nodes/?project_id=${projectId}&location=Delhi&apikey=${apiKey}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const result = await response.json();

//     const rows = result.data
//       .map(
//         (vm: any) => `
//       <tr>
//         <td>${vm.name}</td>
//         <td>
//           <span class="${
//             vm.status === "Running" ? "running" : "stopped"
//           }">
//             ${vm.status}
//           </span>
//         </td>
//         <td>${vm.public_ip_address || "-"}</td>
//         <td>${vm.private_ip_address || "-"}</td>
//         <td>${vm.memory}</td>
//         <td>${vm.vcpus}</td>
//       </tr>
//     `
//       )
//       .join("");

//     res.send(`
// <!DOCTYPE html>
// <html>
// <head>
// <title>Infra Self-Service Portal</title>

// <style>

// body{
//     font-family:Segoe UI,sans-serif;
//     background:#09090b;
//     color:#fff;
//     margin:0;
//     padding:24px;
// }

// .header{
//     font-size:32px;
//     font-weight:bold;
//     margin-bottom:30px;
// }

// table{
//     width:100%;
//     border-collapse:collapse;
//     background:#111827;
//     border-radius:10px;
//     overflow:hidden;
// }

// th{
//     background:#1f2937;
//     color:#fff;
//     text-align:left;
//     padding:14px;
// }

// td{
//     padding:14px;
//     border-bottom:1px solid #374151;
// }

// .running{
//     background:#052e16;
//     color:#4ade80;
//     padding:6px 12px;
//     border-radius:9999px;
//     font-size:14px;
// }

// .stopped{
//     background:#3f2f00;
//     color:#facc15;
//     padding:6px 12px;
//     border-radius:9999px;
//     font-size:14px;
// }

// button{
//     background:#2563eb;
//     color:white;
//     border:none;
//     padding:10px 18px;
//     border-radius:8px;
//     cursor:pointer;
// }

// button:hover{
//     background:#1d4ed8;
// }

// .refresh{
//     margin-bottom:20px;
// }

// </style>

// </head>

// <body>

// <div class="header">
// 🚀 Infra Self-Service Portal - E2E Cloud
// </div>

// <div class="refresh">
// <button onclick="window.location.reload()">
// Refresh
// </button>
// </div>

// <table>

// <thead>
// <tr>
// <th>Name</th>
// <th>Status</th>
// <th>Public IP</th>
// <th>Private IP</th>
// <th>Memory</th>
// <th>vCPU</th>
// </tr>
// </thead>

// <tbody>
// ${rows}
// </tbody>

// </table>

// </body>
// </html>
// `);
//   } catch (err) {
//     res.status(500).send(String(err));
//   }
// });

// app.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });