import Button from "../components/Button";

export default function Home() {
  return (
    <main className="page">
      <p className="eyebrow">BASE FRONTEND</p>
      <h1>Your frontend foundation is ready.</h1>
      <p>A reusable React + TypeScript application.</p>

      <Button onClick={() => alert("It works!")}>
        Test Button
      </Button>
    </main>
  );
}
