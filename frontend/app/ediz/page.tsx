// Creation Date: 27.06.2024

// Dummy function to fetch data from the backend
async function getEdiz() {
  const response = await fetch("http://127.0.0.1:8000/ediz");
  const data = await response.json();
  return data;
}

// Async function and component to fetch data from the backend
export default async function Home() {
  const ediz = await getEdiz();
  console.log(ediz);

  return (
    <main>
      <div>Ediz 31</div>
      <div>{ediz.message}</div>
    </main>
  );
}
