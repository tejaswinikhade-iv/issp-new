const http = require("http");

const apiKey = process.env.E2E_KEY;
const token = process.env.E2E_TOKEN;
const projectId = process.env.E2E_PROJECT_ID;

const server = http.createServer(async (req, res) => {
  if (req.url === "/" || req.url === "/vms") {
    try {
      const response = await fetch(
        `https://api.e2enetworks.com/myaccount/api/v1/nodes/?project_id=${projectId}&location=Delhi&apikey=${apiKey}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(data, null, 2));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
