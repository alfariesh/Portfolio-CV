import { Cell, Head } from "../components/Grid";
import { Link } from "../router/Link";

export function MissingPage() {
  return (
    <>
      <title>not found — Salman Alfariesh</title>
      <div className="grid">
        <Cell className="cell--head cell--missing">
          <Head
            eyebrow="404"
            title="a blank sheet"
            body="nothing is drawn at this address yet. The work and the notes are a click away."
          >
            <div className="missing__links">
              <Link className="btn btn--ink" href="/">
                back to the start
              </Link>
              <Link className="link link--accent" href="/notes">
                read the notes →
              </Link>
            </div>
          </Head>
        </Cell>
      </div>
    </>
  );
}
