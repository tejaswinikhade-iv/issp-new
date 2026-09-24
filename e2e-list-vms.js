const apiKey = process.env.E2E_KEY;
const token = process.env.E2E_TOKEN;
const projectId = process.env.E2E_PROJECT_ID;

async function main() {
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

    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();

