export async function getE2EInstances() {
  const response = await fetch(
    `https://api.e2enetworks.com/myaccount/api/v1/nodes/?project_id=${process.env.E2E_PROJECT_ID}&location=Delhi&apikey=${process.env.E2E_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.E2E_TOKEN}`,
      },
      cache: 'no-store',
    }
  )

  return response.json()
}