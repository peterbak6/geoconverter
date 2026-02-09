import katex from "katex";

function Formula({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true,
    strict: "ignore",
  });
  return <div className="formula" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mathSection">
      <h2>
        <a className="anchor" href={`#${id}`}>
          {title}
        </a>
      </h2>
      {children}
    </section>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return <h3 className="mathH3">{children}</h3>;
}

export default function MathPanel() {
  return (
    <div className="card">
      <header className="mathHeader">
        <h3 style={{ marginBottom: 6 }}>Israeli Transverse Mercator Projection</h3>
        <div className="subtle">
          Step-by-step formulas used by the implementation (GRS80 / EPSG:2039).
        </div>
      </header>

      <div className="mathBody">
        <Section id="prime-vertical-radius" title="Prime vertical radius of curvature">
          <Formula
            tex={String.raw`\begin{aligned}
N(\phi) &= \frac{a}{\sqrt{1 - e^2 \sin^2 \phi}}
\end{aligned}`}
          />
        </Section>

        <Section id="ecef-coordinates" title="ECEF coordinates">
          <Formula
            tex={String.raw`\begin{aligned}
X &= (N + h)\cos\phi\cos\lambda \\
Y &= (N + h)\cos\phi\sin\lambda \\
Z &= ((1 - e^2)N + h)\sin\phi
\end{aligned}`}
          />
        </Section>

        <Section id="small-angle-helmert" title="Small-angle Helmert">
          <Formula
            tex={String.raw`\begin{aligned}
X' &= dx + (1 + s)(X - r_z Y + r_y Z) \\
Y' &= dy + (1 + s)(r_z X + Y - r_x Z) \\
Z' &= dz + (1 + s)(-r_y X + r_x Y + Z)
\end{aligned}`}
          />
        </Section>

        <Section id="ecef-to-geodetic" title="ECEF to Geodetic">
          <Subhead>Intermediate</Subhead>
          <Formula
            tex={String.raw`\begin{aligned}
p &= \sqrt{X^2 + Y^2} \\
\theta &= \arctan\left(\frac{Za}{pb}\right)
\end{aligned}`}
          />

          <Subhead>Latitude</Subhead>
          <Formula
            tex={String.raw`\begin{aligned}
\phi &= \arctan\left(\frac{Z + e'^2 b \sin^3 \theta}{p - e^2 a \cos^3 \theta}\right)
\end{aligned}`}
          />

          <Subhead>Longitude</Subhead>
          <Formula
            tex={String.raw`\begin{aligned}
\lambda &= \arctan\left(\frac{Y}{X}\right)
\end{aligned}`}
          />
        </Section>

        <Section id="meridional-arc" title="Meridional arc">
          <Formula
            tex={String.raw`\begin{aligned}
M(\phi) &= a\left(A_0\phi - A_2\sin 2\phi + A_4\sin 4\phi - A_6\sin 6\phi\right)
\end{aligned}`}
          />
        </Section>

        <Section id="auxiliary-values" title="Auxiliary values">
          <Formula
            tex={String.raw`\begin{aligned}
T &= \tan^2 \phi \\
C &= e'^2 \cos^2 \phi \\
A &= (\lambda - \lambda_0)\cos \phi
\end{aligned}`}
          />
        </Section>

        <Section id="easting-northing" title="Easting / Northing">
          <Formula
            tex={String.raw`\begin{aligned}
E &= E_0 + k_0 N\Bigg( A +
\frac{(1-T+C)A^3}{6} +
\frac{(5-18T+T^2+72C-58e'^2)A^5}{120}
\Bigg) \\[14pt]
N &= N_0 + k_0\Bigg( M - M_0 +
N\tan\phi\Bigg(
\frac{A^2}{2} +
\frac{(5-T+9C+4C^2)A^4}{24} \\
&\qquad +
\frac{(61-58T+T^2+600C-330e'^2)A^6}{720}
\Bigg)
\Bigg)
\end{aligned}`}
          />
        </Section>
      </div>
    </div>
  );
}
