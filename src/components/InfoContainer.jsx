export default function InfoContainer({ heading, value }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <h2 className="font-bold">{heading}</h2>
      <p>{value}</p>
    </div>
  );
}
