"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";

export default function About({ permission }) {
  return (
    <>
      {Header(permission)}
      <main>
        <div className="main-content">
          <p>This page is even more work in progress that the rest of the site.</p>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  return { props: { permission } };
}