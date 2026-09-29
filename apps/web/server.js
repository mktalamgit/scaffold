const http = require("node:http");
const port = Number(process.env.WEB_PORT || 5173);
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Scaffold Tasks</title><style>body{font:16px system-ui;max-width:42rem;margin:4rem auto;padding:0 1rem}li{margin:.75rem 0}form{display:flex;gap:.5rem}input{flex:1;padding:.5rem}button{padding:.5rem}</style></head>
<body><h1>Tasks</h1><form id="form"><input id="title" required placeholder="What needs doing?"><button>Add task</button></form><ul id="tasks"></ul>
<script>const list=document.querySelector("#tasks");const form=document.querySelector("#form");async function load(){const tasks=await fetch("http://localhost:3001/tasks").then(r=>r.json());list.innerHTML=tasks.map(t=>"<li>"+(t.completed?"✅ ":"")+"<button data-id='"+t.id+"'>"+t.title+"</button></li>").join("")}form.onsubmit=async e=>{e.preventDefault();await fetch("http://localhost:3001/tasks",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title:title.value})});title.value="";load()};load();</script></body></html>`;
http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}).listen(port, () => console.log(`Web listening on http://localhost:${port}`));
