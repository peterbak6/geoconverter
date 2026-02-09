export default function InstallPanel() {
  return (
    <div className="card">
      <h3>Install</h3>

      <pre className="code">
{`npm install @peterbak6/geoconverter

# pnpm
pnpm add @peterbak6/geoconverter

# bun
bun add @peterbak6/geoconverter`}
      </pre>
    </div>
  );
}
