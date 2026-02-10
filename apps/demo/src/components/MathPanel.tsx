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

function CodeBlock({ code, className }: { code: string; className?: string }) {
  return <pre className={className + " code"}>{code}</pre>;
}

export default function MathPanel() {
  return (
    <div className="card">
      <header className="mathHeader">
        <h2 style={{ marginBottom: 6 }}>
          Computational steps for Israeli Transverse Mercator Projection
        </h2>
      </header>

      <div className="mathBody">
        <Section
          id="prime-vertical-radius"
          title="Prime vertical radius of curvature"
        >
          <p className="mathDesc">Local curvature radius used to map geodetic to Cartesian.</p>
          <Formula
            tex={String.raw`\begin{aligned}
N(\phi) &= \frac{a}{\sqrt{1 - e^2 \sin^2 \phi}}
\end{aligned}`}
          />
        </Section>

        <Section id="ecef-coordinates" title="ECEF coordinates">
          <p className="mathDesc">Convert lon/lat/height to Earth-centered coordinates.</p>
          <Formula
            tex={String.raw`\begin{aligned}
X &= (N + h)\cos\phi\cos\lambda \\
Y &= (N + h)\cos\phi\sin\lambda \\
Z &= ((1 - e^2)N + h)\sin\phi
\end{aligned}`}
          />
        </Section>

        <Section id="small-angle-helmert" title="Small-angle Helmert">
          <p className="mathDesc">Apply datum shift into the target datum (7-parameter transform).</p>
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
          <p className="mathDesc">Iteratively recover lon/lat from ECEF after the datum shift.</p>
          <Formula
            tex={String.raw`\begin{aligned}
p &= \sqrt{X^2 + Y^2} \\
\theta &= \arctan\left(\frac{Za}{pb}\right)
\end{aligned}`}
          />

          <Subhead>Latitude</Subhead>
          <p className="mathDesc">Calculate latitude from ECEF coordinates.</p>
          <Formula
            tex={String.raw`\begin{aligned}
\phi &= \arctan\left(\frac{Z + e'^2 b \sin^3 \theta}{p - e^2 a \cos^3 \theta}\right)
\end{aligned}`}
          />

          <Subhead>Longitude</Subhead>
          <p className="mathDesc">Calculate longitude from ECEF coordinates.</p>
          <Formula
            tex={String.raw`\begin{aligned}
\lambda &= \arctan\left(\frac{Y}{X}\right)
\end{aligned}`}
          />
        </Section>

        <Section id="meridional-arc" title="Meridional arc">
          <p className="mathDesc">Accumulate northing along the central meridian.</p>
          <Formula
            tex={String.raw`\begin{aligned}
M(\phi) &= a\left(A_0\phi - A_2\sin 2\phi + A_4\sin 4\phi - A_6\sin 6\phi\right)
\end{aligned}`}
          />
        </Section>

        <Section id="auxiliary-values" title="Auxiliary values">
          <p className="mathDesc">Precompute terms used in the TM series.</p>
          <Formula
            tex={String.raw`\begin{aligned}
T &= \tan^2 \phi \\
C &= e'^2 \cos^2 \phi \\
A &= (\lambda - \lambda_0)\cos \phi
\end{aligned}`}
          />
        </Section>

        <Section id="easting-northing" title="Easting / Northing">
          <p className="mathDesc">TM series expansion to projected meters.</p>
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

        <Section id="proj4-definition" title="Proj4 definition used (EPSG:2039)">

          <p className="mathDesc">
            Used only for validation in the Accuracy section (GeoConverter does
            not depend on Proj4 at runtime).
          </p>

          <CodeBlock className="formula" 
            code={`import proj4 from "proj4";

proj4.defs(
  "EPSG:2039",
  "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 +k=1.0000067 " +
  "+x_0=219529.584 +y_0=626907.39 +ellps=GRS80 " +
  "+towgs84=23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262 " +
  "+units=m +no_defs +type=crs"
);`}
          />
        </Section>
      </div>
    </div>
  );
}
